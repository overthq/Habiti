import * as CartLogic from '../../core/logic/carts';
import { Resolver } from '../../types/resolvers';

export interface DeleteCartArgs {
	id: string;
}

export const deleteCart: Resolver<DeleteCartArgs> = async (_, { id }, ctx) => {
	const result = await CartLogic.deleteCart(ctx, { cartId: id });

	if (!result.ok) throw new Error(result.error);

	return result.data;
};

export interface AddToCartArgs {
	input: {
		storeId: string;
		productId: string;
		quantity: number;
	};
}

export const addToCart: Resolver<AddToCartArgs> = async (
	_,
	{ input: { storeId, productId, quantity } },
	ctx
) => {
	const result = await CartLogic.addProductToCart(ctx, {
		storeId,
		productId,
		quantity
	});

	if (!result.ok) throw new Error(result.error);

	return result.data;
};

export interface RemoveProductArgs {
	cartId: string;
	productId: string;
}

export const removeFromCart: Resolver<RemoveProductArgs> = async (
	_,
	{ cartId, productId },
	ctx
) => {
	const cartProductResult = await CartLogic.removeProductFromCart(ctx, {
		cartId,
		productId
	});

	if (!cartProductResult.ok) throw new Error(cartProductResult.error);

	return `${cartProductResult.data.cartId}-${cartProductResult.data.productId}`;
};

export interface UpdateCartProductArgs {
	input: {
		cartId: string;
		productId: string;
		quantity: number;
	};
}

export const updateCartProduct: Resolver<UpdateCartProductArgs> = async (
	_,
	{ input: { cartId, productId, quantity } },
	ctx
) => {
	const result = await CartLogic.updateCartProductQuantity(ctx, {
		cartId,
		productId,
		quantity
	});

	if (!result.ok) throw new Error(result.error);

	return result.data;
};
