import { APIService } from './api';

export interface Admin {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export interface LoginBody {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	adminId: string;
}

export interface CreateAdminBody {
	name: string;
	email: string;
	password: string;
}

export interface CreateAdminResponse {
	admin: Admin;
}

export class AuthService {
	constructor(private readonly api: APIService) {}

	async login(body: LoginBody) {
		return this.api.post<LoginResponse>('/admin/login', body);
	}

	async createAdmin(body: CreateAdminBody) {
		return this.api.post<CreateAdminResponse>('/admin/register', body);
	}
}
