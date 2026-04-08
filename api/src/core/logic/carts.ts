import type { Context } from 'hono';

import * as CartData from '../data/carts';
import type { AppEnv } from '../../types/hono';
import { LogicError, LogicErrorCode } from './errors';

export const getCartById = async (c: Context<AppEnv>, cartId: string) => {
	const cart = await CartData.getCartById(c.var.prisma, cartId);

	if (!cart) {
		throw new LogicError(LogicErrorCode.CartNotFound);
	}

	// Allow access if:
	// 1. Cart belongs to current user
	// 2. Cart is a guest cart (no userId) - anyone with the cart ID can view it
	const isOwner = cart.userId !== null && cart.userId === c.var.auth?.id;
	const isGuestCart = cart.userId === null;

	if (!isOwner && !isGuestCart) {
		if (!c.var.auth?.id) {
			throw new LogicError(LogicErrorCode.NotAuthenticated);
		}

		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const cartViewerContext = c.var.auth?.id
		? await CartData.getCartViewerContext(c.var.prisma, c.var.auth.id)
		: null;

	const transaction = calculatePaystackFee(cart.total);
	const service = calculateHabitiFee();
	const total = transaction + service;

	return {
		cart: { ...cart, fees: { transaction, service, total } },
		viewerContext: cartViewerContext
	};
};

export const getCartsByUserId = async (c: Context<AppEnv>, userId: string) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}
	if (userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return CartData.getCartsByUserId(c.var.prisma, userId);
};

export const getCartsFromList = async (
	c: Context<AppEnv>,
	cartIds: string[]
) => {
	return CartData.getCartsFromList(c.var.prisma, cartIds);
};

interface AddProductToCartInput {
	storeId: string;
	productId: string;
	quantity: number;
	cartId?: string | undefined; // For guest carts
}

export const addProductToCart = async (
	c: Context<AppEnv>,
	input: AddProductToCartInput
) => {
	const { storeId, productId, quantity, cartId } = input;

	if (quantity <= 0) {
		throw new LogicError(LogicErrorCode.InvalidQuantity);
	}

	const cartProduct = await CartData.addProductToCart(c.var.prisma, {
		storeId,
		productId,
		quantity,
		...(c.var.auth?.id && { userId: c.var.auth.id }),
		...(cartId && { cartId })
	});

	// Only track analytics if user is authenticated
	if (c.var.auth?.id) {
		c.var.services.analytics.track({
			event: 'product_added_to_cart',
			distinctId: c.var.auth.id,
			properties: {
				productId,
				quantity
			},
			groups: { store: storeId }
		});
	}

	return cartProduct;
};

interface RemoveProductFromCartInput {
	cartId: string;
	productId: string;
}

export const removeProductFromCart = async (
	c: Context<AppEnv>,
	input: RemoveProductFromCartInput
) => {
	const { cartId, productId } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const cart = await CartData.getCartById(c.var.prisma, cartId);

	if (!cart) {
		throw new LogicError(LogicErrorCode.CartNotFound);
	}

	if (cart.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const cartProduct = await CartData.removeProductFromCart(c.var.prisma, {
		userId: c.var.auth.id,
		cartId,
		productId
	});

	if (!cartProduct) {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	c.var.services.analytics.track({
		event: 'product_removed_from_cart',
		distinctId: c.var.auth.id,
		properties: {
			productId,
			cartId
		},
		groups: { store: cart.storeId }
	});

	return cartProduct;
};

interface UpdateCartQuantityInput {
	cartId: string;
	productId: string;
	quantity: number;
}

export const updateCartProductQuantity = async (
	c: Context<AppEnv>,
	input: UpdateCartQuantityInput
) => {
	const { cartId, productId, quantity } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (quantity < 0) {
		throw new LogicError(LogicErrorCode.NegativeQuantity);
	}

	const cart = await CartData.getCartById(c.var.prisma, cartId);

	if (!cart) {
		throw new LogicError(LogicErrorCode.CartNotFound);
	}

	if (cart.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const cartProduct = await CartData.updateCartProductQuantity(c.var.prisma, {
		cartId,
		productId,
		quantity
	});

	c.var.services.analytics.track({
		event: 'cart_quantity_updated',
		distinctId: c.var.auth.id,
		properties: {
			productId,
			cartId,
			newQuantity: quantity
		},
		groups: { store: cart.storeId }
	});

	return cartProduct;
};

interface DeleteCartInput {
	cartId: string;
}

export const deleteCart = async (
	c: Context<AppEnv>,
	input: DeleteCartInput
) => {
	const { cartId } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const cart = await CartData.getCartById(c.var.prisma, cartId);

	if (!cart) {
		throw new LogicError(LogicErrorCode.CartNotFound);
	}

	if (cart.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	await CartData.deleteCartById(c.var.prisma, cartId);

	c.var.services.analytics.track({
		event: 'cart_deleted',
		distinctId: c.var.auth.id,
		properties: {
			cartId,
			productCount: cart.products.length,
			cartValue: cart.total
		},
		groups: { store: cart.storeId }
	});

	return cart;
};

interface ClaimCartsInput {
	cartIds: string[];
	userId: string;
}

export const claimCarts = async (
	c: Context<AppEnv>,
	input: ClaimCartsInput
) => {
	const { cartIds, userId } = input;

	const claimedCarts = await CartData.claimCarts(c.var.prisma, {
		userId,
		cartIds
	});

	c.var.services.analytics.track({
		event: 'carts_claimed',
		distinctId: userId,
		properties: {
			cartIds,
			claimedCount: claimedCarts.length
		}
	});

	return claimedCarts;
};

export const calculatePaystackFee = (subTotal: number) => {
	return Math.min(200000, 0.015 * subTotal + 10000);
};

export const calculateHabitiFee = () => 100000;
