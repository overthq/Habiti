import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
	authorizeUserCard,
	getCart,
	getCurrentUser,
	getLandingHighlights,
	getProduct,
	getRelatedProducts,
	getStore,
	getStoreProducts,
	getUserCards,
	getUserCarts,
	getUserDeliveryAddresses,
	getUserFollowedStores,
	getUserOrder,
	getUserOrders,
	getUserPushTokens,
	getUserWatchlist,
	globalSearch,
	type ProductFilters
} from '@habiti/data';
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
		queryFn: () => getUserOrders(),
		placeholderData: keepPreviousData
	});
};

export const useOrderQuery = (orderId: string) => {
	return useQuery({
		queryKey: ['orders', orderId],
		queryFn: () => getUserOrder(orderId),
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
	filters: ProductFilters
) => {
	return useQuery({
		queryKey: ['stores', storeId, 'products', filters],
		queryFn: () => getStoreProducts(storeId, filters),
		enabled: !!storeId,
		placeholderData: keepPreviousData
	});
};

export const useCardsQuery = () => {
	return useQuery({
		queryKey: ['cards'],
		queryFn: () => getUserCards()
	});
};

export const useCartsQuery = () => {
	return useQuery({
		queryKey: ['carts'],
		queryFn: () => getUserCarts(),
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
		queryFn: () => getUserFollowedStores()
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
		queryFn: () => getUserDeliveryAddresses()
	});
};

export const useWatchlistQuery = () => {
	return useQuery({
		queryKey: ['watchlist'],
		queryFn: () => getUserWatchlist()
	});
};

export const usePushTokensQuery = () => {
	return useQuery({
		queryKey: ['pushTokens'],
		queryFn: () => getUserPushTokens()
	});
};

export const useCardAuthorizationQuery = (orderId: string) => {
	return useQuery({
		queryKey: ['cardAuthorization', orderId],
		queryFn: () => authorizeUserCard(orderId)
	});
};

export const useHomeQuery = () => {
	return useQuery({
		queryKey: ['home'],
		queryFn: async () => {
			const [ordersData, followedData, watchlistData] = await Promise.all([
				getUserOrders(),
				getUserFollowedStores(),
				getUserWatchlist()
			]);
			return {
				orders: ordersData.orders,
				followed: followedData.stores,
				watchlist: watchlistData.watchlist
			};
		}
	});
};

// Kept separate from `useHomeQuery` so that discovery content still renders
// when the personalized sections fail, and vice versa.
export const useLandingHighlightsQuery = () => {
	return useQuery({
		queryKey: ['landingHighlights'],
		queryFn: () => getLandingHighlights(),
		staleTime: 5 * 60 * 1000
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
