import type { Context } from 'hono';

import { OrderStatus, UserPushToken } from '../../generated/prisma/client';

import * as CardLogic from './cards';
import * as PaymentLogic from './payments';

import * as OrderData from '../data/orders';
import * as CartData from '../data/carts';
import * as CardData from '../data/cards';
import * as PushTokenData from '../data/pushTokens';
import * as StoreData from '../data/stores';

import { calculatePaystackFee, calculateHabitiFee } from './carts';
import { validateCart } from '../validations/carts';
import { createOrderSchema, updateOrderSchema } from '../validations/rest';
import type { AppEnv } from '../../types/hono';
import { InitializeTransactionResponse } from '../payments/paystack';
import { LogicError, LogicErrorCode } from './errors';
import { OrderFilters } from '../../utils/queries';
import { NotificationType } from '../notifications';

interface CreateOrderInput {
	cartId: string;
	cardId?: string | undefined;
}

export const createOrder = async (
	c: Context<AppEnv>,
	input: CreateOrderInput
) =>
	c.var.tracer.startSpan('order.create', async () => createOrderImpl(c, input));

const createOrderImpl = async (c: Context<AppEnv>, input: CreateOrderInput) => {
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
	const { order, updatedProducts } = await c.var.prisma.$transaction(
		async prisma => {
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

			const updated = await OrderData.decrementProductQuantities(prisma, {
				products: cart.products.map(p => ({
					productId: p.productId,
					quantity: p.quantity
				}))
			});

			return { order: newOrder, updatedProducts: updated };
		}
	);

	// Notify merchants about products that just crossed the low stock threshold
	const LOW_STOCK_THRESHOLD = 5;
	const cartQuantities = new Map(
		cart.products.map(p => [p.productId, p.quantity])
	);
	const lowStockProducts = updatedProducts.filter(p => {
		const orderedQty = cartQuantities.get(p.id) ?? 0;
		return (
			p.quantity < LOW_STOCK_THRESHOLD &&
			p.quantity + orderedQty >= LOW_STOCK_THRESHOLD
		);
	});

	if (lowStockProducts.length > 0) {
		const pushTokens = await PushTokenData.getStorePushTokens(
			c.var.prisma,
			storeId
		);

		if (pushTokens.length > 0) {
			for (const product of lowStockProducts) {
				c.var.services.notifications.queueNotification({
					type: NotificationType.LowStock,
					data: {
						productId: product.id,
						productName: product.name,
						quantity: product.quantity
					},
					recipientTokens: pushTokens
				});
			}
		}
	}

	// Initiate payment after the order is persisted so the orderId
	// can be passed as metadata for webhook identification.
	let cardAuthorizationData: InitializeTransactionResponse['data'] | undefined =
		undefined;

	if (cardId) {
		const card = await c.var.prisma.card.findUnique({
			where: { id: cardId }
		});

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
			c.var.logger.error(
				{ err: error, orderId: order.id },
				'order.charge_authorization_failed'
			);

			throw new LogicError(LogicErrorCode.PaymentFailed);
		}
	} else {
		cardAuthorizationData = await CardLogic.authorizeCard(c, {
			orderId: order.id
		});
	}

	c.var.services.analytics.track({
		event: 'order_created',
		distinctId: userId,
		properties: {
			orderId: order.id,
			amount: order.total,
			productCount: cart.products.length,
			productIds: cart.products.map(p => p.productId)
		},
		groups: { store: storeId }
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
) =>
	c.var.tracer.startSpan(
		'order.updateStatus',
		async () => updateOrderStatusImpl(c, input),
		{ status: input.status }
	);

const updateOrderStatusImpl = async (
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

	const { updatedOrder, priorStatus } = await c.var.prisma.$transaction(
		async tx => {
			const currentOrder = await OrderData.getOrderByIdWithProducts(
				tx,
				orderId
			);

			if (!currentOrder) {
				throw new LogicError(LogicErrorCode.OrderNotFound);
			}

			validateStatusTransition(currentOrder.status, status);

			if (status === OrderStatus.Cancelled) {
				await OrderData.restoreProductQuantities(tx, {
					products: currentOrder.products.map(p => ({
						productId: p.productId,
						quantity: p.quantity
					}))
				});
			}

			const updated = await tx.order.update({
				where: { id: orderId },
				data: { status },
				include: {
					products: { include: { product: true } },
					store: true,
					user: { include: { pushTokens: true } }
				}
			});

			return { updatedOrder: updated, priorStatus: currentOrder.status };
		}
	);

	await updateOrderHooks(c, {
		customerName: c.var.auth.name,
		pushToken: updatedOrder.user.pushTokens[0] ?? undefined,
		orderId: updatedOrder.id,
		userId: c.var.auth.id,
		customerId: updatedOrder.userId,
		storeId: updatedOrder.storeId,
		amount: updatedOrder.total,
		status,
		priorStatus
	});

	return updatedOrder;
};

const VALID_ORDER_STATUS_TRANSITIONS_MAP: Record<OrderStatus, OrderStatus[]> = {
	[OrderStatus.PaymentPending]: [OrderStatus.Pending, OrderStatus.Cancelled],
	[OrderStatus.Pending]: [OrderStatus.ReadyForPickup, OrderStatus.Cancelled],
	[OrderStatus.ReadyForPickup]: [OrderStatus.Completed, OrderStatus.Cancelled],
	[OrderStatus.Completed]: [],
	[OrderStatus.Cancelled]: []
} as const;

const validateStatusTransition = (
	currentStatus: OrderStatus,
	newStatus: OrderStatus
): void => {
	const allowedTransitions =
		VALID_ORDER_STATUS_TRANSITIONS_MAP[currentStatus] || [];

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
			customerId: currentOrder.userId,
			storeId: currentOrder.storeId,
			amount: updatedOrder.total,
			status: OrderStatus.Completed,
			priorStatus: currentOrder.status
		});
	} catch (error) {
		c.var.logger.error(
			{ err: error, orderId: updatedOrder.id },
			'confirm_pickup.hook_failed'
		);
	}

	return updatedOrder;
};

