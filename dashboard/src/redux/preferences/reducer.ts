import { PreferencesState, PreferencesActionTypes } from './types';

const initialState: PreferencesState = {
	activeStore: null,
	theme: 'light'
};

const preferencesReducer = (
	state = initialState,
	action: PreferencesActionTypes
) => {
	switch (action.type) {
		case UPDATE_PREFERENCE:
			return { ...state, ...action.payload };
		default:
			return state;
	}
};

export default preferencesReducer;
