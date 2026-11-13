import { queryOptions } from '@tanstack/react-query';

import * as requests from './requests';
import type {
	OrderFilters,
	ProductFilters,
	StoreFilters,
	TransactionFilters,
	UserFilters
} from './types';

// Keys are grouped under 'user', 'current-store' and 'admin' (plus public
// resources by id), so a whole group can be invalidated by prefix, e.g. on
// logout or store switch: queryClient.removeQueries({ queryKey: ['user'] }).

// ─── Public ─────────────────────────────────────────────────────────────────

export const storeQuery = (storeId: string) =>
	queryOptions({
		queryKey: ['stores', storeId],
		queryFn: () => requests.getStore(storeId)
	});

export const storeProductsQuery = (storeId: string, filters?: ProductFilters) =>
	queryOptions({
		queryKey: ['stores', storeId, 'products', filters ?? {}],
		queryFn: () => requests.getStoreProducts(storeId, filters)
	});

export const productQuery = (productId: string) =>
	queryOptions({
		queryKey: ['products', productId],
		queryFn: () => requests.getProduct(productId)
	});

export const relatedProductsQuery = (productId: string) =>
	queryOptions({
		queryKey: ['products', productId, 'related'],
		queryFn: () => requests.getRelatedProducts(productId)
	});

export const productReviewsQuery = (productId: string) =>
	queryOptions({
		queryKey: ['products', productId, 'reviews'],
		queryFn: () => requests.getProductReviews(productId)
	});

export const cartQuery = (cartId: string) =>
	queryOptions({
		queryKey: ['carts', cartId],
		queryFn: () => requests.getCart(cartId)
	});

export const searchQuery = (query: string) =>
	queryOptions({
		queryKey: ['search', query],
		queryFn: () => requests.globalSearch(query),
		enabled: query.length > 0
	});

export const landingHighlightsQuery = () =>
	queryOptions({
		queryKey: ['landing', 'highlights'],
		queryFn: requests.getLandingHighlights
	});

// ─── Current user ───────────────────────────────────────────────────────────

export const currentUserQuery = () =>
	queryOptions({
		queryKey: ['user', 'profile'],
		queryFn: requests.getCurrentUser
	});

export const userFollowedStoresQuery = () =>
	queryOptions({
		queryKey: ['user', 'followed-stores'],
		queryFn: requests.getUserFollowedStores
	});

export const userManagedStoresQuery = () =>
	queryOptions({
		queryKey: ['user', 'managed-stores'],
		queryFn: requests.getUserManagedStores
	});

export const userOrdersQuery = () =>
	queryOptions({
		queryKey: ['user', 'orders'],
		queryFn: requests.getUserOrders
	});

export const userOrderQuery = (orderId: string) =>
	queryOptions({
		queryKey: ['user', 'orders', orderId],
		queryFn: () => requests.getUserOrder(orderId)
	});

export const userCartsQuery = () =>
	queryOptions({
		queryKey: ['user', 'carts'],
		queryFn: requests.getUserCarts
	});

export const userCardsQuery = () =>
	queryOptions({
		queryKey: ['user', 'cards'],
		queryFn: requests.getUserCards
	});

export const userDeliveryAddressesQuery = () =>
	queryOptions({
		queryKey: ['user', 'delivery-addresses'],
		queryFn: requests.getUserDeliveryAddresses
	});

export const userWatchlistQuery = () =>
	queryOptions({
		queryKey: ['user', 'watchlist'],
		queryFn: requests.getUserWatchlist
	});

export const userPushTokensQuery = () =>
	queryOptions({
		queryKey: ['user', 'push-tokens'],
		queryFn: requests.getUserPushTokens
	});

// ─── Current store ──────────────────────────────────────────────────────────

export const currentStoreQuery = () =>
	queryOptions({
		queryKey: ['current-store', 'profile'],
		queryFn: requests.getCurrentStore
	});

export const currentStoreBalanceQuery = () =>
	queryOptions({
		queryKey: ['current-store', 'balance'],
		queryFn: requests.getCurrentStoreBalance
	});

export const currentStoreOverviewQuery = () =>
	queryOptions({
		queryKey: ['current-store', 'overview'],
		queryFn: requests.getCurrentStoreOverview
	});

export const currentStoreManagersQuery = () =>
	queryOptions({
		queryKey: ['current-store', 'managers'],
		queryFn: requests.getCurrentStoreManagers
	});

export const currentStoreCustomerQuery = (userId: string) =>
	queryOptions({
		queryKey: ['current-store', 'customers', userId],
		queryFn: () => requests.getCurrentStoreCustomer(userId)
	});

export const currentStoreProductsQuery = (filters?: ProductFilters) =>
	queryOptions({
		queryKey: ['current-store', 'products', 'list', filters ?? {}],
		queryFn: () => requests.getCurrentStoreProducts(filters)
	});

export const currentStoreProductQuery = (productId: string) =>
	queryOptions({
		queryKey: ['current-store', 'products', productId],
		queryFn: () => requests.getCurrentStoreProduct(productId)
	});

export const currentStoreProductReviewsQuery = (productId: string) =>
	queryOptions({
		queryKey: ['current-store', 'products', productId, 'reviews'],
		queryFn: () => requests.getCurrentStoreProductReviews(productId)
	});

