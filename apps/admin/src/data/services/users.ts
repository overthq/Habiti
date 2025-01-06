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

export class UserService {
	constructor(private readonly api: APIService) {}

	async getUsers() {
		return this.api.get<User[]>('/users');
	}

	async getUser(id: string) {
		return this.api.get<User>(`/users/${id}`);
	}

	async updateUser(id: string, body: UpdateUserBody) {
		return this.api.patch<User>(`/users/${id}`, body);
	}
}
