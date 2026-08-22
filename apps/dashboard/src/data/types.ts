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
	realizedRevenue: number;
	unrealizedRevenue: number;
	paidOut: number;
	image?: Image;
	products: Product[];
	categories: StoreProductCategory[];
	_count?: { followers: number };
	createdAt: string;
	updatedAt: string;
}

/**
 * Server-computed balance. `available` already accounts for payouts that have
 * been requested but not yet settled, so it is the only figure that agrees
 * with what the payout endpoint will accept — never recompute it from
 * `realizedRevenue - paidOut`.
 */
export interface StoreBalance {
	realizedRevenue: number;
	unrealizedRevenue: number;
	paidOut: number;
	pendingPayouts: number;
	available: number;
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
	publicId: string;
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
	ReadyForPickup = 'ReadyForPickup',
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
	images?: { path: string; publicId: string }[];
}

export interface CreateStoreBody {
	name: string;
	description: string;
}

export interface UpdateCurrentStoreBody {
	name?: string;
	imageUrl?: string;
	imagePublicId?: string;
}

export interface UpdateCurrentUserBody {
	name?: string;
	email?: string;
}

export interface CreatePayoutBody {
	amount: number;
	/**
	 * Left unset while a store has a single account: the API then pays out to
	 * its default. Send it once the account list becomes selectable.
	 */
	payoutAccountId?: string;
}

/**
 * A bank account the store can be paid out to. The API caps stores at one for
 * now, so the dashboard renders `payoutAccounts[0]` and never mentions the
 * `isDefault` flag -- with one account it is always true and means nothing to
 * a merchant.
 */
export interface PayoutAccount {
	id: string;
	accountNumber: string;
	accountName: string | null;
	bankCode: string;
	bankName: string | null;
	label: string | null;
	isDefault: boolean;
	createdAt: string;
}

export interface CreatePayoutAccountBody {
	bankAccountNumber: string;
	bankCode: string;
	label?: string;
	/**
	 * Set when the merchant has confirmed that this account replaces the one
	 * already attached. Nothing is detached without it.
	 */
	replaceExisting?: boolean;
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

export interface Address {
	id: string;
	name: string;
	line1: string;
	line2?: string;
	city: string;
	state: string;
	country: string;
	postcode?: string;
	latitude?: number;
	longitude?: number;
	storeId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAddressBody {
	name: string;
	line1: string;
	line2?: string;
	city: string;
	state: string;
	country: string;
	postcode?: string;
	latitude?: number;
	longitude?: number;
}

export interface UpdateAddressArgs {
	addressId: string;
	body: Partial<CreateAddressBody>;
}

export interface VerifyBankAccountBody {
	bankAccountNumber: string;
	bankCode: string;
}
