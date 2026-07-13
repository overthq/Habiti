import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
	getCards,
	getCart,
	getCarts,
	getCurrentUser,
	getDeliveryAddresses,
	getFollowedStores,
	getOrder,
	getOrders,
	getProduct,
	getRelatedProducts,
	getStore,
	getStoreProducts,
	getWatchlist,
	getCardAuthorization,
	getPushTokens,
	globalSearch
} from './requests';
import { ensureSession } from '../utils/refreshManager';

export const useCurrentUserQuery = () => {
	return useQuery({
		queryKey: ['user'],
		queryFn: () => getCurrentUser()
	});
};

export const useOrdersQuery = (filter?: any, orderBy?: any) => {
	return useQuery({
		queryKey: ['orders', filter, orderBy],
		queryFn: () => getOrders(),
		placeholderData: keepPreviousData
	});
};

export const useOrderQuery = (orderId: string) => {
	return useQuery({
		queryKey: ['orders', orderId],
		queryFn: () => getOrder(orderId),
		enabled: !!orderId
	});
};

export const useProductQuery = (productId: string) => {
	return useQuery({
		queryKey: ['products', productId],
		queryFn: () => getProduct(productId),
		enabled: !!productId
	});
};

export const useRelatedProductsQuery = (productId: string) => {
	return useQuery({
		queryKey: ['products', productId, 'related'],
		queryFn: () => getRelatedProducts(productId),
		enabled: !!productId
	});
};

export const useStoreQuery = (storeId: string) => {
	return useQuery({
		queryKey: ['stores', storeId],
		queryFn: () => getStore(storeId),
		enabled: !!storeId
	});
};

export const useStoreProductsQuery = (
	storeId: string,
	params: URLSearchParams
) => {
	return useQuery({
		queryKey: ['stores', storeId, 'products', params.toString()],
		queryFn: () => getStoreProducts(storeId, params),
		enabled: !!storeId,
		placeholderData: keepPreviousData
	});
};

export const useCardsQuery = () => {
	return useQuery({
		queryKey: ['cards'],
		queryFn: () => getCards()
	});
};

export const useCartsQuery = () => {
	return useQuery({
		queryKey: ['carts'],
		queryFn: () => getCarts(),
		placeholderData: keepPreviousData
	});
};

export const useCartQuery = (cartId: string) => {
	return useQuery({
		queryKey: ['cart', cartId],
		queryFn: () => getCart(cartId),
		enabled: !!cartId
	});
};

export const useStoresFollowedQuery = () => {
	return useQuery({
		queryKey: ['storesFollowed'],
		queryFn: () => getFollowedStores()
	});
};

export const useSearchQuery = (searchTerm: string) => {
	return useQuery({
		queryKey: ['search', searchTerm],
		queryFn: () => globalSearch(searchTerm),
		enabled: !!searchTerm,
		placeholderData: keepPreviousData
	});
};

export const useDeliveryAddressesQuery = () => {
	return useQuery({
		queryKey: ['deliveryAddresses'],
		queryFn: () => getDeliveryAddresses()
	});
};

export const useWatchlistQuery = () => {
	return useQuery({
		queryKey: ['watchlist'],
		queryFn: () => getWatchlist()
	});
};

export const usePushTokensQuery = () => {
	return useQuery({
		queryKey: ['pushTokens'],
		queryFn: () => getPushTokens()
	});
};

export const useCardAuthorizationQuery = (orderId: string) => {
	return useQuery({
		queryKey: ['cardAuthorization', orderId],
		queryFn: () => getCardAuthorization(orderId),
		enabled: !!orderId
	});
};

export const useHomeQuery = () => {
	return useQuery({
		queryKey: ['home'],
		queryFn: async () => {
			const [ordersData, followedData, watchlistData] = await Promise.all([
				getOrders(),
				getFollowedStores(),
				getWatchlist()
			]);
			return {
				orders: ordersData.orders,
				followed: followedData.stores,
				watchlist: watchlistData.watchlist
			};
		}
	});
};

// Landing only appears if guest authentication fails (offline first launch).
export const useSessionQuery = () => {
	return useQuery({
		queryKey: ['auth', 'session'],
		queryFn: () => ensureSession(),
		retry: 2,
		staleTime: Infinity
	});
};
