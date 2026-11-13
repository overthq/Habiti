import { api } from './client';
import type {
	AddToCartBody,
	Address,
	AddressBody,
	AdminCreateProductBody,
	AdminCreateStoreBody,
	AdminLoginBody,
	AdminOverview,
	AdminUpdateUserBody,
	AppleSignInBody,
	BulkActionResponse,
	Card,
	CardAuthorization,
	CartProduct,
	Cart,
	CategoryBody,
	CreateOrderBody,
	CreateOrderResponse,
	CreatePayoutAccountBody,
	CreatePayoutBody,
	CreateProductBody,
	CreateStoreBody,
	GetCartResponse,
	GetProductResponse,
	GetStoreResponse,
	LandingHighlightsResponse,
	LoginBody,
	LogoutBody,
	Order,
	OrderFilters,
	OrderStatus,
	PayoutAccount,
	Product,
	ProductFilters,
	ProductReview,
	ProductStatus,
	RefreshSessionBody,
	RegisterBody,
	SavePushTokenBody,
	Session,
	SessionTokens,
	SignInResponse,
	Store,
	StoreBalance,
	StoreCustomer,
	StoreFilters,
	StoreFollower,
	StoreManager,
	StoreProductCategory,
	Transaction,
	TransactionFilters,
	UpdateCurrentUserBody,
	UpdateOrderBody,
	UpdateProductBody,
	UpdateProductCategoriesBody,
	UpdateStoreBody,
	UpdateTransactionBody,
	UploadedImage,
	User,
	UserFilters,
	UserPushToken,
	PushTokenType,
	VerifyBankAccountBody,
	VerifyBankAccountResponse,
	VerifyCodeBody,
	WatchlistProduct
} from './types';

// Naming: `User` = the signed-in shopper (/users/current), `CurrentStore` =
// the merchant's active store (/stores/current), `Admin` = /admin. Unprefixed
// functions are public resources fetched by id.

// ─── Auth ───────────────────────────────────────────────────────────────────

export const register = async (body: RegisterBody) => {
	const { data } = await api.post<{ user: User }>('/auth/register', body);
	return data;
};

// Sends a verification code to the email; finish with verifyCode.
export const login = async (body: LoginBody) => {
	const { data } = await api.post<{ message: string }>('/auth/login', body);
	return data;
};

export const verifyCode = async (body: VerifyCodeBody) => {
	const { data } = await api.post<SignInResponse>('/auth/verify-code', body);
	return data;
};

export const appleSignIn = async (body: AppleSignInBody) => {
	const { data } = await api.post<SignInResponse>('/auth/apple', body);
	return data;
};

export const startAnonymousSession = async () => {
	const { data } = await api.post<SignInResponse>('/auth/anonymous');
	return data;
};

export const refreshSession = async (body: RefreshSessionBody = {}) => {
	const { data } = await api.post<SessionTokens>('/auth/refresh', body);
	return data;
};

export const switchStore = async (storeId: string) => {
	const { data } = await api.post<{ accessToken: string }>(
		'/auth/switch-store',
		{ storeId }
	);
	return data;
};

export const logout = async (body: LogoutBody = {}) => {
	const { data } = await api.post<{ message: string }>('/auth/logout', body);
	return data;
};

// ─── Public ─────────────────────────────────────────────────────────────────

export const getStore = async (storeId: string) => {
	const { data } = await api.get<GetStoreResponse>(`/stores/${storeId}`);
	return data;
};

export const getStoreProducts = async (
	storeId: string,
	filters?: ProductFilters
) => {
	const { data } = await api.get<{ products: Product[] }>(
		`/stores/${storeId}/products`,
		{ params: filters }
	);
	return data;
};

export const followStore = async (storeId: string) => {
	const { data } = await api.post<{ follower: StoreFollower }>(
		`/stores/${storeId}/follow`
	);
	return data;
};

export const unfollowStore = async (storeId: string) => {
	const { data } = await api.post<{ follower: StoreFollower }>(
		`/stores/${storeId}/unfollow`
	);
	return data;
};

export const createStore = async (body: CreateStoreBody) => {
	const { data } = await api.post<{ store: Store; accessToken: string }>(
		'/stores',
		body
	);
	return data;
};

