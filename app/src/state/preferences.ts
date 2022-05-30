import { PreferencesSlice, StoreSlice } from './types';

export const createPreferencesSlice: StoreSlice<PreferencesSlice> = set => ({
	theme: 'light',
	defaultCard: null,
	setPreference: set
});
