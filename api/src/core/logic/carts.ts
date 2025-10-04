import * as CartData from '../data/carts';
import { AppContext } from '../../utils/context';

interface AddProductToCartInput {
	storeId: string;
	productId: string;
	quantity: number;
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

	if (cart.userId !== ctx.user.id) {
		throw new Error('Unauthorized: Cart does not belong to current user');
	}

	const transaction = calculatePaystackFee(cart.total);
	const service = calculateHabitiFee();
	const total = transaction + service;

	return { ...cart, fees: { transaction, service, total } };
};

export const getCartsByUserId = async (ctx: AppContext, userId: string) => {
	if (userId !== ctx.user.id) {
		throw new Error("Unauthorized: Cannot access other user's carts");
	}

	return CartData.getCartsByUserId(ctx.prisma, userId);
};

export const addProductToCart = async (
	ctx: AppContext,
	input: AddProductToCartInput
) => {
	const { storeId, productId, quantity } = input;

	if (quantity <= 0) {
		throw new Error('Quantity must be greater than 0');
	}

	const cartProduct = await CartData.addProductToCart(ctx.prisma, {
		storeId,
		productId,
		userId: ctx.user.id,
		quantity
	});

	ctx.services.analytics.track({
		event: 'product_added_to_cart',
		distinctId: ctx.user.id,
		properties: {
			productId,
			quantity
		},
		groups: { store: storeId }
	});

	return cartProduct;
};

export const removeProductFromCart = async (
	ctx: AppContext,
	input: RemoveProductFromCartInput
) => {
	const { cartId, productId } = input;

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

export const calculatePaystackFee = (subTotal: number) => {
	return Math.min(200000, 0.015 * subTotal + 10000);
};

export const calculateHabitiFee = () => 100000;