export const currentStoreOrdersQuery = (filters?: OrderFilters) =>
	queryOptions({
		queryKey: ['current-store', 'orders', 'list', filters ?? {}],
		queryFn: () => requests.getCurrentStoreOrders(filters)
	});

export const currentStoreOrderQuery = (orderId: string) =>
	queryOptions({
		queryKey: ['current-store', 'orders', orderId],
		queryFn: () => requests.getCurrentStoreOrder(orderId)
	});

export const currentStoreCategoriesQuery = () =>
	queryOptions({
		queryKey: ['current-store', 'categories'],
		queryFn: requests.getCurrentStoreCategories
	});

export const currentStoreAddressesQuery = () =>
	queryOptions({
		queryKey: ['current-store', 'addresses'],
		queryFn: requests.getCurrentStoreAddresses
	});

export const currentStoreTransactionsQuery = (filters?: TransactionFilters) =>
	queryOptions({
		queryKey: ['current-store', 'transactions', 'list', filters ?? {}],
		queryFn: () => requests.getCurrentStoreTransactions(filters)
	});

export const currentStoreTransactionQuery = (transactionId: string) =>
	queryOptions({
		queryKey: ['current-store', 'transactions', transactionId],
		queryFn: () => requests.getCurrentStoreTransaction(transactionId)
	});

export const currentStorePayoutAccountsQuery = () =>
	queryOptions({
		queryKey: ['current-store', 'payout-accounts'],
		queryFn: requests.getCurrentStorePayoutAccounts
	});

// ─── Admin ──────────────────────────────────────────────────────────────────

export const adminOverviewQuery = () =>
	queryOptions({
		queryKey: ['admin', 'overview'],
		queryFn: requests.getAdminOverview
	});

export const adminOrdersQuery = (filters?: OrderFilters) =>
	queryOptions({
		queryKey: ['admin', 'orders', 'list', filters ?? {}],
		queryFn: () => requests.getAdminOrders(filters)
	});

export const adminOrderQuery = (orderId: string) =>
	queryOptions({
		queryKey: ['admin', 'orders', orderId],
		queryFn: () => requests.getAdminOrder(orderId)
	});

export const adminProductsQuery = (filters?: ProductFilters) =>
	queryOptions({
		queryKey: ['admin', 'products', 'list', filters ?? {}],
		queryFn: () => requests.getAdminProducts(filters)
	});

export const adminProductQuery = (productId: string) =>
	queryOptions({
		queryKey: ['admin', 'products', productId],
		queryFn: () => requests.getAdminProduct(productId)
	});

export const adminProductReviewsQuery = (productId: string) =>
	queryOptions({
		queryKey: ['admin', 'products', productId, 'reviews'],
		queryFn: () => requests.getAdminProductReviews(productId)
	});

export const adminUsersQuery = (filters?: UserFilters) =>
	queryOptions({
		queryKey: ['admin', 'users', 'list', filters ?? {}],
		queryFn: () => requests.getAdminUsers(filters)
	});

export const adminUserQuery = (userId: string) =>
	queryOptions({
		queryKey: ['admin', 'users', userId],
		queryFn: () => requests.getAdminUser(userId)
	});

export const adminUserSessionsQuery = (userId: string) =>
	queryOptions({
		queryKey: ['admin', 'users', userId, 'sessions'],
		queryFn: () => requests.getAdminUserSessions(userId)
	});

export const adminUserStoresQuery = (userId: string) =>
	queryOptions({
		queryKey: ['admin', 'users', userId, 'stores'],
		queryFn: () => requests.getAdminUserStores(userId)
	});

export const adminStoresQuery = (filters?: StoreFilters) =>
	queryOptions({
		queryKey: ['admin', 'stores', 'list', filters ?? {}],
		queryFn: () => requests.getAdminStores(filters)
	});

export const adminStoreQuery = (storeId: string) =>
	queryOptions({
		queryKey: ['admin', 'stores', storeId],
		queryFn: () => requests.getAdminStore(storeId)
	});

export const adminStoreProductsQuery = (
	storeId: string,
	filters?: ProductFilters
) =>
	queryOptions({
		queryKey: ['admin', 'stores', storeId, 'products', filters ?? {}],
		queryFn: () => requests.getAdminStoreProducts(storeId, filters)
	});

export const adminStoreOrdersQuery = (
	storeId: string,
	filters?: OrderFilters
) =>
	queryOptions({
		queryKey: ['admin', 'stores', storeId, 'orders', filters ?? {}],
		queryFn: () => requests.getAdminStoreOrders(storeId, filters)
	});

export const adminStoreTransactionsQuery = (
	storeId: string,
	filters?: TransactionFilters
) =>
	queryOptions({
		queryKey: ['admin', 'stores', storeId, 'transactions', filters ?? {}],
		queryFn: () => requests.getAdminStoreTransactions(storeId, filters)
	});

export const adminStoreManagersQuery = (storeId: string) =>
	queryOptions({
		queryKey: ['admin', 'stores', storeId, 'managers'],
		queryFn: () => requests.getAdminStoreManagers(storeId)
	});

export const adminStorePayoutAccountsQuery = (storeId: string) =>
	queryOptions({
		queryKey: ['admin', 'stores', storeId, 'payout-accounts'],
		queryFn: () => requests.getAdminStorePayoutAccounts(storeId)
	});
