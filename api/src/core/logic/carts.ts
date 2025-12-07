import * as CartData from '../data/carts';
import { AppContext } from '../../utils/context';

interface AddProductToCartInput {
	storeId: string;
	productId: string;
	quantity: number;
	cartId?: string; // For guest carts
}

interface RemoveProductFromCartInput {
	cartId: string;
	productId: string;
}

interface UpdateCartQuantityInput {
	cartId: string;
	productId: string;
	quantity: number;
}

interface DeleteCartInput {
	cartId: string;
}

export const getCartById = async (ctx: AppContext, cartId: string) => {
	const cart = await CartData.getCartById(ctx.prisma, cartId);

	// Allow access if:
	// 1. Cart belongs to current user
	// 2. Cart is a guest cart (no userId) - anyone with the cart ID can view it
	const isOwner = cart.userId !== null && cart.userId === ctx.user?.id;
	const isGuestCart = cart.userId === null;

	if (!isOwner && !isGuestCart) {
		throw new Error('Unauthorized: Cart does not belong to current user');
	}

	const cartViewerContext = ctx.user?.id
		? await CartData.getCartViewerContext(ctx.prisma, ctx.user.id)
		: null;

	const transaction = calculatePaystackFee(cart.total);
	const service = calculateHabitiFee();
	const total = transaction + service;

	return {
		cart: { ...cart, fees: { transaction, service, total } },
		viewerContext: cartViewerContext
	};
};

export const getCartsByUserId = async (ctx: AppContext, userId: string) => {
	if (!ctx.user?.id || userId !== ctx.user.id) {
		throw new Error("Unauthorized: Cannot access other user's carts");
	}

	return CartData.getCartsByUserId(ctx.prisma, userId);
};

export const getCartsFromList = async (ctx: AppContext, cartIds: string[]) => {
	return CartData.getCartsFromList(ctx.prisma, cartIds);
};

export const addProductToCart = async (
	ctx: AppContext,
	input: AddProductToCartInput
) => {
	const { storeId, productId, quantity, cartId } = input;

	if (quantity <= 0) {
		throw new Error('Quantity must be greater than 0');
	}

	const cartProduct = await CartData.addProductToCart(ctx.prisma, {
		storeId,
		productId,
		quantity,
		...(ctx.user?.id && { userId: ctx.user.id }),
		...(cartId && { cartId })
	});

	// Only track analytics if user is authenticated
	if (ctx.user?.id) {
		ctx.services.analytics.track({
			event: 'product_added_to_cart',
			distinctId: ctx.user.id,
			properties: {
				productId,
				quantity
			},
			groups: { store: storeId }
		});
	}

	return cartProduct;
};

export const removeProductFromCart = async (
	ctx: AppContext,
	input: RemoveProductFromCartInput
) => {
	const { cartId, productId } = input;

	if (!ctx.user?.id) {
		throw new Error('Authentication required');
	}

	const cart = await CartData.getCartById(ctx.prisma, cartId);

	if (cart.userId !== ctx.user.id) {
		throw new Error('Unauthorized: Cart does not belong to current user');
	}

	const cartProduct = await CartData.removeProductFromCart(ctx.prisma, {
		userId: ctx.user.id,
		cartId,
		productId
	});

	ctx.services.analytics.track({
		event: 'product_removed_from_cart',
		distinctId: ctx.user.id,
		properties: {
			productId,
			cartId
		},
		groups: { store: cart.storeId }
	});

	return cartProduct;
};

export const updateCartProductQuantity = async (
	ctx: AppContext,
	input: UpdateCartQuantityInput
) => {
	const { cartId, productId, quantity } = input;

	if (!ctx.user?.id) {
		throw new Error('Authentication required');
	}

	if (quantity < 0) {
		throw new Error('Quantity cannot be negative');
	}

	const cart = await CartData.getCartById(ctx.prisma, cartId);

	if (cart.userId !== ctx.user.id) {
		throw new Error('Unauthorized: Cart does not belong to current user');
	}

	const cartProduct = await CartData.updateCartProductQuantity(ctx.prisma, {
		cartId,
		productId,
		quantity
	});

	ctx.services.analytics.track({
		event: 'cart_quantity_updated',
		distinctId: ctx.user.id,
		properties: {
			productId,
			cartId,
			newQuantity: quantity
		},
		groups: { store: cart.storeId }
	});

	return cartProduct;
};

export const deleteCart = async (ctx: AppContext, input: DeleteCartInput) => {
	const { cartId } = input;

	if (!ctx.user?.id) {
		throw new Error('Authentication required');
	}

	const cart = await CartData.getCartById(ctx.prisma, cartId);

	if (cart.userId !== ctx.user.id) {
		throw new Error('Unauthorized: Cart does not belong to current user');
	}

	await CartData.deleteCart(ctx.prisma, {
		userId: ctx.user.id,
		cartId
	});

	ctx.services.analytics.track({
		event: 'cart_deleted',
		distinctId: ctx.user.id,
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
}

export const claimCarts = async (ctx: AppContext, input: ClaimCartsInput) => {
	const { cartIds } = input;

	if (!ctx.user?.id) {
		throw new Error('Authentication required to claim carts');
	}

	const claimedCarts = await CartData.claimCarts(ctx.prisma, {
		userId: ctx.user.id,
		cartIds
	});

	ctx.services.analytics.track({
		event: 'carts_claimed',
		distinctId: ctx.user.id,
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
