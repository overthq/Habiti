import { useQuery } from '@tanstack/react-query';

import dataService from '../services';
import { StoreFilters } from '../services/stores';

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
