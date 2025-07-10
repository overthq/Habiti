import { OrderStatus } from '@prisma/client';

import { saveOrderData, updateOrder } from '../../data/orders';
import { getCartById } from '../../data/carts';
import { CreateOrderInput, UpdateOrderStatusInput } from './types';
import { createOrderHooks, updateOrderHooks } from '../../hooks/orders';
import { validateCart } from '../../validations/carts';
import { createOrderSchema, updateOrderSchema } from '../../validations/orders';
import { AppContext } from '../../../utils/context';
import { ResolverContext } from '../../../types/resolvers';

export const createOrder = async (input: CreateOrderInput, ctx: AppContext) => {
	const { data: validatedInput, success } = createOrderSchema.safeParse(input);

	if (!success) {
		throw new Error('Invalid create order input');
	}

	const { cartId, cardId, transactionFee, serviceFee } = validatedInput;

	const cart = await getCartById(ctx.prisma, cartId);

	await validateCart(cart, ctx.user.id);

	const order = await saveOrderData(ctx.prisma, ctx.user.id, {
		cardId,
		transactionFee,
		serviceFee,
		cart,
		storeId: cart.storeId,
		products: cart.products.map(p => p.product)
	});

	createOrderHooks(ctx.prisma, ctx.services, {
		orderId: order.id,
		userId: ctx.user.id,
		storeId: cart.storeId,
		amount: order.total,
		paymentMethod: 'card',
		productCount: cart.products.length,
		products: cart.products.map(p => p.product),
		customerName: ctx.user.name,
		pushToken: order.user.pushTokens[0] ?? undefined,
		status: cardId ? OrderStatus.PaymentPending : OrderStatus.Pending
	});

	return order;
};

export const updateOrderStatus = async (
	input: UpdateOrderStatusInput,
	ctx: ResolverContext
) => {
	const { data: validatedInput, success } = updateOrderSchema.safeParse(input);

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

	const updatedOrder = await updateOrder(ctx.prisma, orderId, { status });

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
