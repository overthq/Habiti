import { AppThunk } from '../store';
import { PreferencesState, UPDATE_PREFERENCE } from './types';

export const updatePreference = (
	preference: Partial<PreferencesState>
): AppThunk => dispatch => {
	dispatch({ type: UPDATE_PREFERENCE, payload: preference });
};
