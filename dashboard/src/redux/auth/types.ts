export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

interface AuthLoginAction {
	type: typeof AUTH_LOGIN;
	payload: {
		accessToken: string;
	};
}

interface AuthLogoutAction {
	type: typeof AUTH_LOGOUT;
}

export type AuthActionTypes = AuthLoginAction | AuthLogoutAction;
