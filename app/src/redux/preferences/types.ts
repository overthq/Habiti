export const UPDATE_PREFERENCE = 'preferences/UPDATE_PREFERENCE';

export interface PreferencesState {
	theme: 'light' | 'dark';
	defaultCardId?: string;
}

interface UpdatePreferenceAction {
	type: typeof UPDATE_PREFERENCE;
	payload: Partial<PreferencesState>;
}

export type PreferencesActionTypes = UpdatePreferenceAction;
