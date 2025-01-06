import { APIService } from './api';

export interface LoginBody {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
}

export class AuthService {
	constructor(private readonly api: APIService) {}

	async login(body: LoginBody) {
		return this.api.post<LoginResponse>('/admin/login', body);
	}
}
