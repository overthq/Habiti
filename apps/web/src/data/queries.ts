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
	globalSearch
} from './requests';

export const useStoreQuery = (storeId: string) => {
	return useQuery({
		queryKey: ['stores', storeId],
		queryFn: () => getStore(storeId)
	});
};

export const useCartsQuery = () => {
	return useQuery({
		queryKey: ['carts'],
		queryFn: () => getCarts()
	});
};

export const useCartQuery = (cartId: string) => {
	return useQuery({
		queryKey: ['carts', cartId],
		queryFn: () => getCart(cartId)
	});
};

export const useOrdersQuery = () => {
	return useQuery({
		queryKey: ['orders'],
		queryFn: () => getOrders()
	});
};

export const useCurrentUserQuery = () => {
	return useQuery({
		queryKey: ['users', 'current'],
		queryFn: () => getCurrentUser()
	});
};

export const useOrderQuery = (orderId: string) => {
	return useQuery({
		queryKey: ['orders', orderId],
		queryFn: () => getOrder(orderId)
	});
};

export const useProductQuery = (productId: string) => {
	return useQuery({
		queryKey: ['products', productId],
		queryFn: () => getProduct(productId)
	});
};

export const useFollowedStoresQuery = () => {
	return useQuery({
		queryKey: ['followed-stores'],
		queryFn: () => getFollowedStores()
	});
};

export const useCardsQuery = () => {
	return useQuery({
		queryKey: ['cards'],
		queryFn: () => getCards()
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
