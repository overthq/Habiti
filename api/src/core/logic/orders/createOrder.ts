import { ResolverContext } from '../../../types/resolvers';
import { saveOrderData } from '../../data/orders';
import { getCartById } from '../../data/carts';
import {
	CreateOrderInput,
	OrderCreationResult,
	OrderSideEffects
} from './types';
import { NotificationType } from '../../../types/notifications';
import { Cart, CartProduct, OrderStatus, Product } from '@prisma/client';

export const validateCreateOrderInput = async (input: CreateOrderInput) => {
	if (!input.cartId) {
		throw new Error('Cart ID is required');
	}

	if (input.transactionFee < 0 || input.serviceFee < 0) {
		throw new Error('Fees cannot be negative');
	}
};

export const validateCart = async (
	cart: Cart & { products: (CartProduct & { product: Product })[] },
	ctx: ResolverContext
) => {
	if (!cart) {
		throw new Error('Cart not found');
	}

	if (cart.products.length === 0) {
		throw new Error('Cart is empty');
	}

	if (cart.userId !== ctx.user.id) {
		throw new Error('Unauthorized: Cart does not belong to current user');
	}

	for (const cartProduct of cart.products) {
		const product = cartProduct.product;
		if (product.quantity < cartProduct.quantity) {
			throw new Error(`Insufficient stock for product: ${product.name}`);
		}
	}
};

export const createOrder = async (
	input: CreateOrderInput,
	ctx: ResolverContext
): Promise<OrderCreationResult> => {
	const { cartId, cardId, transactionFee, serviceFee } = input;

	await validateCreateOrderInput(input);

	const cart = await getCartById(ctx, cartId);
	await validateCart(cart, ctx);

	const order = await saveOrderData(ctx, {
		cardId,
		transactionFee,
		serviceFee,
		cart,
		storeId: cart.storeId,
		products: cart.products.map(p => p.product)
	});

	const sideEffects = {
		notifications: [
			{
				type: NotificationType.NewOrder,
				data: {
					storeId: cart.storeId,
					orderId: order.id,
					customerName: ctx.user.name,
					amount: order.total,
					status: cardId ? OrderStatus.PaymentPending : OrderStatus.Pending
				}
			}
		],
		revenueUpdate: undefined,
		analyticsEvents: [
			{
				event: 'order_created',
				properties: {
					orderId: order.id,
					storeId: cart.storeId,
					amount: order.total,
					productCount: cart.products.length,
					products: cart.products.map(p => ({
						id: p.product.id,
						name: p.product.name,
						price: p.product.unitPrice,
						quantity: p.quantity
					}))
				}
			}
		]
	} satisfies OrderSideEffects;

	return { order, sideEffects };
};
