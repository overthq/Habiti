import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LogInBody, ResetPasswordBody, SignUpBody } from './auth';
import { AddProductToCartBody } from './carts';
import dataService from './index';
import { CreateOrderBody } from './orders';
import useStore from '../state';

interface AddProductReviewArgs {
	productId: string;
	body: { comment: string; rating: number };
}

// Auth Mutations
export const useSignUpMutation = () => {
	return useMutation({
		mutationFn: (args: SignUpBody) => dataService.auth.signUp(args)
	});
};

export const useLogInMutation = () => {
	const { logIn } = useStore();

	return useMutation({
		mutationFn: (args: LogInBody) => dataService.auth.logIn(args),
		onSuccess(data) {
			logIn(data.user.id, data.token);
		}
	});
};

export const useResetPasswordMutation = () => {
	return useMutation({
		mutationFn: (body: ResetPasswordBody) =>
			dataService.auth.resetPassword(body)
	});
};

// Cart Mutations
export const useAddToCartMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: AddProductToCartBody) =>
			dataService.carts.addProductToCart(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		}
	});
};

interface RemoveFromCartArgs {
	cartId: string;
	productId: string;
}

export const useRemoveFromCartMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (args: RemoveFromCartArgs) =>
			dataService.carts.removeProductFromCart(args.cartId, args.productId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		}
	});
};

export const useUpdateCartProductMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ productId, body }: { productId: string; body: any }) =>
			dataService.carts.updateCartProduct(productId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		}
	});
};

// Order Mutations
export const useCreateOrderMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: CreateOrderBody) => dataService.orders.createOrder(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		}
	});
};

export const useCancelOrderMutation = (orderId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => dataService.orders.cancelOrder(orderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		}
	});
};

// Store Mutations
export const useFollowStoreMutation = (storeId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => dataService.stores.followStore(storeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};

export const useUnfollowStoreMutation = (storeId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => dataService.stores.unfollowStore(storeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};

// Product Mutations
export const useAddProductReviewMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (args: AddProductReviewArgs) =>
			dataService.products.addProductReview(args.productId, args.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		}
	});
};

// User Mutations
export const useUpdateCurrentUserMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: dataService.users.updateCurrentUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		}
	});
};

export const useAddDeliveryAddressMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: dataService.users.addDeliveryAddress,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		}
	});
};

export const useDeleteDeliveryAddressMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => dataService.users.deleteDeliveryAddress(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		}
	});
};
