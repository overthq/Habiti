import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import {
	addToCart,
	appleSignIn,
	confirmUserOrderPickup,
	createStore,
	deleteCurrentUser,
	deleteUserCard,
	followStore,
	login,
	register,
	unfollowStore,
	updateCartProductQuantity,
	updateCurrentUser,
	verifyCode,
	type AddToCartBody,
	type AppleSignInBody,
	type CreateOrderBody,
	type CreateStoreBody,
	type LoginBody,
	type RegisterBody,
	type Store,
	type UpdateCurrentUserBody,
	type VerifyCodeBody
} from '@habiti/data';

import { completeOrderPayment, createOrderWithPayment } from '@/lib/payments';
import { performLogout } from './session';
import { useAuthStore } from '@/state/auth-store';

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
		mutationFn: (body: {
			cartId: string;
			productId: string;
			quantity: number;
		}) => {
			return updateCartProductQuantity(
				body.cartId,
				body.productId,
				body.quantity
			);
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

const toastApiError = (fallback: string) => (error: unknown) => {
	toast.error(
		error instanceof AxiosError
			? (error.response?.data?.message ?? error.message)
			: fallback
	);
};

export const useRegisterMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: RegisterBody) => register(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] });
		},
		onError: toastApiError('Could not create your account')
	});
};

export const useAuthenticateMutation = () => {
	return useMutation({
		mutationFn: (input: LoginBody) => login(input),
		onError: toastApiError('Could not send a login code')
	});
};

export const useVerifyCodeMutation = () => {
	const queryClient = useQueryClient();
	const { logIn, toggleAuthModal } = useAuthStore();

	return useMutation({
		mutationFn: (input: VerifyCodeBody) => verifyCode(input),
		onSuccess: async ({ accessToken }) => {
			logIn({ accessToken });
			toggleAuthModal();
			// The guest's anonymous data was merged into the account
			// server-side; refetch everything under the new identity. The
			// session itself is already fresh, and refetching it would rotate
			// the refresh cookie for nothing.
			await queryClient.invalidateQueries({
				predicate: query => query.queryKey[0] !== 'auth'
			});
		},
		onError: toastApiError('Could not verify your code')
	});
};

export const useAppleSignInMutation = () => {
	const queryClient = useQueryClient();
	const { logIn, toggleAuthModal } = useAuthStore();

	return useMutation({
		mutationFn: (input: AppleSignInBody) => appleSignIn(input),
		onSuccess: async ({ accessToken }) => {
			logIn({ accessToken });
			toggleAuthModal();
			await queryClient.invalidateQueries({
				predicate: query => query.queryKey[0] !== 'auth'
			});
		},
		onError: toastApiError('Sign in with Apple failed')
	});
};

export const useLogoutMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: performLogout,
		onSettled: () =>
			// Reset rather than remove, so mounted queries (like the current user
			// in the nav) refetch under the new guest session.
			queryClient.resetQueries({
				predicate: query => query.queryKey[0] !== 'auth'
			})
	});
};

export const useCreateOrderMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateOrderBody) => createOrderWithPayment(body),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			navigate({ to: '/orders/$id', params: { id: data.order.id } });
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
			toast.success('Profile updated');
		},
		onError: () => {
			toast.error('Failed to update profile');
		}
	});
};

export const useDeleteCurrentUserMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteCurrentUser(),
		onSuccess: async () => {
			await performLogout();
			await queryClient.resetQueries({
				predicate: query => query.queryKey[0] !== 'auth'
			});
			navigate({ to: '/' });
			toast.success('Your account has been deleted');
		},
		onError: () => {
			toast.error('Failed to delete user');
		}
	});
};

export const useCompleteOrderPaymentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => completeOrderPayment(orderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
		onError: () => {
			toast.error('Failed to initiate payment');
		}
	});
};

export const useConfirmPickupMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => confirmUserOrderPickup(orderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			toast.success('Pickup confirmed');
		},
		onError: () => {
			toast.error('Failed to confirm pickup');
		}
	});
};

interface UseCreateStoreMutationOptions {
	onSuccess?: (store: Store) => void;
}

export const useCreateStoreMutation = (
	options: UseCreateStoreMutationOptions = {}
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateStoreBody) => createStore(body),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
			toast.success('Store created');
			options.onSuccess?.(data.store);
		},
		onError: (error: unknown) => {
			const message =
				error instanceof AxiosError
					? (error.response?.data?.message ?? error.message)
					: 'Failed to create store';
			toast.error(message);
		}
	});
};

export const useDeleteCardMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (cardId: string) => deleteUserCard(cardId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards'] });
			toast.success('Card removed');
		},
		onError: () => {
			toast.error('Failed to remove card');
		}
	});
};
