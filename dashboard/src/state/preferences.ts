import { PreferencesSlice, StoreSlice } from './types';

export const createPreferencesSlice: StoreSlice<PreferencesSlice> = set => ({
	theme: 'light',
	activeStore: null,
	setPreference: set
});
