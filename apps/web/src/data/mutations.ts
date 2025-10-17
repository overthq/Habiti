import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	addToCart,
	followStore,
	unfollowStore,
	authenticate,
	register,
	createOrder,
	updateCartProductQuantity
} from './requests';

import type {
	AddToCartBody,
	AuthenticateBody,
	CreateOrderBody,
	RegisterBody,
	UpdateCartProductQuantityBody
} from './types';

export const useAddToCartMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: AddToCartBody) => addToCart(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['carts'] });
		}
	});
};

export const useUpdateCartProductQuantityMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateCartProductQuantityBody) => {
			return updateCartProductQuantity(body);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['carts'] });
		}
	});
};

export const useFollowStoreMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (storeId: string) => followStore(storeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};

export const useUnfollowStoreMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (storeId: string) => unfollowStore(storeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};

export const useRegisterMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: RegisterBody) => register(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		}
	});
};

export const useAuthenticateMutation = () => {
	return useMutation({
		mutationFn: (input: AuthenticateBody) => authenticate(input),
		onSuccess: () => {}
	});
};

export const useCreateOrderMutation = () => {
	return useMutation({
		mutationFn: (body: CreateOrderBody) => createOrder(body),
		onSuccess: () => {}
	});
};
