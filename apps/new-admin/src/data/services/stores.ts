import { APIService } from './api';
import { Order } from './orders';
import { Product } from './products';

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

export interface Payout {
	id: string;
	amount: number;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface GetStoresResponse {
	stores: Store[];
}

export interface StoreFilters {
	filter?: Record<string, string | number>;
	orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface UpdateStoreBody {
	name?: string;
	description?: string;
}

export interface GetStoreProductsResponse {
	products: Product[];
}

export interface GetStoreResponse {
	store: Store;
}

export interface GetStoreManagersResponse {
	managers: {
		manager: {
			id: string;
			name: string;
			email: string;
		};
	}[];
}

export interface GetStorePayoutsResponse {
	payouts: Payout[];
}

export interface GetStoreOrdersResponse {
	orders: Order[];
}

export class StoreService {
	constructor(private readonly api: APIService) {}

	async getStores(params?: StoreFilters) {
		return this.api.get<GetStoresResponse>('/stores', params);
	}

	async getStore(id: string) {
		return this.api.get<GetStoreResponse>(`/stores/${id}`);
	}

	async updateStore(id: string, body: UpdateStoreBody) {
		return this.api.patch<Store>(`/stores/${id}`, body);
	}

	async deleteStore(id: string) {
		return this.api.delete<void>(`/stores/${id}`);
	}

	async getStoreProducts(id: string, params?: StoreFilters) {
		return this.api.get<GetStoreProductsResponse>(
			`/stores/${id}/products`,
			params
		);
	}

	async getStoreOrders(id: string, params?: StoreFilters) {
		return this.api.get<GetStoreOrdersResponse>(`/stores/${id}/orders`, params);
	}

	async getStorePayouts(id: string, params?: StoreFilters) {
		return this.api.get<GetStorePayoutsResponse>(
			`/stores/${id}/payouts`,
			params
		);
	}

	async getStoreManagers(id: string, params?: StoreFilters) {
		return this.api.get<GetStoreManagersResponse>(
			`/stores/${id}/managers`,
			params
		);
	}
}
