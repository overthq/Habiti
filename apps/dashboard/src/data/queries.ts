import { useQuery } from '@tanstack/react-query';
import { refreshAuthTokens } from '../utils/refreshManager';
import {
	getCurrentStore,
	getProducts,
	getProduct,
	getProductReviews,
	getManagedStores,
	getPayouts,
	getPayout,
	getOrders,
	getOrder,
	getCategories,
	getStoreManagers,
	getStoreOverview,
	getCustomer
} from './requests';
import { OrderFilters, ProductFilters } from './types';

export const useAuthRefreshQuery = () => {
	return useQuery({
		queryKey: ['auth', 'refresh'],
		queryFn: () => refreshAuthTokens(),
		retry: false
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
		queryFn: () => getOrders(filters)
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

export const usePayoutsQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'payouts'],
		queryFn: () => getPayouts()
	});
};

export const useOverviewQuery = () => {
	return useQuery({
		queryKey: ['stores', 'current', 'overview'],
		queryFn: getStoreOverview
	});
};

export const usePayoutQuery = (payoutId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'payouts', payoutId],
		queryFn: () => getPayout(payoutId),
		enabled: !!payoutId
	});
};

export const useCustomerInfoQuery = (userId: string) => {
	return useQuery({
		queryKey: ['stores', 'current', 'customers', userId],
		queryFn: () => getCustomer(userId),
		enabled: !!userId
	});
};
