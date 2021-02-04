import { AppThunk } from '../store';
import { AUTH_LOGIN, AUTH_LOGOUT } from './types';

export const login = (accessToken: string): AppThunk => dispatch => {
	dispatch({
		type: AUTH_LOGIN,
		payload: { accessToken }
	});
};

export const logOut = (): AppThunk => dispatch => {
	dispatch({ type: AUTH_LOGOUT });
};
