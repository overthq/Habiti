export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	createdAt: string;
	updatedAt: string;
	orders: Order[];
	followed: StoreFollower[];
	cards: Card[];
	deliveryAddresses: DeliveryAddress[];
}

export interface Store {
	id: string;
	name: string;
	description: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	unlisted: boolean;
	bankAccountNumber?: string;
	realizedRevenue: number;
	unrealizedRevenue: number;
	paidOut: number;
	image?: Image;
	products: Product[];
	categories: StoreProductCategory[];
	createdAt: string;
	updatedAt: string;
}

export interface Product {
	id: string;
	name: string;
	description: string;
	quantity: number;
	images: Image[];
	categories: ProductCategory[];
	unitPrice: number;
	createdAt: string;
	updatedAt: string;
}

enum ProductStatus {
	Active = 'active'
}

export interface ProductFilters {
	search?: string;
	categoryId?: string;
	storeId?: string;
	status?: ProductStatus;
	inStock?: string;
	minPrice?: number;
	maxPrice?: number;
	orderBy?: Partial<
		Record<
			'unitPrice' | 'quantity' | 'name' | 'createdAt' | 'updatedAt',
			'asc' | 'desc'
		>
	>;
}

export interface Cart {
	id: string;
	userId: string;
	storeId: string;
	total: number;
	products: CartProduct[];
	store: Store;
	createdAt: string;
	updatedAt: string;
}

export interface Card {
	id: string;
	cardType: string;
	last4: string;
	expMonth: number;
	expYear: number;
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface Order {
	id: string;
	userId: string;
	user: User;
	store: Store;
	products: OrderProduct[];
	total: number;
	serviceFee: number;
	transactionFee: number;
	status: OrderStatus;
	createdAt: string;
	updatedAt: string;
}

export interface OrderProduct {
	id: string;
	orderId: string;
	productId: string;
	product: Product;
	quantity: number;
	unitPrice: number;
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

export interface PaymentMethod {
	id: string;
	brand: string;
	last4: string;
	expMonth: number;
	expYear: number;
	createdAt: string;
	updatedAt: string;
}

export interface CartProduct {
	id: string;
	productId: string;
	quantity: number;
	userId: string;
	product: Product;
	createdAt: string;
	updatedAt: string;
}

export interface WatchlistProduct {
	id: string;
	productId: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Image {
	id: string;
	storeId: string;
	productId: string;
	path: string;
	createdAt: string;
	updatedAt: string;
}

export interface StoreManager {
	id: string;
	storeId: string;
	managerId: string;
	createdAt: string;
	updatedAt: string;
}

export interface StoreFollower {
	id: string;
	storeId: string;
	followerId: string;
	store: Store;
	follower: User;
	createdAt: string;
	updatedAt: string;
}

export interface Payout {
	id: string;
	storeId: string;
	amount: number;
	status: PayoutStatus;
	createdAt: string;
	updatedAt: string;
}

export enum PayoutStatus {
	Success = 'Success',
	Pending = 'Pending',
	Failure = 'Failure'
}

export interface StoreProductCategory {
	id: string;
	storeId: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductCategory {
	id: string;
	productId: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductOption {
	id: string;
	productId: string;
	name: string;
	value: string;
	createdAt: string;
	updatedAt: string;
}

export interface DeliveryAddress {
	id: string;
	userId: string;
	street: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProductReview {
	id: string;
	productId: string;
	userId: string;
	rating: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
}

export enum OrderStatus {
	Cancelled = 'Cancelled',
	Pending = 'Pending',
	PaymentPending = 'PaymentPending',
	Completed = 'Completed'
}

export interface ProductCategory {
	productId: string;
	categoryId: string;
	product: Product;
	category: Category;
}

export interface CustomerInfo {
	id: string;
	name: string;
	email: string;
	orders: Order[];
}

export interface StoreOverview {
	lowStockProducts: Product[];
}

export interface GetManagedStoresResponse {
	stores: Store[];
}

export interface AuthenticateBody {
	email: string;
	password: string;
}

export interface RegisterBody {
	name: string;
	email: string;
	password: string;
}

export interface CreateProductBody {
	name: string;
	description: string;
	unitPrice: number;
	quantity: number;
}

export interface UpdateProductArgs {
	productId: string;
	body: UpdateProductBody;
}

export interface UpdateProductBody {
	name?: string;
	description?: string;
	quantity?: number;
	unitPrice?: number;
	stock?: number;
	images?: string[];
}

export interface CreateStoreBody {
	name: string;
	description: string;
}

export interface UpdateCurrentStoreBody {
	name?: string;
	bankAccountNumber?: string;
	bankCode?: string;
}

export interface CreatePayoutBody {
	amount: number;
}

export interface CreateProductCategoryBody {
	name: string;
	description: string;
}

export interface UpdateOrderArgs {
	orderId: string;
	body: {
		status?: OrderStatus;
	};
}

export interface UpdateProductCategoriesArgs {
	productId: string;
	body: UpdateProductCategoriesBody;
}

export interface UpdateProductCategoriesBody {
	add: string[];
	remove: string[];
}

export interface UpdateProductCategoryArgs {
	categoryId: string;
	body: {
		name?: string;
		description?: string;
	};
}

export interface VerifyBankAccountBody {
	bankAccountNumber: string;
	bankCode: string;
}
