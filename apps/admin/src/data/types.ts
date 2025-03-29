export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateUserBody {
	name?: string;
	email?: string;
}

export interface GetUsersResponse {
	users: User[];
}

export interface GetUserResponse {
	user: User;
}

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

export enum OrderStatus {
	Pending = 'Pending',
	Processing = 'Processing',
	Completed = 'Completed',
	Cancelled = 'Cancelled',
	Delivered = 'Delivered'
}

export interface OrderProduct {
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

export interface Product {
	id: string;
	name: string;
	description: string;
	unitPrice: number;
	quantity: number;
	images: {
		id: string;
		path: string;
	}[];
	storeId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductFilters {
	filter?: Record<string, string | number>;
	orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface CreateProductBody {
	name: string;
	description: string;
	unitPrice: number;
	quantity: number;
	storeId: string;
}

export interface UpdateProductBody {
	name?: string;
	description?: string;
	unitPrice?: number;
	quantity?: number;
}

export interface GetProductsResponse {
	products: Product[];
}

export interface GetProductResponse {
	product: Product;
}

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

export interface UpdateOrderBody {
	status?: OrderStatus;
}

export interface GetOrdersResponse {
	orders: Order[];
}

export interface GetOrderResponse {
	order: Order;
}

export interface UpdateOrderResponse {
	order: Order;
}
