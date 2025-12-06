import { OrderStatus } from '@prisma/client';

import * as CardLogic from './cards';

import * as OrderData from '../data/orders';
import * as CartData from '../data/carts';

import { CreateOrderInput, UpdateOrderStatusInput } from './types';
import { createOrderHooks, updateOrderHooks } from './hooks';
import { validateCart } from '../validations/carts';
import { createOrderSchema, updateOrderSchema } from '../validations/orders';
import { AppContext } from '../../utils/context';
import { InitializeTransactionResponse } from '../payments/paystack';

export const createOrder = async (ctx: AppContext, input: CreateOrderInput) => {
	const { data: validatedInput, success } = createOrderSchema.safeParse(input);

	if (!ctx.user) {
		throw new Error('User not authenticated');
	}

	if (!success) {
		throw new Error('Invalid create order input');
	}

	const { cartId, cardId, transactionFee, serviceFee } = validatedInput;

	const cart = await CartData.getCartById(ctx.prisma, cartId);

	await validateCart(cart, ctx.user.id);

	const order = await OrderData.saveOrderData(ctx.prisma, ctx.user.id, {
		cardId,
		transactionFee,
		serviceFee,
		cart,
		storeId: cart.storeId
	});

	// FIXME: Incredibly hacky (inconsistent response)
	// To prevent having dealing with multiple requests for the
	// "create card with this order" flow.

	let cardAuthorizationData: InitializeTransactionResponse['data'] | undefined =
		undefined;

	if (!cardId) {
		cardAuthorizationData = await CardLogic.authorizeCard(ctx, {
			orderId: order.id
		});
	}

	createOrderHooks(ctx.prisma, ctx.services, {
		orderId: order.id,
		userId: ctx.user.id,
		storeId: cart.storeId,
		amount: order.total,
		serviceFee: order.serviceFee,
		transactionFee: order.transactionFee,
		paymentMethod: 'card',
		productCount: cart.products.length,
		products: cart.products.map(p => p.product),
		customerName: ctx.user.name,
		pushToken: order.user.pushTokens[0] ?? undefined,
		status: cardId ? OrderStatus.PaymentPending : OrderStatus.Pending
	});

	return { order, cardAuthorizationData };
};

export const updateOrderStatus = async (
	ctx: AppContext,
	input: UpdateOrderStatusInput
) => {
	const { data: validatedInput, success } = updateOrderSchema.safeParse(input);

	if (!ctx.user) {
		throw new Error('User not authenticated');
	}

	if (!success) {
		throw new Error('Invalid update order input');
	}

	const { orderId, status } = validatedInput;

	const currentOrder = await ctx.prisma.order.findUnique({
		where: { id: orderId },
		include: { store: true }
	});

	if (!currentOrder) {
		throw new Error(`Order not found: ${orderId}`);
	}

	validateStatusTransition(currentOrder.status, status);

	const updatedOrder = await OrderData.updateOrder(ctx.prisma, orderId, {
		status
	});

	updateOrderHooks(ctx.prisma, ctx.services, {
		customerName: ctx.user.name,
		pushToken: updatedOrder.user.pushTokens[0] ?? undefined,
		orderId: updatedOrder.id,
		userId: ctx.user.id,
		storeId: currentOrder.storeId,
		amount: updatedOrder.total,
		status
	});

	return updatedOrder;
};

const validateStatusTransition = (
	currentStatus: OrderStatus,
	newStatus: OrderStatus
) => {
	const validTransitions: Record<OrderStatus, OrderStatus[]> = {
		[OrderStatus.PaymentPending]: [OrderStatus.Pending, OrderStatus.Cancelled],
		[OrderStatus.Pending]: [OrderStatus.Completed, OrderStatus.Cancelled],
		[OrderStatus.Completed]: [],
		[OrderStatus.Cancelled]: []
	};

	const allowedTransitions = validTransitions[currentStatus] || [];
	if (!allowedTransitions.includes(newStatus)) {
		throw new Error(
			`Invalid status transition from ${currentStatus} to ${newStatus}`
		);
	}
};

export const getOrderById = async (ctx: AppContext, orderId: string) => {
	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
	}

	const order = await OrderData.getOrderById(ctx.prisma, orderId);

	if (!order) {
		throw new Error('Order not found');
	}

	if (order.userId !== ctx.user.id) {
		const isUserAdmin = await ctx.isAdmin();

		if (!isUserAdmin) {
			throw new Error('User not authorized to view this order.');
		}
	}

	ctx.services.analytics.track({
		event: 'order_viewed',
		distinctId: ctx.user.id,
		properties: {
			orderId: order.id
		},
		groups: { store: order.storeId }
	});

	return order;
};

export const getOrders = async (ctx: AppContext, query: any) => {
	return OrderData.getOrders(ctx.prisma, query);
};
