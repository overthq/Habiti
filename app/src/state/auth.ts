import { StateCreator } from 'zustand';
import { AuthSlice, AppState, Mutators } from './types';

export const createAuthSlice: StateCreator<
	AppState,
	Mutators,
	[],
	AuthSlice
> = set => ({
	userId: null,
	accessToken: null,
	logIn: (userId, accessToken) => {
		set({ userId, accessToken });
	},
	logOut: () => {
		set({ userId: null, accessToken: null });
	}
});
