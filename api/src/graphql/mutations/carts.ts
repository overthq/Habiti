import * as CartLogic from '../../core/logic/carts';
import { Resolver } from '../../types/resolvers';

export interface DeleteCartArgs {
	id: string;
}

export const deleteCart: Resolver<DeleteCartArgs> = (_, { id }, ctx) => {
	return CartLogic.deleteCart(ctx, { cartId: id });
};

export interface AddToCartArgs {
	input: {
		storeId: string;
		productId: string;
		quantity: number;
	};
}

export const addToCart: Resolver<AddToCartArgs> = (
	_,
	{ input: { storeId, productId, quantity } },
	ctx
) => {
	return CartLogic.addProductToCart(ctx, {
		storeId,
		productId,
		quantity
	});
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
	const cartProduct = await CartLogic.removeProductFromCart(ctx, {
		cartId,
		productId
	});

	return `${cartProduct.cartId}-${cartProduct.productId}`;
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
	return CartLogic.updateCartProductQuantity(ctx, {
		cartId,
		productId,
		quantity
	});
};
