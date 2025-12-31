import * as CartData from '../data/carts';
import { AppContext } from '../../utils/context';
import { LogicError, LogicErrorCode } from './errors';

export const getCartById = async (
	ctx: AppContext,
	cartId: string
): Promise<{
	cart: Awaited<ReturnType<typeof CartData.getCartById>> & {
		fees: { transaction: number; service: number; total: number };
	};
	viewerContext: Awaited<
		ReturnType<typeof CartData.getCartViewerContext>
	> | null;
}> => {
	let cart: Awaited<ReturnType<typeof CartData.getCartById>>;
	try {
		cart = await CartData.getCartById(ctx.prisma, cartId);
	} catch {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	// Allow access if:
	// 1. Cart belongs to current user
	// 2. Cart is a guest cart (no userId) - anyone with the cart ID can view it
	const isOwner = cart.userId !== null && cart.userId === ctx.user?.id;
	const isGuestCart = cart.userId === null;

	if (!isOwner && !isGuestCart) {
		// If unauthenticated and cart is owned, report NotAuthenticated; otherwise Forbidden
		if (!ctx.user?.id) {
			throw new LogicError(LogicErrorCode.NotAuthenticated);
		}
		throw new LogicError(LogicErrorCode.Forbidden);
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

export const getCartsByUserId = async (
	ctx: AppContext,
	userId: string
): Promise<Awaited<ReturnType<typeof CartData.getCartsByUserId>>> => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}
	if (userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return CartData.getCartsByUserId(ctx.prisma, userId);
};

export const getCartsFromList = async (
	ctx: AppContext,
	cartIds: string[]
): Promise<Awaited<ReturnType<typeof CartData.getCartsFromList>>> => {
	return CartData.getCartsFromList(ctx.prisma, cartIds);
};

interface AddProductToCartInput {
	storeId: string;
	productId: string;
	quantity: number;
	cartId?: string; // For guest carts
}

export const addProductToCart = async (
	ctx: AppContext,
	input: AddProductToCartInput
): Promise<Awaited<ReturnType<typeof CartData.addProductToCart>>> => {
	const { storeId, productId, quantity, cartId } = input;

	if (quantity <= 0) {
		throw new LogicError(LogicErrorCode.InvalidQuantity);
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

interface RemoveProductFromCartInput {
	cartId: string;
	productId: string;
}

export const removeProductFromCart = async (
	ctx: AppContext,
	input: RemoveProductFromCartInput
): Promise<Awaited<ReturnType<typeof CartData.removeProductFromCart>>> => {
	const { cartId, productId } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	let cart: Awaited<ReturnType<typeof CartData.getCartById>>;
	try {
		cart = await CartData.getCartById(ctx.prisma, cartId);
	} catch {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	if (cart.userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	let cartProduct: Awaited<ReturnType<typeof CartData.removeProductFromCart>>;
	try {
		cartProduct = await CartData.removeProductFromCart(ctx.prisma, {
			userId: ctx.user.id,
			cartId,
			productId
		});
	} catch {
		throw new LogicError(LogicErrorCode.NotFound);
	}

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

interface UpdateCartQuantityInput {
	cartId: string;
	productId: string;
	quantity: number;
}

export const updateCartProductQuantity = async (
	ctx: AppContext,
	input: UpdateCartQuantityInput
): Promise<Awaited<ReturnType<typeof CartData.updateCartProductQuantity>>> => {
	const { cartId, productId, quantity } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (quantity < 0) {
		throw new LogicError(LogicErrorCode.NegativeQuantity);
	}

	let cart: Awaited<ReturnType<typeof CartData.getCartById>>;
	try {
		cart = await CartData.getCartById(ctx.prisma, cartId);
	} catch {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	if (cart.userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
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

interface DeleteCartInput {
	cartId: string;
}

export const deleteCart = async (
	ctx: AppContext,
	input: DeleteCartInput
): Promise<Awaited<ReturnType<typeof CartData.getCartById>>> => {
	const { cartId } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	let cart: Awaited<ReturnType<typeof CartData.getCartById>>;
	try {
		cart = await CartData.getCartById(ctx.prisma, cartId);
	} catch {
		throw new LogicError(LogicErrorCode.NotFound);
	}

	if (cart.userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	try {
		await CartData.deleteCart(ctx.prisma, {
			userId: ctx.user.id,
			cartId
		});
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		if (msg.toLowerCase().includes('does not exist')) {
			throw new LogicError(LogicErrorCode.NotFound);
		}
		if (msg.toLowerCase().includes('unauthorized')) {
			throw new LogicError(LogicErrorCode.Forbidden);
		}
		throw e;
	}

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

export const claimCarts = async (
	ctx: AppContext,
	input: ClaimCartsInput
): Promise<Awaited<ReturnType<typeof CartData.claimCarts>>> => {
	const { cartIds } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
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
