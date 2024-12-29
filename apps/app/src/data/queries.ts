import { useQuery } from '@tanstack/react-query';

import dataService from './index';

// User Queries
export const useCurrentUserQuery = () => {
	return useQuery({
		queryKey: ['user'],
		queryFn: () => dataService.users.getCurrentUser()
	});
};

// Order Queries
export const useOrdersQuery = (filter?: any, orderBy?: any) => {
	return useQuery({
		queryKey: ['orders', filter, orderBy],
		queryFn: () => dataService.orders.getOrders({ filter, orderBy })
	});
};

export const useOrderQuery = (orderId: string) => {
	return useQuery({
		queryKey: ['orders', orderId],
		queryFn: () => dataService.orders.getOrder(orderId),
		enabled: !!orderId
	});
};

// Product Queries
export const useProductsQuery = (filter?: any, orderBy?: any) => {
	return useQuery({
		queryKey: ['products', filter, orderBy],
		queryFn: () => dataService.products.getProducts({ filter, orderBy })
	});
};

export const useProductQuery = (productId: string) => {
	return useQuery({
		queryKey: ['products', productId],
		queryFn: () => dataService.products.getProduct(productId),
		enabled: !!productId
	});
};

export const useProductReviewsQuery = (productId: string) => {
	return useQuery({
		queryKey: ['products', productId, 'reviews'],
		queryFn: () => dataService.products.getProductReviews(productId),
		enabled: !!productId
	});
};

export const useRelatedProductsQuery = (productId: string) => {
	return useQuery({
		queryKey: ['products', productId, 'related'],
		queryFn: () => dataService.products.getRelatedProducts(productId),
		enabled: !!productId
	});
};

// Store Queries
export const useStoresQuery = (filter?: any, orderBy?: any) => {
	return useQuery({
		queryKey: ['stores', filter, orderBy],
		queryFn: () => dataService.stores.getStores({ filter, orderBy })
	});
};

export const useStoreQuery = (storeId: string) => {
	return useQuery({
		queryKey: ['stores', storeId],
		queryFn: () => dataService.stores.getStore(storeId),
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
		queryFn: () =>
			dataService.stores.getStoreProducts(storeId, { filter, orderBy }),
		enabled: !!storeId
	});
};

export const useStoreOrdersQuery = (
	storeId: string,
	filter?: any,
	orderBy?: any
) => {
	return useQuery({
		queryKey: ['stores', storeId, 'orders', filter, orderBy],
		queryFn: () =>
			dataService.stores.getStoreOrders(storeId, { filter, orderBy }),
		enabled: !!storeId
	});
};

// Card Queries
export const useCardsQuery = () => {
	return useQuery({
		queryKey: ['cards'],
		queryFn: () => dataService.cards.getCards()
	});
};

// Cart Queries
export const useCartsQuery = () => {
	return useQuery({
		queryKey: ['carts'],
		queryFn: () => dataService.carts.getCarts()
	});
};

export const useCartQuery = (cartId: string) => {
	return useQuery({
		queryKey: ['cart', cartId],
		queryFn: () => dataService.carts.getCart(cartId),
		enabled: !!cartId
	});
};

export const useStoresFollowedQuery = () => {
	return useQuery({
		queryKey: ['storesFollowed'],
		queryFn: () => dataService.users.getFollowedStores()
	});
};

export const useSearchQuery = (searchTerm: string) => {
	return useQuery({
		queryKey: ['search', searchTerm],
		queryFn: () => dataService.search.search(searchTerm)
	});
};
