import * as CartData from '../data/carts';
import { AppContext } from '../../utils/context';
import { err, ok, Result } from './result';
import { LogicErrorCode } from './errors';

export const getCartById = async (
	ctx: AppContext,
	cartId: string
): Promise<
	Result<
		{
			cart: Awaited<ReturnType<typeof CartData.getCartById>> & {
				fees: { transaction: number; service: number; total: number };
			};
			viewerContext: Awaited<
				ReturnType<typeof CartData.getCartViewerContext>
			> | null;
		},
		LogicErrorCode
	>
> => {
	try {
		let cart: Awaited<ReturnType<typeof CartData.getCartById>>;
		try {
			cart = await CartData.getCartById(ctx.prisma, cartId);
		} catch {
			return err(LogicErrorCode.NotFound);
		}

		// Allow access if:
		// 1. Cart belongs to current user
		// 2. Cart is a guest cart (no userId) - anyone with the cart ID can view it
		const isOwner = cart.userId !== null && cart.userId === ctx.user?.id;
		const isGuestCart = cart.userId === null;

		if (!isOwner && !isGuestCart) {
			// If unauthenticated and cart is owned, report NotAuthenticated; otherwise Forbidden
			if (!ctx.user?.id) return err(LogicErrorCode.NotAuthenticated);
			return err(LogicErrorCode.Forbidden);
		}

		const cartViewerContext = ctx.user?.id
			? await CartData.getCartViewerContext(ctx.prisma, ctx.user.id)
			: null;

		const transaction = calculatePaystackFee(cart.total);
		const service = calculateHabitiFee();
		const total = transaction + service;

		return ok({
			cart: { ...cart, fees: { transaction, service, total } },
			viewerContext: cartViewerContext
		});
	} catch (e) {
		console.error('[CartLogic.getCartById] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getCartsByUserId = async (
	ctx: AppContext,
	userId: string
): Promise<
	Result<Awaited<ReturnType<typeof CartData.getCartsByUserId>>, LogicErrorCode>
> => {
	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}
		if (userId !== ctx.user.id) {
			return err(LogicErrorCode.Forbidden);
		}

		return ok(await CartData.getCartsByUserId(ctx.prisma, userId));
	} catch (e) {
		console.error('[CartLogic.getCartsByUserId] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getCartsFromList = async (
	ctx: AppContext,
	cartIds: string[]
): Promise<
	Result<Awaited<ReturnType<typeof CartData.getCartsFromList>>, LogicErrorCode>
> => {
	try {
		return ok(await CartData.getCartsFromList(ctx.prisma, cartIds));
	} catch (e) {
		console.error('[CartLogic.getCartsFromList] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
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
): Promise<
	Result<Awaited<ReturnType<typeof CartData.addProductToCart>>, LogicErrorCode>
> => {
	const { storeId, productId, quantity, cartId } = input;

	try {
		if (quantity <= 0) {
			return err(LogicErrorCode.InvalidQuantity);
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

		return ok(cartProduct);
	} catch (e) {
		console.error('[CartLogic.addProductToCart] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface RemoveProductFromCartInput {
	cartId: string;
	productId: string;
}

export const removeProductFromCart = async (
	ctx: AppContext,
	input: RemoveProductFromCartInput
): Promise<
	Result<
		Awaited<ReturnType<typeof CartData.removeProductFromCart>>,
		LogicErrorCode
	>
> => {
	const { cartId, productId } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		let cart: Awaited<ReturnType<typeof CartData.getCartById>>;
		try {
			cart = await CartData.getCartById(ctx.prisma, cartId);
		} catch {
			return err(LogicErrorCode.NotFound);
		}

		if (cart.userId !== ctx.user.id) {
			return err(LogicErrorCode.Forbidden);
		}

		let cartProduct: Awaited<ReturnType<typeof CartData.removeProductFromCart>>;
		try {
			cartProduct = await CartData.removeProductFromCart(ctx.prisma, {
				userId: ctx.user.id,
				cartId,
				productId
			});
		} catch {
			return err(LogicErrorCode.NotFound);
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

		return ok(cartProduct);
	} catch (e) {
		console.error('[CartLogic.removeProductFromCart] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface UpdateCartQuantityInput {
	cartId: string;
	productId: string;
	quantity: number;
}

export const updateCartProductQuantity = async (
	ctx: AppContext,
	input: UpdateCartQuantityInput
): Promise<
	Result<
		Awaited<ReturnType<typeof CartData.updateCartProductQuantity>>,
		LogicErrorCode
	>
> => {
	const { cartId, productId, quantity } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		if (quantity < 0) {
			return err(LogicErrorCode.NegativeQuantity);
		}

		let cart: Awaited<ReturnType<typeof CartData.getCartById>>;
		try {
			cart = await CartData.getCartById(ctx.prisma, cartId);
		} catch {
			return err(LogicErrorCode.NotFound);
		}

		if (cart.userId !== ctx.user.id) {
			return err(LogicErrorCode.Forbidden);
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

		return ok(cartProduct);
	} catch (e) {
		console.error('[CartLogic.updateCartProductQuantity] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface DeleteCartInput {
	cartId: string;
}

export const deleteCart = async (
	ctx: AppContext,
	input: DeleteCartInput
): Promise<
	Result<Awaited<ReturnType<typeof CartData.getCartById>>, LogicErrorCode>
> => {
	const { cartId } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		let cart: Awaited<ReturnType<typeof CartData.getCartById>>;
		try {
			cart = await CartData.getCartById(ctx.prisma, cartId);
		} catch {
			return err(LogicErrorCode.NotFound);
		}

		if (cart.userId !== ctx.user.id) {
			return err(LogicErrorCode.Forbidden);
		}

		try {
			await CartData.deleteCart(ctx.prisma, {
				userId: ctx.user.id,
				cartId
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			if (msg.toLowerCase().includes('does not exist')) {
				return err(LogicErrorCode.NotFound);
			}
			if (msg.toLowerCase().includes('unauthorized')) {
				return err(LogicErrorCode.Forbidden);
			}
			console.error('[CartLogic.deleteCart] Unexpected error', e);
			return err(LogicErrorCode.Unexpected);
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

		return ok(cart);
	} catch (e) {
		console.error('[CartLogic.deleteCart] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface ClaimCartsInput {
	cartIds: string[];
}

export const claimCarts = async (
	ctx: AppContext,
	input: ClaimCartsInput
): Promise<
	Result<Awaited<ReturnType<typeof CartData.claimCarts>>, LogicErrorCode>
> => {
	const { cartIds } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
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

		return ok(claimedCarts);
	} catch (e) {
		console.error('[CartLogic.claimCarts] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const calculatePaystackFee = (subTotal: number) => {
	return Math.min(200000, 0.015 * subTotal + 10000);
};

export const calculateHabitiFee = () => 100000;
