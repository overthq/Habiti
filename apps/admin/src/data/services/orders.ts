import { APIService } from './api';
import { Product } from './products';
import { Store } from './stores';
import { User } from './users';

export enum OrderStatus {
	Pending = 'Pending',
	Processing = 'Processing',
	Completed = 'Completed',
	Cancelled = 'Cancelled',
	Delivered = 'Delivered'
}

export interface OrderProduct {
	id: string;
	product: Product;
	quantity: number;
	unitPrice: number;
	createdAt: string;
	updatedAt: string;
}

export interface Order {
	id: string;
	userId: string;
	storeId: string;
	user: User;
	store: Store;
	products: OrderProduct[];
	total: number;
	status: OrderStatus;
	createdAt: string;
	updatedAt: string;
}

export interface OrderFilters {
	filter?: Record<string, string | number>;
	orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface UpdateOrderBody {
	status?: OrderStatus;
}

interface GetOrdersResponse {
	orders: Order[];
}

interface GetOrderResponse {
	order: Order;
}

interface UpdateOrderResponse {
	order: Order;
}

export class OrderService {
	constructor(private readonly api: APIService) {}

	async getOrders(params?: OrderFilters) {
		return this.api.get<GetOrdersResponse>('/orders', params);
	}

	async getOrder(id: string) {
		return this.api.get<GetOrderResponse>(`/orders/${id}`);
	}

	async updateOrder(id: string, body: UpdateOrderBody) {
		return this.api.patch<UpdateOrderResponse>(`/orders/${id}`, body);
	}

	async cancelOrder(id: string) {
		return this.api.patch<UpdateOrderResponse>(`/orders/${id}`, {
			status: OrderStatus.Cancelled
		});
	}
}
