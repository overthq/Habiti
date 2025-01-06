import { APIService } from './api';

export interface Store {
	id: string;
	name: string;
	description: string;
	image?: {
		id: string;
		path: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface StoreFilters {
	filter?: Record<string, any>;
	orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface UpdateStoreBody {
	name?: string;
	description?: string;
}

export class StoreService {
	constructor(private readonly api: APIService) {}

	async getStores(params?: StoreFilters) {
		return this.api.get<Store[]>('/stores', params);
	}

	async getStore(id: string) {
		return this.api.get<Store>(`/stores/${id}`);
	}

	async updateStore(id: string, body: UpdateStoreBody) {
		return this.api.patch<Store>(`/stores/${id}`, body);
	}

	async deleteStore(id: string) {
		return this.api.delete<void>(`/stores/${id}`);
	}

	async getStoreProducts(id: string, params?: StoreFilters) {
		return this.api.get(`/stores/${id}/products`, params);
	}

	async getStoreOrders(id: string, params?: StoreFilters) {
		return this.api.get(`/stores/${id}/orders`, params);
	}
}