export const getOrders = async (c: Context<AppEnv>, filters?: OrderFilters) => {
	return OrderData.getOrders(c.var.prisma, filters);
};

const NotificationTypeByOrderStatus = {
	[OrderStatus.ReadyForPickup]: NotificationType.ReadyForPickup,
	[OrderStatus.Cancelled]: NotificationType.OrderCancelled,
	[OrderStatus.Completed]: NotificationType.OrderCompleted
} as const;

interface UpdateOrderHooksArgs {
	customerName: string;
	pushToken: UserPushToken | undefined;
	orderId: string;
	userId: string;
	customerId: string;
	storeId: string;
	amount: number;
	status: OrderStatus;
	priorStatus: OrderStatus;
}

export const updateOrderHooks = async (
	c: Context<AppEnv>,
	args: UpdateOrderHooksArgs
) => {
	if (args.status === OrderStatus.Completed) {
		await StoreData.updateStoreRevenue(c.var.prisma, {
			storeId: args.storeId,
			total: args.amount,
			orderId: args.orderId
		});
	} else if (args.status === OrderStatus.Cancelled) {
		// PaymentPending never credited the store, so there is nothing to
		// reverse. Any other prior status means the money was collected, and
		// which bucket it sits in decides where the refund comes from.
		if (args.priorStatus !== OrderStatus.PaymentPending) {
			await StoreData.reverseOrderRevenue(c.var.prisma, {
				storeId: args.storeId,
				customerId: args.customerId,
				total: args.amount,
				orderId: args.orderId,
				wasRealized: args.priorStatus === OrderStatus.Completed
			});
		}
	}

	c.var.services.analytics.track({
		event: 'order_status_updated',
		distinctId: args.userId,
		properties: {
			orderId: args.orderId,
			amount: args.amount,
			status: args.status
		},
		groups: { store: args.storeId }
	});

	if (
		args.pushToken &&
		(args.status === OrderStatus.Completed ||
			args.status === OrderStatus.Cancelled ||
			args.status === OrderStatus.ReadyForPickup)
	) {
		c.var.services.notifications.queueNotification({
			type: NotificationTypeByOrderStatus[args.status],
			data: {
				orderId: args.orderId,
				customerName: args.customerName
			},
			recipientTokens: [args.pushToken.token]
		});
	}
};
