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
		useStore.getState().logOut();
		throw new Error('No refresh token available');
	}

	const { activeStore } = useStore.getState();

	const response = await fetch(`${env.apiUrl}/auth/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			refreshToken: storedRefreshToken,
			storeId: activeStore ?? undefined
		})
	});

	const data = (await response.json()) as Partial<RefreshTokenResponse> & {
		message?: string;
	};

	if (!response.ok) {
		useStore.getState().logOut();
		await SecureStore.deleteItemAsync('refreshToken');
		throw new Error(data?.message ?? 'Refresh failed');
	}

	if (!data.accessToken || !data.refreshToken) {
		useStore.getState().logOut();
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
