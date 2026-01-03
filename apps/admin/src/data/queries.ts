import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
	type OrderFilters,
	type ProductFilters,
	type StoreFilters,
	type PayoutFilters,
	type UserFilters
} from './types';
import {
	getOrders,
	getOrder,
	getProducts,
	getProduct,
	getProductReviews,
	getStores,
	getStore,
	getStoreProducts,
	getStoreOrders,
	getStorePayouts,
	getStoreManagers,
	getUsers,
	getUser,
	getOverview,
	getPayouts,
	getPayout
} from './requests';

export const useOrdersQuery = (params?: OrderFilters) => {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => getOrders(params),
		placeholderData: keepPreviousData
	});
};

export const useOrderQuery = (id: string) => {
	return useQuery({
		queryKey: ['orders', id],
		queryFn: () => getOrder(id),
		enabled: !!id
	});
};

export const useProductsQuery = (params?: ProductFilters) => {
	return useQuery({
		queryKey: ['products', params],
		queryFn: () => getProducts(params),
		placeholderData: keepPreviousData
	});
};

export const useProductQuery = (id: string) => {
	return useQuery({
		queryKey: ['products', id],
		queryFn: () => getProduct(id),
		enabled: !!id
	});
};

export const useProductReviewsQuery = (id: string) => {
	return useQuery({
		queryKey: ['products', id, 'reviews'],
		queryFn: () => getProductReviews(id),
		enabled: !!id
	});
};

export const useStoresQuery = (params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', params],
		queryFn: () => getStores(params),
		placeholderData: keepPreviousData
	});
};

export const useStoreQuery = (id: string) => {
	return useQuery({
		queryKey: ['stores', id],
		queryFn: () => getStore(id),
		enabled: !!id
	});
};

export const useStoreProductsQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'products', params],
		queryFn: () => getStoreProducts(id, params),
		enabled: !!id
	});
};

export const useStoreOrdersQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'orders', params],
		queryFn: () => getStoreOrders(id, params),
		enabled: !!id,
		placeholderData: keepPreviousData
	});
};

export const useStorePayoutsQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'payouts', params],
		queryFn: () => getStorePayouts(id, params),
		enabled: !!id,
		placeholderData: keepPreviousData
	});
};

export const useStoreManagersQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'managers', params],
		queryFn: () => getStoreManagers(id, params),
		enabled: !!id,
		placeholderData: keepPreviousData
	});
};

export const useUsersQuery = (params?: UserFilters) => {
	return useQuery({
		queryKey: ['users', params],
		queryFn: () => getUsers(params),
		placeholderData: keepPreviousData
	});
};

export const useUserQuery = (id: string) => {
	return useQuery({
		queryKey: ['users', id],
		queryFn: () => getUser(id),
		enabled: !!id
	});
};

export const useOverviewQuery = () => {
	return useQuery({
		queryKey: ['overview'],
		queryFn: () => getOverview()
	});
};

export const usePayoutsQuery = (params?: PayoutFilters) => {
	return useQuery({
		queryKey: ['payouts', params],
		queryFn: () => getPayouts(params),
		placeholderData: keepPreviousData
	});
};

export const usePayoutQuery = (id: string) => {
	return useQuery({
		queryKey: ['payouts', id],
		queryFn: () => getPayout(id),
		enabled: !!id
	});
};
