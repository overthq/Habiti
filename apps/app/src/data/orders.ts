import APIService from './api';

export interface CreateOrderBody {
	cartId: string;
	cardId: string;
	transactionFee: number;
	serviceFee: number;
}

export interface OrderFilters {
	filter?: Record<string, any>;
	orderBy?: Record<string, 'asc' | 'desc'>;
}

export default class OrderService {
	private api: APIService;

	constructor(api: APIService) {
		this.api = api;
	}

	public getOrders(params?: OrderFilters) {
		return this.api.get('/orders', { params });
	}

	public getOrder(id: string) {
		return this.api.get(`/orders/${id}`);
	}

	public createOrder(body: CreateOrderBody) {
		return this.api.post('/orders', body);
	}

	public updateOrder(id: string, body: CreateOrderBody) {
		return this.api.patch(`/orders/${id}`, body);
	}

	public cancelOrder(id: string) {
		return this.api.delete(`/orders/${id}`);
	}
}
