import { StateCreator } from 'zustand';

import { AppState, AuthSlice, Mutators } from './types';

export const createAuthSlice: StateCreator<
	AppState,
	Mutators,
	[],
	AuthSlice
> = set => ({
	accessToken: null,
	signedIn: false,
	logIn: accessToken => {
		set({ accessToken, signedIn: true });
	},
	logOut: () => {
		set({ accessToken: null, signedIn: false, activeStore: null });
	}
});
