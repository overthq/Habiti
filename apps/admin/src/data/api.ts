import axios, { AxiosInstance } from 'axios';

export class APIService {
	private api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: import.meta.env.BASE_URL,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		this.api.interceptors.request.use(config => {
			const token = localStorage.getItem('accessToken');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});
	}

	async get<T>(path: string, params?: object): Promise<T> {
		const response = await this.api.get(path, { params });
		return response.data;
	}

	async post<T>(path: string, body: object): Promise<T> {
		const response = await this.api.post(path, body);
		return response.data;
	}

	async put<T>(path: string, body: object): Promise<T> {
		const response = await this.api.put(path, body);
		return response.data;
	}

	async patch<T>(path: string, body: object): Promise<T> {
		const response = await this.api.patch(path, body);
		return response.data;
	}

	async delete<T>(path: string): Promise<T> {
		const response = await this.api.delete(path);
		return response.data;
	}
}

export const api = new APIService();
