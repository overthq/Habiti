'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
	addToCart,
	followStore,
	unfollowStore,
	authenticate,
	register,
	createOrder,
	updateCartProductQuantity,
	updateCurrentUser,
	verifyCode,
	deleteCurrentUser,
	getCardAuthorization,
	deleteCard
} from './requests';

import type {
	AddToCartBody,
	AuthenticateBody,
	CreateOrderBody,
	RegisterBody,
	UpdateCartProductQuantityBody,
	UpdateCurrentUserBody,
	VerifyCodeBody
} from './types';
import { useAuthStore } from '@/state/auth-store';
import { useGuestCartStore } from '@/state/guest-cart-store';
import { openPaystackPopup } from '@/lib/payments';

export const useAddToCartMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: AddToCartBody) => addToCart(body),
		onSuccess: data => {
			queryClient.invalidateQueries({
				queryKey: ['carts'],
				exact: true
			});
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

export const useVerifyCodeMutation = () => {
	const { logIn, toggleAuthModal } = useAuthStore();
	const { clear } = useGuestCartStore();

	return useMutation({
		mutationFn: (input: VerifyCodeBody) => verifyCode(input),
		onSuccess: ({ accessToken }) => {
			logIn({ accessToken });
			clear();
			toggleAuthModal();
		}
	});
};

export const useCreateOrderMutation = () => {
	const router = useRouter();
	return useMutation({
		mutationFn: (body: CreateOrderBody) =>
			createOrder({ ...body, cardId: undefined }),
		onSuccess: data => {
			if (data.cardAuthorizationData) {
				openPaystackPopup(data.cardAuthorizationData.access_code);
			}

			router.push(`/orders/${data.order.id}`);
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

export const useDeleteCurrentUserMutation = () => {
	return useMutation({
		mutationFn: () => deleteCurrentUser(),
		onSuccess: () => {
			toast.success('User deleted successfully');
		},
		onError: () => {
			toast.error('Failed to delete user');
		}
	});
};

export const useCompleteOrderPaymentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => getCardAuthorization(orderId),
		onSuccess: data => {
			openPaystackPopup(data.access_code);
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
		onError: () => {
			toast.error('Failed to initiate payment');
		}
	});
};

export const useDeleteCardMutation = () => {
	return useMutation({
		mutationFn: (cardId: string) => deleteCard(cardId),
		onSuccess: () => {},
		onError: () => {
			toast.error('Failed to initiate payment');
		}
	});
};
