import { useQuery } from '@tanstack/react-query';

import { OrderFilters, ProductFilters, StoreFilters } from './types';
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
	getOverview
} from './requests';

export const useOrdersQuery = (params?: OrderFilters) => {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => getOrders(params)
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
		queryFn: () => getProducts(params)
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
		queryFn: () => getStores(params)
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
		enabled: !!id
	});
};

export const useStorePayoutsQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'payouts', params],
		queryFn: () => getStorePayouts(id, params),
		enabled: !!id
	});
};

export const useStoreManagersQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'managers', params],
		queryFn: () => getStoreManagers(id, params),
		enabled: !!id
	});
};

export const useUsersQuery = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: () => getUsers()
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
