import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
	getCarts,
	getStore,
	getCart,
	getOrders,
	getCurrentUser,
	getOrder,
	getProduct,
	getFollowedStores,
	getCards,
	getRelatedProducts,
	getStoreProducts,
	globalSearch,
	getLandingHighlights,
	getGuestCarts
} from './requests';
import { useGuestCartStore } from '@/state/guest-cart-store';

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
		queryFn: () => getCarts(),
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

export const useGuestCartsQuery = (options: QueryEnabledOptions = {}) => {
	const isEnabled = options.enabled ?? true;
	const { cartIds } = useGuestCartStore();

	return useQuery({
		queryKey: ['carts', 'guest'],
		queryFn: () => getGuestCarts(cartIds),
		enabled: isEnabled && cartIds.length > 0
	});
};

export const useOrdersQuery = (options: QueryEnabledOptions = {}) => {
	const isEnabled = options.enabled ?? true;

	return useQuery({
		queryKey: ['orders'],
		queryFn: () => getOrders(),
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
		queryFn: () => getOrder(orderId),
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
		queryFn: () => getFollowedStores(),
		enabled: isEnabled
	});
};

export const useCardsQuery = (options: QueryEnabledOptions = {}) => {
	const isEnabled = options.enabled ?? true;

	return useQuery({
		queryKey: ['cards'],
		queryFn: () => getCards(),
		enabled: isEnabled
	});
};

export const useGlobalSearchQuery = (query: string) => {
	return useQuery({
		queryKey: ['search', query],
		queryFn: () => globalSearch(query),
		placeholderData: keepPreviousData
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
	queryParams: URLSearchParams
) => {
	const queryString = queryParams.toString();

	return useQuery({
		queryKey: ['stores', storeId, 'products', queryString],
		queryFn: () => getStoreProducts(storeId, queryParams)
	});
};

export const useLandingHighlightsQuery = () => {
	return useQuery({
		queryKey: ['landing-highlights'],
		queryFn: () => getLandingHighlights(),
		staleTime: 5 * 60 * 1000
	});
};
