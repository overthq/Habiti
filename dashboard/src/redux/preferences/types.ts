export const UPDATE_PREFERENCE = 'preferences/UPDATE_PREFERENCE';

export type Theme = 'light' | 'dark';

export interface PreferencesState {
	activeStore: string | null;
	theme: Theme;
}

interface UpdatePreferenceAction {
	type: typeof UPDATE_PREFERENCE;
	payload: Partial<PreferencesState>;
}

export type PreferencesActionTypes = UpdatePreferenceAction;
