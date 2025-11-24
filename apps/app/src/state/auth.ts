import { StateCreator } from 'zustand';

import { AuthSlice, AppState, Mutators } from './types';

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
		set({ accessToken: null });
	}
});
