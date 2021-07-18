import { AuthActionTypes, AUTH_LOGIN, AUTH_LOGOUT } from './types';

interface AuthInitialState {
	accessToken: string | null;
	userId: string | null;
}

const initialState: AuthInitialState = {
	accessToken: null,
	userId: null
};

const authReducer = (state = initialState, action: AuthActionTypes) => {
	switch (action.type) {
		case AUTH_LOGIN:
			return {
				accessToken: action.payload.accessToken,
				userId: action.payload.userId
			};
		case AUTH_LOGOUT:
			return { accessToken: null, userId: null };
		default:
			return state;
	}
};

export default authReducer;
