import type { Context } from 'hono';

import { OrderStatus } from '../../generated/prisma/client';

import * as CardLogic from './cards';
import * as PaymentLogic from './payments';

import * as OrderData from '../data/orders';
import * as CartData from '../data/carts';
import * as CardData from '../data/cards';

import { calculatePaystackFee, calculateHabitiFee } from './carts';
import { createOrderHooks, updateOrderHooks } from './hooks';
import { validateCart } from '../validations/carts';
import { createOrderSchema, updateOrderSchema } from '../validations/rest';
import type { AppEnv } from '../../types/hono';
import { InitializeTransactionResponse } from '../payments/paystack';
import { LogicError, LogicErrorCode } from './errors';
import { OrderFilters } from '../../utils/queries';

interface CreateOrderInput {
	cartId: string;
	cardId?: string | undefined;
}

export const createOrder = async (
	c: Context<AppEnv>,
	input: CreateOrderInput
) => {
	const { data: validatedInput, success } = createOrderSchema.safeParse(input);

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!success) {
		throw new LogicError(LogicErrorCode.ValidationFailed);
	}

	const { cartId, cardId } = validatedInput;

	const cart = await CartData.getCartById(c.var.prisma, cartId);

	if (!cart) {
		throw new LogicError(LogicErrorCode.CartNotFound);
	}

	await validateCart(cart, c.var.auth.id);

	const { orderData, total } = OrderData.getOrderData(cart.products);
	const transactionFee = calculatePaystackFee(total);
	const serviceFee = calculateHabitiFee();
	const userId = c.var.auth.id;
	const storeId = cart.storeId;

	// All orders start as PaymentPending. Revenue is only tracked
	// once payment is confirmed and the order transitions to Pending.
	const order = await c.var.prisma.$transaction(async prisma => {
		const store = await OrderData.incrementStoreOrderCount(prisma, {
			storeId
		});

		const newOrder = await OrderData.createOrderWithProducts(prisma, {
			userId,
			storeId,
			serialNumber: store.orderCount,
			orderData,
			total,
			transactionFee,
			serviceFee,
			status: OrderStatus.PaymentPending
		});

		await CartData.deleteCartById(prisma, cart.id);

		await OrderData.decrementProductQuantities(prisma, {
			products: cart.products.map(p => ({
				productId: p.productId,
				quantity: p.quantity
			}))
		});

		return newOrder;
	});

	// Initiate payment after the order is persisted so the orderId
	// can be passed as metadata for webhook identification.
	let cardAuthorizationData: InitializeTransactionResponse['data'] | undefined =
		undefined;

	if (cardId) {
		const card = await CardData.getCardById(c.var.prisma, cardId);

		if (!card) {
			throw new LogicError(LogicErrorCode.CardNotFound);
		}

		try {
			await PaymentLogic.chargeAuthorization(c, {
				email: card.email,
				amount: String(total + transactionFee + serviceFee),
				authorizationCode: card.authorizationCode,
				metadata: { orderId: order.id }
			});
		} catch (error) {
			console.error(error);
			throw new LogicError(LogicErrorCode.PaymentFailed);
		}
	} else {
		cardAuthorizationData = await CardLogic.authorizeCard(c, {
			orderId: order.id
		});
	}

	createOrderHooks(c, {
		orderId: order.id,
		userId: c.var.auth.id,
		storeId: cart.storeId,
		amount: order.total,
		serviceFee: order.serviceFee,
		transactionFee: order.transactionFee,
		products: cart.products.map(p => p.product),
		customerName: c.var.auth.name,
		pushToken: order.user.pushTokens[0] ?? undefined,
		status: OrderStatus.PaymentPending
	});

	return {
		order,
		...(cardAuthorizationData ? { cardAuthorizationData } : {})
	};
};

export interface UpdateOrderStatusInput {
	orderId: string;
	status: OrderStatus;
}

export const updateOrderStatus = async (
	c: Context<AppEnv>,
	input: UpdateOrderStatusInput
) => {
	const { data: validatedInput, success } = updateOrderSchema.safeParse(input);

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!success) {
		throw new LogicError(LogicErrorCode.ValidationFailed);
	}

	const { orderId, status } = validatedInput;

	const currentOrder = await OrderData.getOrderByIdWithStore(
		c.var.prisma,
		orderId
	);

	if (!currentOrder) {
		throw new LogicError(LogicErrorCode.OrderNotFound);
	}

	validateStatusTransition(currentOrder.status, status);

	const updatedOrder = await OrderData.updateOrder(c.var.prisma, orderId, {
		status
	});

	await updateOrderHooks(c, {
		customerName: c.var.auth.name,
		pushToken: updatedOrder.user.pushTokens[0] ?? undefined,
		orderId: updatedOrder.id,
		userId: c.var.auth.id,
		storeId: currentOrder.storeId,
		amount: updatedOrder.total,
		status
	});

	return updatedOrder;
};

const validateStatusTransition = (
	currentStatus: OrderStatus,
	newStatus: OrderStatus
): void => {
	const validTransitions: Record<OrderStatus, OrderStatus[]> = {
		[OrderStatus.PaymentPending]: [OrderStatus.Pending, OrderStatus.Cancelled],
		[OrderStatus.Pending]: [OrderStatus.ReadyForPickup, OrderStatus.Cancelled],
		[OrderStatus.ReadyForPickup]: [
			OrderStatus.Completed,
			OrderStatus.Cancelled
		],
		[OrderStatus.Completed]: [],
		[OrderStatus.Cancelled]: []
	} as const;

	const allowedTransitions = validTransitions[currentStatus] || [];
	if (!allowedTransitions.includes(newStatus)) {
		throw new LogicError(LogicErrorCode.OrderInvalidStatusTransition);
	}
};

export const getOrderById = async (c: Context<AppEnv>, orderId: string) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const order = await OrderData.getOrderById(c.var.prisma, orderId);

	if (!order) {
		throw new LogicError(LogicErrorCode.OrderNotFound);
	}

	const userOwnsOrder = order.userId === c.var.auth.id;
	const storeOwnsOrder = order.storeId === c.var.storeId;

	if (!c.var.isAdmin && !userOwnsOrder && !storeOwnsOrder) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	c.var.services.analytics.track({
		event: 'order_viewed',
		distinctId: c.var.auth.id,
		properties: {
			orderId: order.id
		},
		groups: { store: order.storeId }
	});

	return order;
};

export const confirmPickup = async (c: Context<AppEnv>, orderId: string) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const currentOrder = await OrderData.getOrderByIdWithStore(
		c.var.prisma,
		orderId
	);

	if (!currentOrder) {
		throw new LogicError(LogicErrorCode.OrderNotFound);
	}

	if (currentOrder.userId !== c.var.auth.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	validateStatusTransition(currentOrder.status, OrderStatus.Completed);

	const updatedOrder = await OrderData.updateOrder(c.var.prisma, orderId, {
		status: OrderStatus.Completed
	});

	try {
		await updateOrderHooks(c, {
			customerName: c.var.auth.name,
			pushToken: updatedOrder.user.pushTokens[0] ?? undefined,
			orderId: updatedOrder.id,
			userId: c.var.auth.id,
			storeId: currentOrder.storeId,
			amount: updatedOrder.total,
			status: OrderStatus.Completed
		});
	} catch (error) {
		console.log(error);
	}

	return updatedOrder;
};

export const getOrders = async (c: Context<AppEnv>, filters?: OrderFilters) => {
	return OrderData.getOrders(c.var.prisma, filters);
};
