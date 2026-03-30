import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	AuthenticateBody,
	RegisterBody,
	AddToCartBody,
	CreateOrderBody
} from './types';
import useStore from '../state';
import {
	addDeliveryAddress,
	addToCart,
	addToWatchlist,
	authenticate,
	createOrder,
	deleteAccount,
	deleteCard,
	deleteDeliveryAddress,
	deletePushToken,
	followStore,
	register,
	removeFromCart,
	savePushToken,
	unfollowStore,
	updateCartProductQuantity,
	updateCurrentUser,
	updateOrder
} from './requests';
import type {
	SavePushTokenBody,
	DeletePushTokenBody,
	UpdateOrderBody
} from './types';

export const useSignUpMutation = () => {
	return useMutation({
		mutationFn: (args: RegisterBody) => register(args)
	});
};

export const useLogInMutation = () => {
	const { logIn } = useStore();

	return useMutation({
		mutationFn: (args: AuthenticateBody) => authenticate(args),
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
		mutationFn: (args: RemoveFromCartArgs) => {
			return removeFromCart(args.cartId, args.productId);
		},
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

export const useDeleteCardMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (cardId: string) => deleteCard(cardId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards'] });
		}
	});
};

export const useUpdateOrderMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			orderId,
			body
		}: {
			orderId: string;
			body: UpdateOrderBody;
		}) => updateOrder(orderId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		}
	});
};

export const useDeleteAccountMutation = () => {
	return useMutation({
		mutationFn: () => deleteAccount()
	});
};

export const useAddToWatchlistMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (productId: string) => addToWatchlist(productId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['watchlist'] });
			queryClient.invalidateQueries({ queryKey: ['home'] });
		}
	});
};

export const useSavePushTokenMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: SavePushTokenBody) => savePushToken(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pushTokens'] });
		}
	});
};

export const useDeletePushTokenMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: DeletePushTokenBody) => deletePushToken(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pushTokens'] });
		}
	});
};

export const useEditProfileMutation = useUpdateCurrentUserMutation;
