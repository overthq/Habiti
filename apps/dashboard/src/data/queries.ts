import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { refreshAuthTokens } from '../lib/auth';
import {
	getCurrentStore,
	getCurrentStoreAddresses,
	getCurrentStoreBalance,
	getCurrentStoreCategories,
	getCurrentStoreCustomer,
	getCurrentStoreManagers,
	getCurrentStoreOrder,
	getCurrentStoreOrders,
	getCurrentStoreOverview,
	getCurrentStorePayoutAccounts,
	getCurrentStoreProduct,
	getCurrentStoreProductReviews,
	getCurrentStoreProducts,
	getCurrentStoreTransaction,
	getCurrentStoreTransactions,
	getCurrentUser,
	getUserManagedStores,
	type OrderFilters,
	type ProductFilters,
	type TransactionFilters
} from '@habiti/data';

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

export const useStoreBalanceQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'balance'],
		queryFn: getCurrentStoreBalance
	});
};

export const usePayoutAccountsQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'payout-accounts'],
		queryFn: getCurrentStorePayoutAccounts
	});
};

export const useStoreManagersQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'managers'],
		queryFn: getCurrentStoreManagers
	});
};

export const useProductsQuery = (filters?: ProductFilters) => {
	return useQuery({
		queryKey: ['stores', 'current', 'products', filters],
		queryFn: () => getCurrentStoreProducts(filters),
		placeholderData: keepPreviousData
	});
};

export const useProductQuery = (productId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'products', productId],
		queryFn: () => getCurrentStoreProduct(productId),
		enabled: !!productId
	});
};

export const useProductReviewsQuery = (productId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'products', productId, 'reviews'],
		queryFn: () => getCurrentStoreProductReviews(productId),
		enabled: !!productId
	});
};

export const useCategoriesQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'categories'],
		queryFn: () => getCurrentStoreCategories()
	});
};

export const useOrdersQuery = (filters?: OrderFilters) => {
	return useQuery({
		queryKey: ['stores', 'current', 'orders', filters],
		queryFn: () => getCurrentStoreOrders(filters),
		placeholderData: keepPreviousData
	});
};

export const useOrderQuery = (orderId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'orders', orderId],
		queryFn: () => getCurrentStoreOrder(orderId),
		enabled: !!orderId
	});
};

export const useManagedStoresQuery = () => {
	return useQuery({
		queryKey: ['stores', 'managed'],
		queryFn: () => getUserManagedStores()
	});
};

export const useOverviewQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'overview'],
		queryFn: getCurrentStoreOverview
	});
};

export const useCustomerInfoQuery = (userId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'customers', userId],
		queryFn: () => getCurrentStoreCustomer(userId),
		enabled: !!userId
	});
};

export const useAddressesQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'addresses'],
		queryFn: () => getCurrentStoreAddresses()
	});
};

export const useTransactionsQuery = (filters?: TransactionFilters) => {
	return useQuery({
		queryKey: ['stores', 'current', 'transactions', filters],
		queryFn: () => getCurrentStoreTransactions(filters),
		placeholderData: keepPreviousData
	});
};

export const useTransactionQuery = (transactionId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'transactions', transactionId],
		queryFn: () => getCurrentStoreTransaction(transactionId),
		enabled: !!transactionId
	});
};
