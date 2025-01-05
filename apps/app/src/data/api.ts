import env from '../../env';
import useStore from '../state';

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

	public async post<T extends object>(path: string, body: T, needsAuth = true) {
		const response = await fetch(`${env.apiUrl}${path}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...(needsAuth ? { Authorization: `Bearer ${this.accessToken}` } : {})
			},
			body: JSON.stringify(body)
		});

		const data = await response.json();

		return data;
	}

	public async get(path: string, params?: Record<string, any>) {
		const url = this.buildUrl(path, params);

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`
			}
		});

		const data = await response.json();

		return data;
	}

	public async put<T extends object>(path: string, body: T) {
		const response = await fetch(`${env.apiUrl}${path}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`
			},
			body: JSON.stringify(body)
		});

		const data = await response.json();

		return data;
	}

	public async patch<T extends object>(path: string, body: T) {
		const response = await fetch(`${env.apiUrl}${path}`, {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`
			},
			body: JSON.stringify(body)
		});

		const data = await response.json();

		return data;
	}

	public async delete(path: string) {
		const response = await fetch(`${env.apiUrl}${path}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${this.accessToken}`
			}
		});

		const data = await response.json();

		return data;
	}
}
