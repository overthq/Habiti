import { StateCreator } from 'zustand';

import { AppState, Mutators, PreferencesSlice } from './types';

export const createPreferencesSlice: StateCreator<
	AppState,
	Mutators,
	[],
	PreferencesSlice
> = set => ({
	theme: 'light',
	activeStore: null,
	setPreference: set
});
