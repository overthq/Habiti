import { StateCreator } from 'zustand';

import { AppState, AuthSlice, Mutators } from './types';

export const createAuthSlice: StateCreator<
	AppState,
	Mutators,
	[],
	AuthSlice
> = set => ({
	accessToken: null,
	logIn: accessToken => {
		set({ accessToken });
	},
	logOut: () => {
		set({ accessToken: null, activeStore: null });
	}
});
