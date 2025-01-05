import APIService from './api';

export interface SignUpBody {
	name: string;
	email: string;
	password: string;
}

export interface LogInBody {
	email: string;
	password: string;
}

export interface ResetPasswordBody {
	token: string;
	password: string;
}

export interface AppleAuthBody {
	code: string;
}

export default class AuthService {
	private api: APIService;

	constructor(api: APIService) {
		this.api = api;
	}

	public signUp(body: SignUpBody) {
		return this.api.post('/auth/register', body, false);
	}

	public logIn(body: LogInBody) {
		return this.api.post('/auth/login', body, false);
	}

	public resetPassword(body: ResetPasswordBody) {
		return this.api.post('/auth/reset-password', body, false);
	}

	public authenticateWithApple(body: AppleAuthBody) {
		return this.api.post('/auth/apple-callback', body, false);
	}
}
