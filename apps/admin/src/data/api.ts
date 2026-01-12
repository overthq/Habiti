import axios, {
	type AxiosInstance,
	type AxiosError,
	type InternalAxiosRequestConfig
} from 'axios';

interface QueuedRequest {
	resolve: (value: unknown) => void;
	reject: (reason?: unknown) => void;
	config: InternalAxiosRequestConfig;
}

export class APIService {
	private api: AxiosInstance;
	private isRefreshing = false;
	private failedQueue: QueuedRequest[] = [];

	constructor() {
		this.api = axios.create({
			baseURL: import.meta.env.VITE_API_URL,
			headers: {
				'Content-Type': 'application/json'
			},
			withCredentials: true
		});

		this.api.interceptors.request.use(config => {
			const token = localStorage.getItem('accessToken');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		this.api.interceptors.response.use(
			response => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as InternalAxiosRequestConfig & {
					_retry?: boolean;
				};

				if (error.response?.status === 401 && !originalRequest._retry) {
					// Don't retry refresh or login requests
					if (
						originalRequest.url?.includes('/admin/refresh') ||
						originalRequest.url?.includes('/admin/login')
					) {
						return Promise.reject(error);
					}

					if (this.isRefreshing) {
						return new Promise((resolve, reject) => {
							this.failedQueue.push({
								resolve,
								reject,
								config: originalRequest
							});
						});
					}

					originalRequest._retry = true;
					this.isRefreshing = true;

					try {
						const response = await this.api.post('/admin/refresh');
						const { accessToken } = response.data;

						localStorage.setItem('accessToken', accessToken);

						this.failedQueue.forEach(({ resolve, config }) => {
							config.headers.Authorization = `Bearer ${accessToken}`;
							resolve(this.api(config));
						});
						this.failedQueue = [];

						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						return this.api(originalRequest);
					} catch (refreshError) {
						this.failedQueue.forEach(({ reject }) => reject(refreshError));
						this.failedQueue = [];

						localStorage.removeItem('accessToken');
						window.location.href = '/login';
						return Promise.reject(refreshError);
					} finally {
						this.isRefreshing = false;
					}
				}

				return Promise.reject(error);
			}
		);
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

	async delete<T>(path: string, body?: object): Promise<T> {
		const response = await this.api.delete(path, { data: body });
		return response.data;
	}
}

export const api = new APIService();