export const deleteStore = async (storeId: string) => {
	await api.delete(`/stores/${storeId}`);
};

export const getProduct = async (productId: string) => {
	const { data } = await api.get<GetProductResponse>(`/products/${productId}`);
	return data;
};

export const getRelatedProducts = async (productId: string) => {
	const { data } = await api.get<{ products: Product[] }>(
		`/products/${productId}/related`
	);
	return data;
};

export const getProductReviews = async (productId: string) => {
	const { data } = await api.get<{ reviews: ProductReview[] }>(
		`/products/${productId}/reviews`
	);
	return data;
};

export const createProductReview = async (
	productId: string,
	body: { rating: number; body: string }
) => {
	const { data } = await api.post<{ review: ProductReview }>(
		`/products/${productId}/reviews`,
		body
	);
	return data;
};

export const getCart = async (cartId: string) => {
	const { data } = await api.get<GetCartResponse>(`/carts/${cartId}`);
	return data;
};

export const addToCart = async (body: AddToCartBody) => {
	const { data } = await api.post<{ cartProduct: CartProduct }>(
		'/carts/products',
		body
	);
	return data;
};

export const updateCartProductQuantity = async (
	cartId: string,
	productId: string,
	quantity: number
) => {
	const { data } = await api.put<{ cartProduct: CartProduct }>(
		`/carts/${cartId}/products/${productId}`,
		{ quantity }
	);
	return data;
};

export const removeFromCart = async (cartId: string, productId: string) => {
	const { data } = await api.delete<{ cartProduct: CartProduct }>(
		`/carts/${cartId}/products/${productId}`
	);
	return data;
};

export const globalSearch = async (query: string) => {
	const { data } = await api.get<{ products: Product[]; stores: Store[] }>(
		'/search',
		{ params: { query } }
	);
	return data;
};

export const getLandingHighlights = async () => {
	const { data } = await api.get<LandingHighlightsResponse>(
		'/landing/highlights'
	);
	return data;
};

// Build the FormData per platform: React Native appends
// { uri, name, type }, the web appends a File or Blob. Field name: "images".
export const uploadImages = async (formData: FormData) => {
	const { data } = await api.post<{ images: UploadedImage[] }>(
		'/uploads/images',
		formData,
		{ headers: { 'Content-Type': 'multipart/form-data' } }
	);
	return data;
};

// ─── Current user ───────────────────────────────────────────────────────────

export const getCurrentUser = async () => {
	const { data } = await api.get<{ user: User }>('/users/current');
	return data;
};

export const updateCurrentUser = async (body: UpdateCurrentUserBody) => {
	const { data } = await api.put<{ user: User }>('/users/current', body);
	return data;
};

export const deleteCurrentUser = async () => {
	await api.delete('/users/current');
};

export const getUserFollowedStores = async () => {
	const { data } = await api.get<{ stores: Store[] }>(
		'/users/current/followed-stores'
	);
	return data;
};

export const getUserManagedStores = async () => {
	const { data } = await api.get<{ stores: StoreManager[] }>(
		'/users/current/managed-stores'
	);
	return data;
};

export const getUserOrders = async () => {
	const { data } = await api.get<{ orders: Order[] }>('/users/current/orders');
	return data;
};

export const getUserOrder = async (orderId: string) => {
	const { data } = await api.get<{ order: Order }>(
		`/users/current/orders/${orderId}`
	);
	return data;
};

export const createUserOrder = async (body: CreateOrderBody) => {
	const { data } = await api.post<CreateOrderResponse>(
		'/users/current/orders',
		body
	);
	return data;
};

export const confirmUserOrderPickup = async (orderId: string) => {
	const { data } = await api.post<{ order: Order }>(
		`/users/current/orders/${orderId}/confirm-pickup`
	);
	return data;
};

export const getUserCarts = async () => {
	const { data } = await api.get<{ carts: Cart[] }>('/users/current/carts');
	return data;
};

export const getUserCards = async () => {
	const { data } = await api.get<{ cards: Card[] }>('/users/current/cards');
	return data;
};

export const deleteUserCard = async (cardId: string) => {
	await api.delete(`/users/current/cards/${cardId}`);
};

// Starts a Paystack card authorization to pay for an existing order.
export const authorizeUserCard = async (orderId: string) => {
	const { data } = await api.post<CardAuthorization>(
		'/users/current/cards/authorize',
		{ orderId }
	);
	return data;
};

