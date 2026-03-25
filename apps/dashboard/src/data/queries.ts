import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { refreshAuthTokens } from '../utils/refreshManager';
import {
	getCurrentUser,
	getCurrentStore,
	getProducts,
	getProduct,
	getProductReviews,
	getManagedStores,
	getOrders,
	getOrder,
	getCategories,
	getStoreManagers,
	getStoreOverview,
	getCustomer,
	getAddresses,
	getTransactions,
	getTransaction
} from './requests';
import { OrderFilters, ProductFilters, TransactionFilters } from './types';

export const useAuthRefreshQuery = () => {
	return useQuery({
		queryKey: ['auth', 'refresh'],
		queryFn: () => refreshAuthTokens(),
		retry: false
	});
};

export const useCurrentUserQuery = () => {
	return useQuery({
		queryKey: ['users', 'current'],
		queryFn: getCurrentUser
	});
};

export const useCurrentStoreQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current'],
		queryFn: getCurrentStore
	});
};

export const useStoreManagersQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'managers'],
		queryFn: getStoreManagers
	});
};

export const useProductsQuery = (filters?: ProductFilters) => {
	return useQuery({
		queryKey: ['stores', 'current', 'products', filters],
		queryFn: () => getProducts(filters)
	});
};

export const useProductQuery = (productId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'products', productId],
		queryFn: () => getProduct(productId),
		enabled: !!productId
	});
};

export const useProductReviewsQuery = (productId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'products', productId, 'reviews'],
		queryFn: () => getProductReviews(productId),
		enabled: !!productId
	});
};

export const useCategoriesQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'categories'],
		queryFn: () => getCategories()
	});
};

export const useOrdersQuery = (filters?: OrderFilters) => {
	return useQuery({
		queryKey: ['stores', 'current', 'orders', filters],
		queryFn: () => getOrders(filters),
		placeholderData: keepPreviousData
	});
};

export const useOrderQuery = (orderId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'orders', orderId],
		queryFn: () => getOrder(orderId),
		enabled: !!orderId
	});
};

export const useManagedStoresQuery = () => {
	return useQuery({
		queryKey: ['stores', 'managed'],
		queryFn: () => getManagedStores()
	});
};

export const useOverviewQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'overview'],
		queryFn: getStoreOverview
	});
};

export const useCustomerInfoQuery = (userId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'customers', userId],
		queryFn: () => getCustomer(userId),
		enabled: !!userId
	});
};

export const useAddressesQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'addresses'],
		queryFn: () => getAddresses()
	});
};

export const useTransactionsQuery = (filters?: TransactionFilters) => {
	return useQuery({
		queryKey: ['stores', 'current', 'transactions', filters],
		queryFn: () => getTransactions(filters),
		placeholderData: keepPreviousData
	});
};

export const useTransactionQuery = (transactionId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'transactions', transactionId],
		queryFn: () => getTransaction(transactionId),
		enabled: !!transactionId
	});
};
