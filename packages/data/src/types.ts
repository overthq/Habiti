// Models mirror api/prisma/schema.prisma as serialized to JSON: DateTime and
// BigInt become string and number, and nullable columns are `| null`. Models
// hold columns only; relations are added per endpoint (see "With relations"),
// matching the Prisma include behind each route.

// ─── Enums ──────────────────────────────────────────────────────────────────

export enum OrderStatus {
	Pending = 'Pending',
	ReadyForPickup = 'ReadyForPickup',
	Cancelled = 'Cancelled',
	Completed = 'Completed',
	PaymentPending = 'PaymentPending'
}

export enum ProductStatus {
	Active = 'Active',
	Draft = 'Draft',
	Archived = 'Archived'
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

export enum PushTokenType {
	Shopper = 'Shopper',
	Merchant = 'Merchant'
}

// ─── Models ─────────────────────────────────────────────────────────────────

export interface User {
	id: string;
	name: string;
	email: string | null;
	isAnonymous: boolean;
	suspended: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Store {
	id: string;
	name: string;
	description: string | null;
	website: string | null;
	twitter: string | null;
	instagram: string | null;
	whatsapp: string | null;
	unlisted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Image {
	id: string;
	storeId: string | null;
	productId: string | null;
	path: string;
	publicId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Product {
	id: string;
	name: string;
	description: string;
	unitPrice: number;
	quantity: number;
	storeId: string;
	status: ProductStatus;
	createdAt: string;
	updatedAt: string;
}

export interface Order {
	id: string;
	serialNumber: number;
	userId: string;
	storeId: string;
	status: OrderStatus;
	transactionFee: number;
	serviceFee: number;
	total: number;
	createdAt: string;
	updatedAt: string;
}

export interface OrderProduct {
	orderId: string;
	productId: string;
	unitPrice: number;
	quantity: number;
}

export interface Cart {
	id: string;
	userId: string | null;
	storeId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CartProduct {
	cartId: string;
	productId: string;
	quantity: number;
}

export interface WatchlistProduct {
	userId: string;
	productId: string;
}

export interface StoreManager {
	storeId: string;
	managerId: string;
	createdAt: string;
	updatedAt: string;
}

export interface StoreFollower {
	storeId: string;
	followerId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Card {
	id: string;
	userId: string;
	email: string;
	cardType: string;
	last4: string;
	expMonth: string;
	expYear: string;
	bank: string;
	countryCode: string;
	createdAt: string;
	updatedAt: string;
}

export interface StoreProductCategory {
	id: string;
	storeId: string;
	name: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ProductCategory {
	productId: string;
	categoryId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductReview {
	id: string;
	userId: string;
	productId: string;
	body: string | null;
	rating: number;
	createdAt: string;
	updatedAt: string;
}

// Used for both user delivery addresses and store pickup addresses.
export interface Address {
	id: string;
	name: string;
	line1: string;
	line2: string | null;
	city: string;
	state: string;
	country: string;
	postcode: string | null;
	latitude: number | null;
	longitude: number | null;
	userId: string | null;
	storeId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface UserPushToken {
	userId: string;
	token: string;
	type: PushTokenType;
	createdAt: string;
	updatedAt: string;
}

export interface Transaction {
	id: string;
	storeId: string;
	type: TransactionType;
	status: TransactionStatus;
	amount: number;
	description: string | null;
	orderId: string | null;
	payoutId: string | null;
	balanceAfter: number;
	createdAt: string;
	updatedAt: string;
}

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

export interface Session {
	id: string;
	userId: string;
	userAgent: string | null;
	ipAddress: string | null;
	lastActiveAt: string;
	revoked: boolean;
	createdAt: string;
}

export interface StoreBalance {
	realizedRevenue: number;
	unrealizedRevenue: number;
	paidOut: number;
	pendingPayouts: number;
	available: number;
}

export interface UploadedImage {
	url: string;
	publicId: string;
}

// ─── With relations ─────────────────────────────────────────────────────────

export type StoreWithImage = Store & { image: Image | null };

export type ProductWithImages = Product & { images: Image[] };

export type CategorizedProduct = ProductWithImages & {
	categories: (ProductCategory & { category: StoreProductCategory })[];
};

export type StoreDetail = StoreWithImage & {
	products: ProductWithImages[];
	categories: StoreProductCategory[];
	_count: { followers: number };
};

export type ProductDetail = CategorizedProduct & {
	store: StoreWithImage;
	reviews: (ProductReview & { user: Pick<User, 'id' | 'name'> })[];
};

export type ListedProduct = CategorizedProduct & { store: Store };

export type FeaturedProduct = ProductWithImages & { store: StoreWithImage };

export type WatchlistItem = WatchlistProduct & {
	product: ProductWithImages & { store: Store };
};

export type CartItem = CartProduct & { product: ProductWithImages };

export type UserCart = Cart & { products: CartItem[]; store: StoreWithImage };

export type CartDetail = Cart & {
	products: CartItem[];
	store: StoreWithImage & { addresses: Address[] };
	user: (User & { cards: Card[] }) | null;
	total: number;
	fees: { transaction: number; service: number; total: number };
};

export type OrderItem = OrderProduct & { product: ProductWithImages };

export type UserOrder = Order & {
	store: StoreWithImage & { addresses: Address[] };
	products: OrderItem[];
};

export type OrderDetail = UserOrder & { user: User };

export type StoreOrder = Order & { user: User };

export type AdminOrder = Order & { store: Store; user: User };

export type StoreManagerWithUser = StoreManager & { manager: User };

export type ManagedStore = StoreManager & { store: StoreWithImage };

export type StoreTransaction = Transaction & { order: Order | null };

export type TransactionDetail = StoreTransaction & { store: Store };

// ─── Responses ──────────────────────────────────────────────────────────────

export interface SessionTokens {
	accessToken: string;
	refreshToken: string;
}

export interface SignInResponse extends SessionTokens {
	userId: string;
}

export interface StoreViewerContext {
	isFollowing: boolean;
	cart: (Cart & { products: CartProduct[] }) | null;
}

export interface GetStoreResponse {
	store: StoreDetail;
	viewerContext: StoreViewerContext | null;
}

export interface ProductViewerContext {
	cartProduct: CartProduct | null;
}

export interface GetProductResponse {
	product: ProductDetail;
	viewerContext: ProductViewerContext | null;
}

export interface GetCartResponse {
	cart: CartDetail;
	viewerContext: { cards: Card[] } | null;
}

export interface CardAuthorization {
	authorization_url: string;
	access_code: string;
	reference: string;
}

export interface CreateOrderResponse {
	order: Order;
	cardAuthorizationData?: CardAuthorization;
}

export interface LandingHighlightsResponse {
	trendingStores: StoreWithImage[];
	featuredProducts: FeaturedProduct[];
}

export interface StoreCustomer {
	id: string;
	name: string;
	email: string | null;
	orders: (Order & { products: OrderItem[] })[];
}

export interface VerifyBankAccountResponse {
	accountNumber: string;
	accountName: string;
}

export interface AdminOverview {
	totalStores: number;
	totalOrders: number;
	totalProducts: number;
	totalUsers: number;
	totalRevenue: number;
}

export interface BulkActionResponse {
	count: number;
}

// ─── Request bodies ─────────────────────────────────────────────────────────

export interface RegisterBody {
	name: string;
	email: string;
}

export interface LoginBody {
	email: string;
}

export interface VerifyCodeBody {
	email: string;
	code: string;
}

export interface AppleSignInBody {
	identityToken: string;
	fullName?: string;
	createIfMissing?: boolean;
	nonce?: string;
}

export interface RefreshSessionBody {
	// Native clients send it here; web relies on the httpOnly cookie.
	refreshToken?: string;
	storeId?: string;
}

export interface LogoutBody {
	refreshToken?: string;
}

export interface UpdateCurrentUserBody {
	name: string;
	email: string;
}

export interface AddressBody {
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

export interface AddToCartBody {
	storeId: string;
	productId: string;
	quantity: number;
	cartId?: string;
}

export interface CreateOrderBody {
	cartId: string;
	cardId?: string | null;
}

export interface SavePushTokenBody {
	token: string;
	type: PushTokenType;
}

export interface CreateStoreBody {
	name: string;
	description: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	// Any common Nigerian format; an empty string clears it.
	whatsapp?: string;
}

export interface UpdateStoreBody {
	name?: string;
	description?: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	whatsapp?: string;
	unlisted?: boolean;
	imageUrl?: string;
	imagePublicId?: string;
}

export interface CreateProductBody {
	name: string;
	description: string;
	unitPrice: number;
	quantity: number;
}

export interface UpdateProductBody {
	name?: string;
	description?: string;
	unitPrice?: number;
	quantity?: number;
	images?: { path: string; publicId: string }[];
}

export interface UpdateProductCategoriesBody {
	add: string[];
	remove: string[];
}

export interface CategoryBody {
	name: string;
	description: string;
}

export interface UpdateOrderBody {
	status: OrderStatus;
}

export interface CreatePayoutBody {
	amount: number;
	payoutAccountId?: string;
}

export interface CreatePayoutAccountBody {
	bankAccountNumber: string;
	bankCode: string;
	label?: string;
	replaceExisting?: boolean;
}

export interface VerifyBankAccountBody {
	bankAccountNumber: string;
	bankCode: string;
}

export interface AdminLoginBody {
	email: string;
	password: string;
}

export interface AdminCreateStoreBody {
	name: string;
	description?: string;
}

export interface AdminCreateProductBody extends CreateProductBody {
	storeId: string;
}

export interface AdminUpdateUserBody {
	name?: string;
	email?: string;
}

export interface UpdateTransactionBody {
	status: TransactionStatus;
}

// ─── Filters ────────────────────────────────────────────────────────────────

type SortOrder = 'asc' | 'desc';

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
			SortOrder
		>
	>;
}

export interface OrderFilters {
	search?: string;
	status?: OrderStatus;
	storeId?: string;
	userId?: string;
	minTotal?: number;
	maxTotal?: number;
	dateFrom?: string;
	dateTo?: string;
	orderBy?: Partial<Record<'total' | 'createdAt' | 'updatedAt', SortOrder>>;
}

export interface UserFilters {
	search?: string;
	suspended?: boolean;
	isAnonymous?: boolean;
	orderBy?: Partial<
		Record<'name' | 'email' | 'createdAt' | 'updatedAt', SortOrder>
	>;
}

export interface StoreFilters {
	search?: string;
	unlisted?: boolean;
}

export interface TransactionFilters {
	type?: TransactionType;
	status?: TransactionStatus;
	from?: string;
	to?: string;
	limit?: number;
	offset?: number;
}
