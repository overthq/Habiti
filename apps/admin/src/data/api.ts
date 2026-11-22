import { configureApi, refreshAdminSession } from '@habiti/data';

const getAccessToken = () =>
	typeof window === 'undefined' ? null : localStorage.getItem('accessToken');

configureApi({
	baseURL: import.meta.env.VITE_API_URL,
	getAccessToken,
	refreshAccessToken: async () => {
		const { accessToken } = await refreshAdminSession();
		localStorage.setItem('accessToken', accessToken);
	},
	onSessionExpired: () => {
		localStorage.removeItem('accessToken');
		window.location.href = '/login';
	}
});
