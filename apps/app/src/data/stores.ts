import APIService from './api';

export interface StoreFilters {
	filter?: Record<string, any>;
	orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface UpdateStoreBody {
	name?: string;
	description?: string;
}

export default class StoreService {
	private api: APIService;

	constructor(api: APIService) {
		this.api = api;
	}

	public getStores(params?: StoreFilters) {
		return this.api.get('/stores', { params });
	}

	public getStore(id: string) {
		return this.api.get(`/stores/${id}`);
	}

	public getCurrentStore() {
		return this.api.get('/stores/current');
	}

	public updateStore(body: UpdateStoreBody) {
		return this.api.patch('/stores/current', body);
	}

	public followStore(id: string) {
		return this.api.post(`/stores/${id}/follow`, {});
	}

	public unfollowStore(id: string) {
		return this.api.delete(`/stores/${id}/follow`);
	}

	public getStoreProducts(id: string, params?: StoreFilters) {
		return this.api.get(`/stores/${id}/products`, { params });
	}

	public getStoreOrders(id: string, params?: StoreFilters) {
		return this.api.get(`/stores/${id}/orders`, { params });
	}
}
