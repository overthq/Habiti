import axios from 'axios';
import env from '../../env';
import useStore from '../state';
import { refreshAuthTokens } from '../utils/refreshManager';
import { AuthenticateBody, RegisterBody } from './types';

const api = axios.create({
	baseURL: env.apiUrl,
	withCredentials: true
});

api.interceptors.request.use(config => {
	const { accessToken } = useStore.getState();

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const { accessToken } = await refreshAuthTokens();

				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				useStore.getState().logOut();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export const authenticate = async (input: AuthenticateBody) => {
	const response = await api.post('/auth/login', input);
	return response.data;
};

export const register = async (input: RegisterBody) => {
	const response = await api.post('/auth/register', input);
	return response.data;
};