export const getUserDeliveryAddresses = async () => {
	const { data } = await api.get<{ addresses: Address[] }>(
		'/users/current/delivery-addresses'
	);
	return data;
};

export const addUserDeliveryAddress = async (body: AddressBody) => {
	const { data } = await api.post<{ address: Address }>(
		'/users/current/delivery-addresses',
		body
	);
	return data;
};

export const updateUserDeliveryAddress = async (
	addressId: string,
	body: AddressBody
) => {
	const { data } = await api.put<{ address: Address }>(
		`/users/current/delivery-addresses/${addressId}`,
		body
	);
	return data;
};

export const deleteUserDeliveryAddress = async (addressId: string) => {
	await api.delete(`/users/current/delivery-addresses/${addressId}`);
};

export const getUserWatchlist = async () => {
	const { data } = await api.get<{ watchlist: WatchlistProduct[] }>(
		'/users/current/watchlist'
	);
	return data;
};

export const addToUserWatchlist = async (productId: string) => {
	const { data } = await api.post<{ watchlistProduct: WatchlistProduct }>(
		'/users/current/watchlist',
		{ productId }
	);
	return data;
};

export const getUserPushTokens = async () => {
	const { data } = await api.get<{ pushTokens: UserPushToken[] }>(
		'/users/current/push-tokens'
	);
	return data;
};

export const saveUserPushToken = async (body: SavePushTokenBody) => {
	const { data } = await api.post<{ pushToken: UserPushToken }>(
		'/users/current/push-tokens',
		body
	);
	return data;
};

export const deleteUserPushToken = async (
	token: string,
	type: PushTokenType
) => {
	const { data } = await api.delete<{ pushToken: UserPushToken }>(
		`/users/current/push-tokens/${encodeURIComponent(token)}`,
		{ data: { type } }
	);
	return data;
};

// ─── Current store ──────────────────────────────────────────────────────────

export const getCurrentStore = async () => {
	const { data } = await api.get<GetStoreResponse>('/stores/current');
	return data;
};

export const updateCurrentStore = async (body: UpdateStoreBody) => {
	const { data } = await api.put<{ store: Store }>('/stores/current', body);
	return data;
};

export const getCurrentStoreBalance = async () => {
	const { data } = await api.get<{ balance: StoreBalance }>(
		'/stores/current/balance'
	);
	return data;
};

export const getCurrentStoreOverview = async () => {
	const { data } = await api.get<{ lowStockProducts: Product[] }>(
		'/stores/current/overview'
	);
	return data;
};

export const getCurrentStoreManagers = async () => {
	const { data } = await api.get<{ managers: StoreManager[] }>(
		'/stores/current/managers'
	);
	return data;
};

export const getCurrentStoreCustomer = async (userId: string) => {
	const { data } = await api.get<{ user: StoreCustomer }>(
		`/stores/current/customers/${userId}`
	);
	return data;
};

export const getCurrentStoreProducts = async (filters?: ProductFilters) => {
	const { data } = await api.get<{ products: Product[] }>(
		'/stores/current/products',
		{ params: filters }
	);
	return data;
};

export const getCurrentStoreProduct = async (productId: string) => {
	const { data } = await api.get<GetProductResponse>(
		`/stores/current/products/${productId}`
	);
	return data;
};

export const createCurrentStoreProduct = async (body: CreateProductBody) => {
	const { data } = await api.post<{ product: Product }>(
		'/stores/current/products',
		body
	);
	return data;
};

export const updateCurrentStoreProduct = async (
	productId: string,
	body: UpdateProductBody
) => {
	const { data } = await api.put<{ product: Product }>(
		`/stores/current/products/${productId}`,
		body
	);
	return data;
};

export const deleteCurrentStoreProduct = async (productId: string) => {
	await api.delete(`/stores/current/products/${productId}`);
};

export const updateCurrentStoreProductCategories = async (
	productId: string,
	body: UpdateProductCategoriesBody
) => {
	const { data } = await api.put<{ product: Product }>(
		`/stores/current/products/${productId}/categories`,
		body
	);
	return data;
};

