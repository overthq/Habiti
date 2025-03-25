import { useQuery } from '@tanstack/react-query';

import dataService from './services';
import { OrderFilters } from './services/orders';
import { ProductFilters } from './services/products';
import { StoreFilters } from './services/stores';

export const useOrdersQuery = (params?: OrderFilters) => {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => dataService.orders.getOrders(params)
	});
};

export const useOrderQuery = (id: string) => {
	return useQuery({
		queryKey: ['orders', id],
		queryFn: () => dataService.orders.getOrder(id),
		enabled: !!id
	});
};

export const useProductsQuery = (params?: ProductFilters) => {
	return useQuery({
		queryKey: ['products', params],
		queryFn: () => dataService.products.getProducts(params)
	});
};

export const useProductQuery = (id: string) => {
	return useQuery({
		queryKey: ['products', id],
		queryFn: () => dataService.products.getProduct(id),
		enabled: !!id
	});
};

export const useProductReviewsQuery = (id: string) => {
	return useQuery({
		queryKey: ['products', id, 'reviews'],
		queryFn: () => dataService.products.getProductReviews(id),
		enabled: !!id
	});
};

export const useStoresQuery = (params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', params],
		queryFn: () => dataService.stores.getStores(params)
	});
};

export const useStoreQuery = (id: string) => {
	return useQuery({
		queryKey: ['stores', id],
		queryFn: () => dataService.stores.getStore(id),
		enabled: !!id
	});
};

export const useStoreProductsQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'products', params],
		queryFn: () => dataService.stores.getStoreProducts(id, params),
		enabled: !!id
	});
};

export const useStoreOrdersQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'orders', params],
		queryFn: () => dataService.stores.getStoreOrders(id, params),
		enabled: !!id
	});
};

export const useStorePayoutsQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'payouts', params],
		queryFn: () => dataService.stores.getStorePayouts(id, params),
		enabled: !!id
	});
};

export const useStoreManagersQuery = (id: string, params?: StoreFilters) => {
	return useQuery({
		queryKey: ['stores', id, 'managers', params],
		queryFn: () => dataService.stores.getStoreManagers(id, params),
		enabled: !!id
	});
};

export const useUsersQuery = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: () => dataService.users.getUsers()
	});
};

export const useUserQuery = (id: string) => {
	return useQuery({
		queryKey: ['users', id],
		queryFn: () => dataService.users.getUser(id),
		enabled: !!id
	});
};
