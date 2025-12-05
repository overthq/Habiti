'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
// @ts-expect-error
import Paystack from '@paystack/inline-js';

import {
	addToCart,
	followStore,
	unfollowStore,
	authenticate,
	register,
	createOrder,
	updateCartProductQuantity,
	updateCurrentUser,
	claimCarts
} from './requests';

import type {
	AddToCartBody,
	AuthenticateBody,
	CreateOrderBody,
	RegisterBody,
	UpdateCartProductQuantityBody,
	UpdateCurrentUserBody
} from './types';
import { toast } from 'sonner';

export const useAddToCartMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: AddToCartBody) => addToCart(body),
		onSuccess: data => {
			queryClient.invalidateQueries({
				queryKey: ['carts', data.cartProduct.cartId]
			});
			queryClient.invalidateQueries({
				queryKey: ['products', data.cartProduct.productId]
			});
		}
	});
};

export const useUpdateCartProductQuantityMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateCartProductQuantityBody) => {
			return updateCartProductQuantity(body);
		},
		onSuccess: data => {
			queryClient.invalidateQueries({
				queryKey: ['carts', data.cartProduct.cartId]
			});
			queryClient.invalidateQueries({
				queryKey: ['products', data.cartProduct.productId]
			});
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
		mutationFn: (body: CreateOrderBody) =>
			createOrder({ ...body, cardId: undefined }),
		onSuccess: data => {
			if (data.cardAuthorizationData) {
				const popup = new Paystack();
				console.log({ popup });
				popup.resumeTransaction(data.cardAuthorizationData.access_code);
			}
		},
		onError: () => {
			toast.error('Failed to create order');
		}
	});
};

export const useUpdateCurrentUserMutation = () => {
	return useMutation({
		mutationFn: (body: UpdateCurrentUserBody) => updateCurrentUser(body),
		onSuccess: () => {
			toast.success('Order created successfully');
		},
		onError: () => {
			toast.error('Failed to create order');
		}
	});
};

export const useClaimCartsMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (cartIds: string[]) => claimCarts(cartIds),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['carts'] });
		}
	});
};