export const getCurrentStoreProductReviews = async (productId: string) => {
	const { data } = await api.get<{ reviews: ProductReview[] }>(
		`/stores/current/products/${productId}/reviews`
	);
	return data;
};

export const getCurrentStoreOrders = async (filters?: OrderFilters) => {
	const { data } = await api.get<{ orders: Order[] }>(
		'/stores/current/orders',
		{ params: filters }
	);
	return data;
};

export const getCurrentStoreOrder = async (orderId: string) => {
	const { data } = await api.get<{ order: Order }>(
		`/stores/current/orders/${orderId}`
	);
	return data;
};

export const updateCurrentStoreOrder = async (
	orderId: string,
	body: UpdateOrderBody
) => {
	const { data } = await api.put<{ order: Order }>(
		`/stores/current/orders/${orderId}`,
		body
	);
	return data;
};

export const getCurrentStoreCategories = async () => {
	const { data } = await api.get<{ categories: StoreProductCategory[] }>(
		'/stores/current/categories'
	);
	return data;
};

export const createCurrentStoreCategory = async (body: CategoryBody) => {
	const { data } = await api.post<{ category: StoreProductCategory }>(
		'/stores/current/categories',
		body
	);
	return data;
};

export const updateCurrentStoreCategory = async (
	categoryId: string,
	body: CategoryBody
) => {
	const { data } = await api.put<{ category: StoreProductCategory }>(
		`/stores/current/categories/${categoryId}`,
		body
	);
	return data;
};

export const deleteCurrentStoreCategory = async (categoryId: string) => {
	await api.delete(`/stores/current/categories/${categoryId}`);
};

export const getCurrentStoreAddresses = async () => {
	const { data } = await api.get<{ addresses: Address[] }>(
		'/stores/current/addresses'
	);
	return data;
};

export const createCurrentStoreAddress = async (body: AddressBody) => {
	const { data } = await api.post<{ address: Address }>(
		'/stores/current/addresses',
		body
	);
	return data;
};

export const updateCurrentStoreAddress = async (
	addressId: string,
	body: AddressBody
) => {
	const { data } = await api.put<{ address: Address }>(
		`/stores/current/addresses/${addressId}`,
		body
	);
	return data;
};

export const deleteCurrentStoreAddress = async (addressId: string) => {
	await api.delete(`/stores/current/addresses/${addressId}`);
};

export const getCurrentStoreTransactions = async (
	filters?: TransactionFilters
) => {
	const { data } = await api.get<{ transactions: Transaction[] }>(
		'/stores/current/transactions',
		{ params: filters }
	);
	return data;
};

export const getCurrentStoreTransaction = async (transactionId: string) => {
	const { data } = await api.get<{ transaction: Transaction }>(
		`/stores/current/transactions/${transactionId}`
	);
	return data;
};

export const createCurrentStorePayout = async (body: CreatePayoutBody) => {
	const { data } = await api.post<{ transaction: Transaction }>(
		'/stores/current/payouts',
		body
	);
	return data;
};

export const getCurrentStorePayoutAccounts = async () => {
	const { data } = await api.get<{ payoutAccounts: PayoutAccount[] }>(
		'/stores/current/payout-accounts'
	);
	return data;
};

export const createCurrentStorePayoutAccount = async (
	body: CreatePayoutAccountBody
) => {
	const { data } = await api.post<{ payoutAccount: PayoutAccount }>(
		'/stores/current/payout-accounts',
		body
	);
	return data;
};

export const setDefaultCurrentStorePayoutAccount = async (
	payoutAccountId: string
) => {
	const { data } = await api.post<{ payoutAccount: PayoutAccount }>(
		`/stores/current/payout-accounts/${payoutAccountId}/default`
	);
	return data;
};

export const deleteCurrentStorePayoutAccount = async (
	payoutAccountId: string
) => {
	const { data } = await api.delete<{ id: string }>(
		`/stores/current/payout-accounts/${payoutAccountId}`
	);
	return data;
};

export const verifyCurrentStoreBankAccount = async (
	body: VerifyBankAccountBody
) => {
	const { data } = await api.post<VerifyBankAccountResponse>(
		'/stores/current/verify-bank-account',
		body
	);
	return data;
};

// ─── Admin ──────────────────────────────────────────────────────────────────

