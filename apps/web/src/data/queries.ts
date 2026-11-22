import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
	getCart,
	getCurrentUser,
	getLandingHighlights,
	getProduct,
	getRelatedProducts,
	getStore,
	getStoreProducts,
	getUserCards,
	getUserCarts,
	getUserFollowedStores,
	getUserOrder,
	getUserOrders,
	globalSearch,
	type ProductFilters
} from '@habiti/data';

import { ensureSession } from './session';

type QueryEnabledOptions = {
	enabled?: boolean;
};

export const useStoreQuery = (storeId: string) => {
	return useQuery({
		queryKey: ['stores', storeId],
		queryFn: () => getStore(storeId)
	});
};

export const useCartsQuery = (options: QueryEnabledOptions = {}) => {
	const isEnabled = options.enabled ?? true;

	return useQuery({
		queryKey: ['carts'],
		queryFn: () => getUserCarts(),
		enabled: isEnabled
	});
};

export const useCartQuery = (
	cartId: string,
	options: QueryEnabledOptions = {}
) => {
	const isEnabled = options.enabled ?? true;

	return useQuery({
		queryKey: ['carts', cartId],
		queryFn: () => getCart(cartId),
		enabled: Boolean(cartId) && isEnabled
	});
};

export const useOrdersQuery = (options: QueryEnabledOptions = {}) => {
	const isEnabled = options.enabled ?? true;

	return useQuery({
		queryKey: ['orders'],
		queryFn: () => getUserOrders(),
		enabled: isEnabled
	});
};

export const useCurrentUserQuery = (options: QueryEnabledOptions = {}) => {
	const isEnabled = options.enabled ?? true;

	return useQuery({
		queryKey: ['users', 'current'],
		queryFn: () => getCurrentUser(),
		enabled: isEnabled
	});
};

export const useOrderQuery = (
	orderId: string,
	options: QueryEnabledOptions = {}
) => {
	const isEnabled = options.enabled ?? true;

	return useQuery({
		queryKey: ['orders', orderId],
		queryFn: () => getUserOrder(orderId),
		enabled: Boolean(orderId) && isEnabled
	});
};

export const useProductQuery = (productId: string) => {
	return useQuery({
		queryKey: ['products', productId],
		queryFn: () => getProduct(productId)
	});
};

export const useFollowedStoresQuery = (options: QueryEnabledOptions = {}) => {
	const isEnabled = options.enabled ?? true;

	return useQuery({
		queryKey: ['followed-stores'],
		queryFn: () => getUserFollowedStores(),
		enabled: isEnabled
	});
};

export const useCardsQuery = (options: QueryEnabledOptions = {}) => {
	const isEnabled = options.enabled ?? true;

	return useQuery({
		queryKey: ['cards'],
		queryFn: () => getUserCards(),
		enabled: isEnabled
	});
};

export const useGlobalSearchQuery = (query: string) => {
	return useQuery({
		queryKey: ['search', query],
		queryFn: () => globalSearch(query),
		placeholderData: keepPreviousData,
		enabled: !!query
	});
};

export const useRelatedProductsQuery = (productId: string) => {
	return useQuery({
		queryKey: ['products', productId, 'related-products'],
		queryFn: () => getRelatedProducts(productId)
	});
};

export const useStoreProductsQuery = (
	storeId: string,
	filters: ProductFilters
) => {
	return useQuery({
		queryKey: ['stores', storeId, 'products', filters],
		queryFn: () => getStoreProducts(storeId, filters),
		placeholderData: keepPreviousData
	});
};

export const useLandingHighlightsQuery = () => {
	return useQuery({
		queryKey: ['landing-highlights'],
		queryFn: () => getLandingHighlights(),
		staleTime: 5 * 60 * 1000
	});
};

// Visitors without a resumable session are given a fresh anonymous one, so
// the app is only ever tokenless if even guest authentication fails (offline).
export const useSessionQuery = () => {
	return useQuery({
		queryKey: ['auth', 'session'],
		queryFn: () => ensureSession(),
		retry: 2,
		staleTime: Infinity
	});
};
