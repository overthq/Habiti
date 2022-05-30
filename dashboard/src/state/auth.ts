import { AuthSlice, StoreSlice } from './types';

export const createAuthSlice: StoreSlice<AuthSlice> = set => ({
	userId: null,
	accessToken: null,
	logIn: (userId, accessToken) => {
		set({ userId, accessToken });
	},
	logOut: () => {
		set({ userId: null, accessToken: null });
	}
});