export const loginAdmin = async (body: AdminLoginBody) => {
	const { data } = await api.post<{ accessToken: string; adminId: string }>(
		'/admin/login',
		body
	);
	return data;
};

// Rotates the httpOnly adminRefreshToken cookie.
export const refreshAdminSession = async () => {
	const { data } = await api.post<{ accessToken: string }>('/admin/refresh');
	return data;
};

export const logoutAdmin = async () => {
	const { data } = await api.post<{ message: string }>('/admin/logout');
	return data;
};

export const getAdminOverview = async () => {
	const { data } = await api.get<AdminOverview>('/admin/overview');
	return data;
};

export const getAdminOrders = async (filters?: OrderFilters) => {
	const { data } = await api.get<{ orders: Order[] }>('/admin/orders', {
		params: filters
	});
	return data;
};

export const getAdminOrder = async (orderId: string) => {
	const { data } = await api.get<{ order: Order }>(`/admin/orders/${orderId}`);
	return data;
};

export const updateAdminOrder = async (
	orderId: string,
	body: UpdateOrderBody
) => {
	const { data } = await api.put<{ order: Order }>(
		`/admin/orders/${orderId}`,
		body
	);
	return data;
};

export const getAdminProducts = async (filters?: ProductFilters) => {
	const { data } = await api.get<{ products: Product[] }>('/admin/products', {
		params: filters
	});
	return data;
};

export const getAdminProduct = async (productId: string) => {
	const { data } = await api.get<GetProductResponse>(
		`/admin/products/${productId}`
	);
	return data;
};

export const createAdminProduct = async (body: AdminCreateProductBody) => {
	const { data } = await api.post<{ product: Product }>(
		'/admin/products',
		body
	);
	return data;
};

export const updateAdminProduct = async (
	productId: string,
	body: UpdateProductBody
) => {
	const { data } = await api.put<{ product: Product }>(
		`/admin/products/${productId}`,
		body
	);
	return data;
};

export const deleteAdminProduct = async (productId: string) => {
	await api.delete(`/admin/products/${productId}`);
};

export const getAdminProductReviews = async (productId: string) => {
	const { data } = await api.get<{ reviews: ProductReview[] }>(
		`/admin/products/${productId}/reviews`
	);
	return data;
};

export const getAdminUsers = async (filters?: UserFilters) => {
	const { data } = await api.get<{ users: User[] }>('/admin/users', {
		params: filters
	});
	return data;
};

export const getAdminUser = async (userId: string) => {
	const { data } = await api.get<{ user: User }>(`/admin/users/${userId}`);
	return data;
};

export const updateAdminUser = async (
	userId: string,
	body: AdminUpdateUserBody
) => {
	const { data } = await api.put<{ user: User }>(
		`/admin/users/${userId}`,
		body
	);
	return data;
};

export const getAdminUserSessions = async (userId: string) => {
	const { data } = await api.get<{ sessions: Session[] }>(
		`/admin/users/${userId}/sessions`
	);
	return data;
};

export const getAdminUserStores = async (userId: string) => {
	const { data } = await api.get<{ stores: StoreManager[] }>(
		`/admin/users/${userId}/stores`
	);
	return data;
};

export const getAdminStores = async (filters?: StoreFilters) => {
	const { data } = await api.get<{ stores: Store[] }>('/admin/stores', {
		params: filters
	});
	return data;
};

export const getAdminStore = async (storeId: string) => {
	const { data } = await api.get<GetStoreResponse>(`/admin/stores/${storeId}`);
	return data;
};

export const createAdminStore = async (body: AdminCreateStoreBody) => {
	const { data } = await api.post<{ store: Store }>('/admin/stores', body);
	return data;
};

export const updateAdminStore = async (
	storeId: string,
	body: UpdateStoreBody
) => {
	const { data } = await api.put<{ store: Store }>(
		`/admin/stores/${storeId}`,
		body
	);
	return data;
};

export const deleteAdminStore = async (storeId: string) => {
	await api.delete(`/admin/stores/${storeId}`);
};

export const getAdminStoreProducts = async (
	storeId: string,
	filters?: ProductFilters
) => {
	const { data } = await api.get<{ products: Product[] }>(
		`/admin/stores/${storeId}/products`,
		{ params: filters }
	);
	return data;
};

