import { useQuery } from '@tanstack/react-query';

import {
	getCards,
	getCart,
	getCarts,
	getCurrentUser,
	getFollowedStores,
	getOrder,
	getOrders,
	getProduct,
	getRelatedProducts,
	getStore,
	getStoreProducts,
	globalSearch,
	refreshToken
} from './requests';
import useStore from '../state';

// User Queries
export const useCurrentUserQuery = () => {
	return useQuery({
		queryKey: ['user'],
		queryFn: () => getCurrentUser()
	});
};

// Order Queries
export const useOrdersQuery = (filter?: any, orderBy?: any) => {
	return useQuery({
		queryKey: ['orders', filter, orderBy],
		queryFn: () => getOrders()
	});
};

export const useOrderQuery = (orderId: string) => {
	return useQuery({
		queryKey: ['orders', orderId],
		queryFn: () => getOrder(orderId),
		enabled: !!orderId
	});
};

// Product Queries
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
	filter?: any,
	orderBy?: any
) => {
	return useQuery({
		queryKey: ['stores', storeId, 'products', filter, orderBy],
		queryFn: () => getStoreProducts(storeId, new URLSearchParams()),
		enabled: !!storeId
	});
};

export const useCardsQuery = () => {
	return useQuery({
		queryKey: ['cards'],
		queryFn: () => getCards()
	});
};

// Cart Queries
export const useCartsQuery = () => {
	return useQuery({
		queryKey: ['carts'],
		queryFn: () => getCarts()
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
		queryFn: () => globalSearch(searchTerm)
	});
};

export const useAuthRefreshQuery = () => {
	const { logIn } = useStore();

	return useQuery({
		queryKey: ['auth', 'refresh'],
		queryFn: async () => {
			const { accessToken, refreshToken: newRefreshToken } =
				await refreshToken();

			logIn(accessToken);

			return { accessToken, refreshToken: newRefreshToken };
		},
		retry: false
	});
};
