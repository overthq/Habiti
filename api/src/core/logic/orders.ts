import { OrderStatus } from '../../generated/prisma/client';

import * as CardLogic from './cards';

import * as OrderData from '../data/orders';
import * as CartData from '../data/carts';
import * as CardData from '../data/cards';

import { CreateOrderInput, UpdateOrderStatusInput } from './types';
import { createOrderHooks, updateOrderHooks } from './hooks';
import { validateCart } from '../validations/carts';
import { createOrderSchema, updateOrderSchema } from '../validations/orders';
import { AppContext } from '../../utils/context';
import { InitializeTransactionResponse } from '../payments/paystack';
import { chargeAuthorization } from '../payments';
import { LogicError, LogicErrorCode } from './errors';
import { OrderFilters } from '../../utils/queries';

export const createOrder = async (ctx: AppContext, input: CreateOrderInput) => {
	const { data: validatedInput, success } = createOrderSchema.safeParse(input);

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!success) {
		throw new LogicError(LogicErrorCode.ValidationFailed);
	}

	const { cartId, cardId, transactionFee, serviceFee } = validatedInput;

	const cart = await CartData.getCartById(ctx.prisma, cartId);

	if (!cart) {
		throw new LogicError(LogicErrorCode.CartNotFound);
	}

	await validateCart(cart, ctx.user.id);

	const { orderData, total } = OrderData.getOrderData(cart.products);
	const userId = ctx.user.id;
	const storeId = cart.storeId;

	const order = await ctx.prisma.$transaction(async prisma => {
		const store = await OrderData.incrementStoreOrderCount(prisma, {
			storeId,
			incrementUnrealizedRevenue: cardId ? total : undefined
		});

		const newOrder = await OrderData.createOrderWithProducts(prisma, {
			userId,
			storeId,
			serialNumber: store.orderCount,
			orderData,
			total,
			transactionFee,
			serviceFee,
			status: cardId ? OrderStatus.Pending : OrderStatus.PaymentPending
		});

		await CartData.deleteCartById(prisma, cart.id);

		await OrderData.decrementProductQuantities(prisma, {
			products: cart.products.map(p => ({
				productId: p.productId,
				quantity: p.quantity
			}))
		});

		if (cardId) {
			const card = await CardData.getCardById(prisma, cardId);

			if (!card) {
				throw new LogicError(LogicErrorCode.CardNotFound);
			}

			try {
				await chargeAuthorization({
					email: card.email,
					amount: String(total + transactionFee + serviceFee),
					authorizationCode: card.authorizationCode
				});
			} catch (error) {
				console.error(error);
				throw new LogicError(LogicErrorCode.PaymentFailed);
			}
		}

		return newOrder;
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

	return {
		order,
		...(cardAuthorizationData ? { cardAuthorizationData } : {})
	};
};

export const updateOrderStatus = async (
	ctx: AppContext,
	input: UpdateOrderStatusInput
) => {
	const { data: validatedInput, success } = updateOrderSchema.safeParse(input);

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!success) {
		throw new LogicError(LogicErrorCode.ValidationFailed);
	}

	const { orderId, status } = validatedInput;

	const currentOrder = await ctx.prisma.order.findUnique({
		where: { id: orderId },
		include: { store: true }
	});

	if (!currentOrder) {
		throw new LogicError(LogicErrorCode.OrderNotFound);
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
): void => {
	const validTransitions: Record<OrderStatus, OrderStatus[]> = {
		[OrderStatus.PaymentPending]: [OrderStatus.Pending, OrderStatus.Cancelled],
		[OrderStatus.Pending]: [OrderStatus.Completed, OrderStatus.Cancelled],
		[OrderStatus.Completed]: [],
		[OrderStatus.Cancelled]: []
	} as const;

	const allowedTransitions = validTransitions[currentStatus] || [];
	if (!allowedTransitions.includes(newStatus)) {
		throw new LogicError(LogicErrorCode.OrderInvalidStatusTransition);
	}
};

export const getOrderById = async (ctx: AppContext, orderId: string) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const order = await OrderData.getOrderById(ctx.prisma, orderId);

	if (!order) {
		throw new LogicError(LogicErrorCode.OrderNotFound);
	}

	if (order.userId !== ctx.user.id) {
		const isUserAdmin = await ctx.isAdmin();

		if (!isUserAdmin) {
			throw new LogicError(LogicErrorCode.Forbidden);
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

export const getOrders = async (ctx: AppContext, filters?: OrderFilters) => {
	return OrderData.getOrders(ctx.prisma, filters);
};
