import { AuthSlice, StoreSlice } from './types';

export const createAuthSlice: StoreSlice<AuthSlice> = set => ({
	userId: null,
	accessToken: null,
	logIn: (userId: string, accessToken: string) => {
		set({ userId, accessToken });
	},
	logOut: () => {
		set({ userId: null, accessToken: null });
	}
});
