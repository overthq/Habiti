import {
	configureApi,
	logout,
	refreshSession,
	startAnonymousSession
} from '@habiti/data';

import env from '@/lib/env';
import { useAuthStore } from '@/state/auth-store';

// The refresh token lives in an httpOnly cookie, so both of these only need
// to persist the new access token.
const refreshToken = async () => {
	const { accessToken } = await refreshSession();
	useAuthStore.getState().logIn({ accessToken });
	return accessToken;
};

const startGuestSession = async () => {
	const { accessToken } = await startAnonymousSession();
	useAuthStore.getState().logIn({ accessToken });
	return accessToken;
};

/**
 * Guarantee a usable session: resume the stored one if possible, otherwise
 * start a fresh anonymous (guest) session. The web app never requires the
 * user to authenticate just to browse — auth is only prompted in-context
 * (viewing orders, placing an order).
 */
export const ensureSession = async () => {
	try {
		return await refreshToken();
	} catch {
		return startGuestSession();
	}
};

/**
 * Log out: revoke the session server-side (best effort, via the refresh
 * cookie), then roll straight into a new guest session so the app stays
 * usable. Only falls back to the logged-out state if the guest session
 * cannot be created (e.g. offline).
 */
export const performLogout = async (): Promise<void> => {
	try {
		await logout();
	} catch {
		// Best effort — the cookie is replaced by the new guest session
		// below either way, and the server prunes expired sessions.
	}

	try {
		await startGuestSession();
	} catch {
		useAuthStore.getState().logOut();
	}
};

configureApi({
	baseURL: env.apiUrl,
	getAccessToken: () => useAuthStore.getState().accessToken,
	refreshAccessToken: async () => {
		await ensureSession();
	},
	onSessionExpired: () => useAuthStore.getState().logOut()
});
