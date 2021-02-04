export const UPDATE_PREFERENCE = 'preferences/UPDATE_PREFERENCE';

export interface PreferencesState {
	activeStore: string | null;
	theme: 'light' | 'dark';
}

interface UpdatePreferenceAction {
	type: typeof UPDATE_PREFERENCE;
	payload: Partial<PreferencesState>;
}

export type PreferencesActionTypes = UpdatePreferenceAction;
