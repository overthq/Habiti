import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
	getAdminOrder,
	getAdminOrders,
	getAdminOverview,
	getAdminProduct,
	getAdminProductReviews,
	getAdminProducts,
	getAdminStore,
	getAdminStoreManagers,
	getAdminStoreOrders,
	getAdminStorePayoutAccounts,
	getAdminStoreProducts,
	getAdminStores,
	getAdminStoreTransactions,
	getAdminUser,
	getAdminUsers,
	getAdminUserSessions,
	getAdminUserStores,
	type OrderFilters,
	type ProductFilters,
	type StoreFilters,
	type TransactionFilters,
	type UserFilters
} from '@habiti/data';

export const useOrdersQuery = (params?: OrderFilters) => {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => getAdminOrders(params),
		placeholderData: keepPreviousData
	});
};

export const useOrderQuery = (id: string) => {
	return useQuery({
		queryKey: ['orders', id],
		queryFn: () => getAdminOrder(id),
		enabled: !!id
	});
};

export const useProductsQuery = (params?: ProductFilters) => {
	return useQuery({
		queryKey: ['products', params],
		queryFn: () => getAdminProducts(params),
		placeholderData: keepPreviousData
	});
};

export const useProductQuery = (id: string) => {
	return useQuery({
		queryKey: ['products', id],
		queryFn: () => getAdminProduct(id),
		enabled: !!id
	});
};

export const useProductReviewsQuery = (id: string) => {
	return useQuery({
		queryKey: ['products', id, 'reviews'],
		queryFn: () => getAdminProductReviews(id),
		enabled: !!id
	});
};

export const useStoresQuery = (params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', params],
		queryFn: () => getAdminStores(params),
		placeholderData: keepPreviousData
	});
};

export const useStoreQuery = (id: string) => {
	return useQuery({
		queryKey: ['stores', id],
		queryFn: () => getAdminStore(id),
		enabled: !!id
	});
};

export const useStoreProductsQuery = (id: string, params?: ProductFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'products', params],
		queryFn: () => getAdminStoreProducts(id, params),
		enabled: !!id
	});
};

export const useStoreOrdersQuery = (id: string, params?: OrderFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'orders', params],
		queryFn: () => getAdminStoreOrders(id, params),
		enabled: !!id,
		placeholderData: keepPreviousData
	});
};

export const useStoreManagersQuery = (id: string) => {
	return useQuery({
		queryKey: ['stores', id, 'managers'],
		queryFn: () => getAdminStoreManagers(id),
		enabled: !!id,
		placeholderData: keepPreviousData
	});
};

export const useStorePayoutAccountsQuery = (storeId: string) => {
	return useQuery({
		queryKey: ['stores', storeId, 'payout-accounts'],
		queryFn: () => getAdminStorePayoutAccounts(storeId),
		enabled: !!storeId
	});
};

export const useUsersQuery = (params?: UserFilters) => {
	return useQuery({
		queryKey: ['users', params],
		queryFn: () => getAdminUsers(params),
		placeholderData: keepPreviousData
	});
};

export const useUserQuery = (id: string) => {
	return useQuery({
		queryKey: ['users', id],
		queryFn: () => getAdminUser(id),
		enabled: !!id
	});
};

export const useUserSessionsQuery = (userId: string) => {
	return useQuery({
		queryKey: ['users', userId, 'sessions'],
		queryFn: () => getAdminUserSessions(userId),
		enabled: !!userId
	});
};

export const useUserStoresQuery = (userId: string) => {
	return useQuery({
		queryKey: ['users', userId, 'stores'],
		queryFn: () => getAdminUserStores(userId),
		enabled: !!userId
	});
};

export const useOverviewQuery = () => {
	return useQuery({
		queryKey: ['overview'],
		queryFn: () => getAdminOverview()
	});
};

export const useStoreTransactionsQuery = (
	id: string,
	params?: TransactionFilters
) => {
	return useQuery({
		queryKey: ['stores', id, 'transactions', params],
		queryFn: () => getAdminStoreTransactions(id, params),
		enabled: !!id,
		placeholderData: keepPreviousData
	});
};
