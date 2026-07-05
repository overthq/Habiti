import * as SecureStore from 'expo-secure-store';

import env from '../../env';
import useStore from '../state';

interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
}

let inflightRefresh: Promise<RefreshTokenResponse> | null = null;

const performRefresh = async (): Promise<RefreshTokenResponse> => {
	const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

	if (!storedRefreshToken) {
		throw new Error('No refresh token available');
	}

	const response = await fetch(`${env.apiUrl}/auth/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ refreshToken: storedRefreshToken })
	});

	const data = (await response.json()) as Partial<RefreshTokenResponse> & {
		message?: string;
	};

	if (!response.ok) {
		throw new Error(data?.message ?? 'Refresh failed');
	}

	if (!data.accessToken || !data.refreshToken) {
		throw new Error('Invalid refresh response');
	}

	useStore.getState().logIn(data.accessToken);
	await SecureStore.setItemAsync('refreshToken', data.refreshToken);

	return {
		accessToken: data.accessToken,
		refreshToken: data.refreshToken
	};
};

export const refreshAuthTokens = async () => {
	if (!inflightRefresh) {
		inflightRefresh = performRefresh().finally(() => {
			inflightRefresh = null;
		});
	}

	return inflightRefresh;
};

export const startGuestSession = async (): Promise<RefreshTokenResponse> => {
	const response = await fetch(`${env.apiUrl}/auth/anonymous`, {
		method: 'POST'
	});

	const data = (await response.json()) as Partial<RefreshTokenResponse>;

	if (!response.ok || !data.accessToken || !data.refreshToken) {
		throw new Error('Could not start a guest session');
	}

	useStore.getState().logIn(data.accessToken);
	await SecureStore.setItemAsync('refreshToken', data.refreshToken);

	return {
		accessToken: data.accessToken,
		refreshToken: data.refreshToken
	};
};

/**
 * Guarantee a usable session: resume the stored one if possible, otherwise
 * start a fresh anonymous (guest) session. The app never requires the user
 * to authenticate just to get in — auth is only prompted in-context (saving
 * progress, placing an order).
 */
export const ensureSession = async (): Promise<RefreshTokenResponse> => {
	try {
		return await refreshAuthTokens();
	} catch {
		return startGuestSession();
	}
};

/**
 * Log out: revoke the session server-side (best effort), drop the stored
 * refresh token, then roll straight into a new guest session so the app
 * stays usable. Only falls back to the logged-out state if the guest
 * session cannot be created (e.g. offline).
 */
export const performLogout = async (): Promise<void> => {
	const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
	await SecureStore.deleteItemAsync('refreshToken');

	if (storedRefreshToken) {
		try {
			await fetch(`${env.apiUrl}/auth/logout`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken: storedRefreshToken })
			});
		} catch {
			// Best effort — the token is gone locally either way, and the
			// server prunes expired sessions.
		}
	}

	try {
		await startGuestSession();
	} catch {
		useStore.getState().logOut();
	}
};
