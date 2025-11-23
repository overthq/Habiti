import env from '../../env';
import useStore from '../state';
import * as SecureStore from 'expo-secure-store';

export default class API {
	private get accessToken() {
		const { accessToken } = useStore.getState();

		if (!accessToken) {
			throw new Error('No access token');
		}

		return accessToken;
	}

	private buildUrl(path: string, params?: Record<string, any>) {
		const url = new URL(`${env.apiUrl}${path}`);

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					if (typeof value === 'object') {
						url.searchParams.append(key, JSON.stringify(value));
					} else {
						url.searchParams.append(key, String(value));
					}
				}
			});
		}

		return url.toString();
	}

	private async request<T>(
		path: string,
		options: RequestInit,
		needsAuth = true
	): Promise<T> {
		const headers: Record<string, string> = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(options.headers as Record<string, string>)
		};

		if (needsAuth) {
			headers.Authorization = `Bearer ${this.accessToken}`;
		}

		const response = await fetch(`${env.apiUrl}${path}`, {
			...options,
			headers
		});

		if (response.status === 401 && needsAuth) {
			try {
				const refreshToken = await SecureStore.getItemAsync('refreshToken');
				if (!refreshToken) throw new Error('No refresh token');

				const refreshResponse = await fetch(`${env.apiUrl}/auth/refresh`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Cookie: `refreshToken=${refreshToken}`
					},
					body: JSON.stringify({ refreshToken }) // Send in body too just in case
				});

				if (!refreshResponse.ok) throw new Error('Refresh failed');

				const data = await refreshResponse.json();
				useStore.getState().logIn(data.userId, data.accessToken);
				await SecureStore.setItemAsync('refreshToken', data.refreshToken);

				// Retry original request
				headers.Authorization = `Bearer ${data.accessToken}`;
				const retryResponse = await fetch(`${env.apiUrl}${path}`, {
					...options,
					headers
				});

				return retryResponse.json();
			} catch (error) {
				useStore.getState().logOut();
				await SecureStore.deleteItemAsync('refreshToken');
				throw error;
			}
		}

		return response.json();
	}

	public async post<T extends object>(path: string, body: T, needsAuth = true) {
		return this.request<any>(
			path,
			{
				method: 'POST',
				body: JSON.stringify(body)
			},
			needsAuth
		);
	}

	public async get(path: string, params?: Record<string, any>) {
		const url = this.buildUrl(path, params);
		// Extract path and query from full URL for request method
		const relativePath = url.replace(env.apiUrl, '');
		return this.request<any>(relativePath, { method: 'GET' });
	}

	public async put<T extends object>(path: string, body: T) {
		return this.request<any>(path, {
			method: 'PUT',
			body: JSON.stringify(body)
		});
	}

	public async patch<T extends object>(path: string, body: T) {
		return this.request<any>(path, {
			method: 'PATCH',
			body: JSON.stringify(body)
		});
	}

	public async delete(path: string) {
		return this.request<any>(path, { method: 'DELETE' });
	}
}