export const getAdminStoreOrders = async (
	storeId: string,
	filters?: OrderFilters
) => {
	const { data } = await api.get<{ orders: Order[] }>(
		`/admin/stores/${storeId}/orders`,
		{ params: filters }
	);
	return data;
};

export const getAdminStoreTransactions = async (
	storeId: string,
	filters?: TransactionFilters
) => {
	const { data } = await api.get<{ transactions: Transaction[] }>(
		`/admin/stores/${storeId}/transactions`,
		{ params: filters }
	);
	return data;
};

export const getAdminStoreManagers = async (storeId: string) => {
	const { data } = await api.get<{ managers: StoreManager[] }>(
		`/admin/stores/${storeId}/managers`
	);
	return data;
};

export const getAdminStorePayoutAccounts = async (storeId: string) => {
	const { data } = await api.get<{ payoutAccounts: PayoutAccount[] }>(
		`/admin/stores/${storeId}/payout-accounts`
	);
	return data;
};

export const createAdminStorePayoutAccount = async (
	storeId: string,
	body: CreatePayoutAccountBody
) => {
	const { data } = await api.post<{ payoutAccount: PayoutAccount }>(
		`/admin/stores/${storeId}/payout-accounts`,
		body
	);
	return data;
};

export const setDefaultAdminStorePayoutAccount = async (
	storeId: string,
	payoutAccountId: string
) => {
	const { data } = await api.post<{ payoutAccount: PayoutAccount }>(
		`/admin/stores/${storeId}/payout-accounts/${payoutAccountId}/default`
	);
	return data;
};

export const deleteAdminStorePayoutAccount = async (
	storeId: string,
	payoutAccountId: string
) => {
	const { data } = await api.delete<{ id: string }>(
		`/admin/stores/${storeId}/payout-accounts/${payoutAccountId}`
	);
	return data;
};

export const verifyAdminBankAccount = async (body: VerifyBankAccountBody) => {
	const { data } = await api.post<VerifyBankAccountResponse>(
		'/admin/verify-bank-account',
		body
	);
	return data;
};

export const updateAdminTransaction = async (
	transactionId: string,
	body: UpdateTransactionBody
) => {
	const { data } = await api.patch<{ transaction: Transaction }>(
		`/admin/transactions/${transactionId}`,
		body
	);
	return data;
};

export const bulkUpdateAdminUsers = async (
	ids: string[],
	update: { field: 'suspended'; value: boolean }
) => {
	const { data } = await api.post<BulkActionResponse>('/admin/users/bulk', {
		ids,
		...update
	});
	return data;
};

export const bulkDeleteAdminUsers = async (ids: string[]) => {
	const { data } = await api.delete<BulkActionResponse>('/admin/users/bulk', {
		data: { ids }
	});
	return data;
};

export const bulkUpdateAdminOrders = async (
	ids: string[],
	update: {
		field: 'status';
		value: Exclude<OrderStatus, OrderStatus.ReadyForPickup>;
	}
) => {
	const { data } = await api.post<BulkActionResponse>('/admin/orders/bulk', {
		ids,
		...update
	});
	return data;
};

export const bulkDeleteAdminOrders = async (ids: string[]) => {
	const { data } = await api.delete<BulkActionResponse>('/admin/orders/bulk', {
		data: { ids }
	});
	return data;
};

export const bulkUpdateAdminProducts = async (
	ids: string[],
	update: {
		field: 'status';
		value: Exclude<ProductStatus, ProductStatus.Archived>;
	}
) => {
	const { data } = await api.post<BulkActionResponse>('/admin/products/bulk', {
		ids,
		...update
	});
	return data;
};

export const bulkDeleteAdminProducts = async (ids: string[]) => {
	const { data } = await api.delete<BulkActionResponse>(
		'/admin/products/bulk',
		{ data: { ids } }
	);
	return data;
};

export const bulkUpdateAdminStores = async (
	ids: string[],
	update: { field: 'unlisted'; value: boolean }
) => {
	const { data } = await api.post<BulkActionResponse>('/admin/stores/bulk', {
		ids,
		...update
	});
	return data;
};

export const bulkDeleteAdminStores = async (ids: string[]) => {
	const { data } = await api.delete<BulkActionResponse>('/admin/stores/bulk', {
		data: { ids }
	});
	return data;
};
