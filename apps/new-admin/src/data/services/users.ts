import { APIService } from './api';

export interface UpdateUserBody {
	name?: string;
	email?: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export interface GetUsersResponse {
	users: User[];
}

export interface GetUserResponse {
	user: User;
}

export class UserService {
	constructor(private readonly api: APIService) {}

	async getUsers() {
		return this.api.get<GetUsersResponse>('/users');
	}

	async getUser(id: string) {
		return this.api.get<GetUserResponse>(`/users/${id}`);
	}

	async updateUser(id: string, body: UpdateUserBody) {
		return this.api.patch<GetUserResponse>(`/users/${id}`, body);
	}
}
