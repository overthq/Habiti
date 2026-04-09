export interface User {
	id: string;
	name: string;
	email: string;
	suspended: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateUserBody {
	name?: string;
	email?: string;
	suspended?: boolean;
}

export interface UserFilters {
	search?: string;
	suspended?: boolean;
	orderBy?: Partial<
		Record<'name' | 'email' | 'createdAt' | 'updatedAt', 'asc' | 'desc'>
	>;
}

export interface GetUsersResponse {
	users: User[];
}

export interface GetUserResponse {
	user: User;
}

export interface Session {
	id: string;
	userId: string;
	userAgent: string | null;
	ipAddress: string | null;
	lastActiveAt: string;
	revoked: boolean;
	createdAt: string;
}

export interface GetUserSessionsResponse {
	sessions: Session[];
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
	PaymentPending = 'PaymentPending',
	Completed = 'Completed',
	Cancelled = 'Cancelled',
	ReadyForPickup = 'ReadyForPickup'
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
	serialNumber: number;
	user: User;
	store: Store;
	products: OrderProduct[];
	total: number;
	status: OrderStatus;
	createdAt: string;
	updatedAt: string;
}

export interface OrderFilters {
	status?: OrderStatus;
	storeId?: string;
	userId?: string;
	minTotal?: number;
	maxTotal?: number;
	dateFrom?: string;
	dateTo?: string;
	orderBy?: Partial<
		Record<'total' | 'createdAt' | 'updatedAt', 'asc' | 'desc'>
	>;
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
	store: Store;
	createdAt: string;
	updatedAt: string;
}

export interface ProductFilters {
	search?: string;
	categoryId?: string;
	storeId?: string;
	status?: ProductStatus;
	inStock?: boolean;
	minPrice?: number;
	maxPrice?: number;
	orderBy?: Partial<
		Record<
			'unitPrice' | 'quantity' | 'name' | 'createdAt' | 'updatedAt',
			'asc' | 'desc'
		>
	>;
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
	unlisted: boolean;
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
	unlisted?: boolean;
}

export interface CreateStoreBody {
	name: string;
	description?: string;
}

export interface GetStoreProductsResponse {
	products: Product[];
}

export interface GetStoreResponse {
	store: Store;
}

export interface StoreManager {
	managerId: string;
	manager: User;
	storeId: string;
	store: Store;
}

export interface GetStoreManagersResponse {
	managers: StoreManager[];
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

export interface GetOverviewResponse {
	totalStores: number;
	totalOrders: number;
	totalProducts: number;
	totalUsers: number;
	totalRevenue: number;
}

// Transactions

export enum TransactionType {
	Revenue = 'Revenue',
	Payout = 'Payout',
	SubscriptionFee = 'SubscriptionFee',
	Adjustment = 'Adjustment',
	Refund = 'Refund'
}

export enum TransactionStatus {
	Processing = 'Processing',
	Success = 'Success',
	Failure = 'Failure'
}

export interface Transaction {
	id: string;
	storeId: string;
	type: TransactionType;
	status: TransactionStatus;
	amount: number;
	description?: string;
	orderId?: string;
	balanceAfter: number;
	createdAt: string;
	updatedAt: string;
	order?: Order;
}

export interface TransactionFilters {
	type?: TransactionType;
	from?: string;
	to?: string;
	limit?: number;
	offset?: number;
}

export interface GetStoreTransactionsResponse {
	transactions: Transaction[];
}

export interface UpdateTransactionBody {
	status: TransactionStatus;
}

export interface UpdateTransactionResponse {
	transaction: Transaction;
}

// Bulk Action Types
export enum ProductStatus {
	Active = 'Active',
	Draft = 'Draft'
}

export interface BulkActionBody {
	ids: string[];
}

export interface BulkOrderStatusBody {
	ids: string[];
	status: OrderStatus;
}

export interface BulkProductStatusBody {
	ids: string[];
	status: ProductStatus;
}

export interface BulkActionResponse {
	count: number;
}
