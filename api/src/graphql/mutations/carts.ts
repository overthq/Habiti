import { authenticatedResolver } from '../permissions';
import * as CartLogic from '../../core/logic/carts';

export interface DeleteCartArgs {
	id: string;
}

export const deleteCart = authenticatedResolver<DeleteCartArgs>(
	(_, { id }, ctx) => {
		return CartLogic.deleteCart(ctx, { cartId: id });
	}
);

export interface AddToCartArgs {
	input: {
		storeId: string;
		productId: string;
		quantity: number;
	};
}

export const addToCart = authenticatedResolver<AddToCartArgs>(
	(_, { input: { storeId, productId, quantity } }, ctx) => {
		return CartLogic.addProductToCart(ctx, {
			storeId,
			productId,
			quantity
		});
	}
);

export interface RemoveProductArgs {
	cartId: string;
	productId: string;
}

export const removeFromCart = authenticatedResolver<RemoveProductArgs>(
	async (_, { cartId, productId }, ctx) => {
		const cartProduct = await CartLogic.removeProductFromCart(ctx, {
			cartId,
			productId
		});

		return `${cartProduct.cartId}-${cartProduct.productId}`;
	}
);

export interface UpdateCartProductArgs {
	input: {
		cartId: string;
		productId: string;
		quantity: number;
	};
}

export const updateCartProduct = authenticatedResolver<UpdateCartProductArgs>(
	async (_, { input: { cartId, productId, quantity } }, ctx) => {
		return CartLogic.updateCartProductQuantity(ctx, {
			cartId,
			productId,
			quantity
		});
	}
);
