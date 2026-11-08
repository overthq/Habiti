import * as SecureStore from 'expo-secure-store';

import env from './env';
import useStore from '../state';
import { queryClient } from './queryClient';

interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
}

let inflightRefresh: Promise<RefreshTokenResponse> | null = null;

export const endSession = async () => {
	await SecureStore.deleteItemAsync('refreshToken');
	useStore.getState().logOut();
	// The auth query is kept so App doesn't refetch it and loop back here.
	queryClient.removeQueries({
		predicate: query => query.queryKey[0] !== 'auth'
	});
};

const waitForHydration = () => {
	if (useStore.persist.hasHydrated()) return Promise.resolve();

	return new Promise<void>(resolve => {
		const unsubscribe = useStore.persist.onFinishHydration(() => {
			unsubscribe();
			resolve();
		});
	});
};

const performRefresh = async (): Promise<RefreshTokenResponse> => {
	const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

	if (!storedRefreshToken) {
		await endSession();
		throw new Error('No refresh token available');
	}

	// The refreshed token is scoped to the active store, so make sure it has
	// been loaded from storage before reading it.
	await waitForHydration();
	useStore.setState({ signedIn: true });
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

	// Only a 401 means the session is gone. Anything else (rate limits, server
	// errors, and network failures, which throw from fetch above) is temporary,
	// so the session is kept and the next request tries again.
	if (response.status === 401) {
		await endSession();
		throw new Error('Session expired');
	}

	const data = (await response.json().catch(() => null)) as
		| (Partial<RefreshTokenResponse> & {
				message?: string;
		  })
		| null;

	if (!response.ok) {
		throw new Error(data?.message ?? `Refresh failed (${response.status})`);
	}

	if (!data?.accessToken || !data.refreshToken) {
		throw new Error('Invalid refresh response');
	}

	useStore.getState().logIn(data.accessToken);
	await SecureStore.setItemAsync('refreshToken', data.refreshToken);

	return {
		accessToken: data.accessToken,
		refreshToken: data.refreshToken
	};
};

export const performLogout = async (): Promise<void> => {
	const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

	if (storedRefreshToken) {
		try {
			await fetch(`${env.apiUrl}/auth/logout`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken: storedRefreshToken })
			});
		} catch {}
	}

	await endSession();
};

export const refreshAuthTokens = async () => {
	if (!inflightRefresh) {
		inflightRefresh = performRefresh().finally(() => {
			inflightRefresh = null;
		});
	}

	return inflightRefresh;
};

export const activateStore = (storeId: string, accessToken: string) => {
	const { logIn, setPreference } = useStore.getState();

	logIn(accessToken);
	setPreference({ activeStore: storeId });
	queryClient.invalidateQueries({ queryKey: ['stores'] });
};
