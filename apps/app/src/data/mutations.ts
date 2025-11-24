import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LogInBody, SignUpBody } from './auth';
import { AddToCartBody, CreateOrderBody } from './types';
import useStore from '../state';
import {
	addDeliveryAddress,
	addToCart,
	authenticate,
	createOrder,
	deleteDeliveryAddress,
	followStore,
	register,
	removeFromCart,
	unfollowStore,
	updateCartProductQuantity,
	updateCurrentUser
} from './requests';

export const useSignUpMutation = () => {
	return useMutation({
		mutationFn: (args: SignUpBody) => register(args)
	});
};

export const useLogInMutation = () => {
	const { logIn } = useStore();

	return useMutation({
		mutationFn: (args: LogInBody) => authenticate(args),
		onSuccess(data) {
			logIn(data.token);
		}
	});
};

export const useAddToCartMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: AddToCartBody) => addToCart(body),
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
			removeFromCart(args.cartId, args.productId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		}
	});
};

export const useUpdateCartProductMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ productId, body }: { productId: string; body: any }) =>
			updateCartProductQuantity({ productId, ...body }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		}
	});
};

export const useCreateOrderMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: CreateOrderBody) => createOrder(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['cart'] });
		}
	});
};

export const useFollowStoreMutation = (storeId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => followStore(storeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};

export const useUnfollowStoreMutation = (storeId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => unfollowStore(storeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};

export const useUpdateCurrentUserMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateCurrentUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		}
	});
};

export const useAddDeliveryAddressMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addDeliveryAddress,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		}
	});
};

export const useDeleteDeliveryAddressMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteDeliveryAddress(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		}
	});
};
