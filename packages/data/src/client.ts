import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import {
	computeRetryDelayMs,
	extractRetryAfterSec,
	shouldAutoRetry,
	sleep
} from './rateLimit';

export interface ApiConfig {
	baseURL: string;
	getAccessToken: () => string | null | undefined;
	// Called on a 401. Must persist the new access token so getAccessToken()
	// returns it, and throw if the session can't be recovered. Concurrent 401s
	// share a single call.
	refreshAccessToken: () => Promise<void>;
	onSessionExpired?: () => void;
}

export type ApiError = AxiosError<{ message?: string }> & {
	retryAfterSeconds?: number;
};

type RetriableRequest = InternalAxiosRequestConfig & {
	_retry?: boolean;
	_rateLimitRetry?: boolean;
};

// A 401 from these means bad credentials or a dead session, so refreshing and
// retrying would either be pointless or recurse into the refresh itself.
const NO_REFRESH_ROUTES = new Set([
	'/auth/login',
	'/auth/register',
	'/auth/verify-code',
	'/auth/apple',
	'/auth/anonymous',
	'/auth/refresh',
	'/auth/logout',
	'/admin/login',
	'/admin/refresh',
	'/admin/logout'
]);

export const api = axios.create({ withCredentials: true });

let config: ApiConfig | null = null;
let inflightRefresh: Promise<void> | null = null;

export const configureApi = (next: ApiConfig) => {
	config = next;
	api.defaults.baseURL = next.baseURL;
};

api.interceptors.request.use(request => {
	if (!config) {
		throw new Error('@habiti/data: call configureApi() before any request');
	}

	const token = config.getAccessToken();
	if (token) {
		request.headers.Authorization = `Bearer ${token}`;
	}

	return request;
});

api.interceptors.response.use(undefined, async (error: AxiosError) => {
	const request = error.config as RetriableRequest | undefined;
	const response = error.response;

	if (!request || !response || !config) {
		return Promise.reject(error);
	}

	// Auto-retry only short waits (once per request); longer ones surface to
	// the UI with retryAfterSeconds attached.
	if (response.status === 429 && !request._rateLimitRetry) {
		const delaySec = extractRetryAfterSec(
			response.headers as Record<string, string>
		);

		if (shouldAutoRetry(delaySec)) {
			request._rateLimitRetry = true;
			await sleep(computeRetryDelayMs(delaySec!));
			return api(request);
		}

		(error as ApiError).retryAfterSeconds = delaySec ?? undefined;
	}

	if (
		response.status === 401 &&
		!request._retry &&
		!NO_REFRESH_ROUTES.has(request.url ?? '')
	) {
		request._retry = true;

		const { refreshAccessToken, onSessionExpired } = config;

		inflightRefresh ??= refreshAccessToken()
			.catch(refreshError => {
				onSessionExpired?.();
				throw refreshError;
			})
			.finally(() => {
				inflightRefresh = null;
			});

		try {
			await inflightRefresh;
		} catch {
			return Promise.reject(error);
		}

		return api(request);
	}

	return Promise.reject(error);
});
