import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	addToCart,
	addToUserWatchlist,
	addUserDeliveryAddress,
	createUserOrder,
	deleteCurrentUser,
	deleteUserCard,
	deleteUserDeliveryAddress,
	deleteUserPushToken,
	followStore,
	removeFromCart,
	saveUserPushToken,
	unfollowStore,
	updateCartProductQuantity,
	updateCurrentUser,
	updateUserDeliveryAddress,
	type AddToCartBody,
	type AddressBody,
	type CreateOrderBody,
	type SavePushTokenBody
} from '@habiti/data';

export const useAddToCartMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: AddToCartBody) => addToCart(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
			queryClient.invalidateQueries({ queryKey: ['stores'] });
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
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};

export const useUpdateCartProductMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			productId,
			body
		}: {
			productId: string;
			body: { cartId: string; quantity: number };
		}) => updateCartProductQuantity(body.cartId, productId, body.quantity),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};

export const useCreateOrderMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: CreateOrderBody) => createUserOrder(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['cart'] });
			queryClient.invalidateQueries({ queryKey: ['stores'] });
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
		mutationFn: addUserDeliveryAddress,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['deliveryAddresses'] });
		}
	});
};

export const useUpdateDeliveryAddressMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (args: { addressId: string; body: AddressBody }) =>
			updateUserDeliveryAddress(args.addressId, args.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['deliveryAddresses'] });
		}
	});
};

export const useDeleteDeliveryAddressMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteUserDeliveryAddress(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['deliveryAddresses'] });
		}
	});
};

export const useDeleteCardMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (cardId: string) => deleteUserCard(cardId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['cards'] });
		}
	});
};

export const useDeleteAccountMutation = () => {
	return useMutation({
		mutationFn: () => deleteCurrentUser()
	});
};

export const useAddToWatchlistMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (productId: string) => addToUserWatchlist(productId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['watchlist'] });
			queryClient.invalidateQueries({ queryKey: ['home'] });
		}
	});
};

export const useSavePushTokenMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: SavePushTokenBody) => saveUserPushToken(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pushTokens'] });
		}
	});
};

export const useDeletePushTokenMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: SavePushTokenBody) =>
			deleteUserPushToken(body.token, body.type),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pushTokens'] });
		}
	});
};

export const useEditProfileMutation = useUpdateCurrentUserMutation;
