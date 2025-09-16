import { useQuery } from '@tanstack/react-query';
import {
	getCarts,
	getStore,
	getCart,
	getOrders,
	getCurrentUser,
	getOrder,
	getProduct
} from './requests';

export const useStoreQuery = (storeId: string) => {
	return useQuery({
		queryKey: ['store', storeId],
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
		queryKey: ['cart', cartId],
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
