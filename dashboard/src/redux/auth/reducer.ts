import { AuthActionTypes, AUTH_LOGIN, AUTH_LOGOUT } from './types';

interface AuthInitialState {
	accessToken: string | null;
}

const initialState: AuthInitialState = {
	accessToken: null
};

const authReducer = (state = initialState, action: AuthActionTypes) => {
	switch (action.type) {
		case AUTH_LOGIN:
			return {
				accessToken: action.payload.accessToken
			};
		case AUTH_LOGOUT:
			return {
				accessToken: null
			};
		default:
			return state;
	}
};

export default authReducer;
