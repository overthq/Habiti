import { AppThunk } from '../store';
import { AUTH_LOGIN, AUTH_LOGOUT } from './types';

export const login = (
	accessToken: string,
	userId: string
): AppThunk => dispatch => {
	dispatch({
		type: AUTH_LOGIN,
		payload: { accessToken, userId }
	});
};

export const logOut = (): AppThunk => dispatch => {
	dispatch({ type: AUTH_LOGOUT });
};
