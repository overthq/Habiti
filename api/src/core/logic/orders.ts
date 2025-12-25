import { OrderStatus } from '../../generated/prisma/client';

import * as CardLogic from './cards';

import * as OrderData from '../data/orders';
import * as CartData from '../data/carts';

import { CreateOrderInput, UpdateOrderStatusInput } from './types';
import { createOrderHooks, updateOrderHooks } from './hooks';
import { validateCart } from '../validations/carts';
import { createOrderSchema, updateOrderSchema } from '../validations/orders';
import { AppContext } from '../../utils/context';
import { InitializeTransactionResponse } from '../payments/paystack';
import { err, ok, Result } from './result';
import { LogicErrorCode } from './errors';

export const createOrder = async (
	ctx: AppContext,
	input: CreateOrderInput
): Promise<
	Result<
		{
			order: Awaited<ReturnType<typeof OrderData.saveOrderData>>;
			cardAuthorizationData?: InitializeTransactionResponse['data'];
		},
		LogicErrorCode
	>
> => {
	const { data: validatedInput, success } = createOrderSchema.safeParse(input);

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		if (!success) {
			return err(LogicErrorCode.ValidationFailed);
		}

		const { cartId, cardId, transactionFee, serviceFee } = validatedInput;

		let cart: Awaited<ReturnType<typeof CartData.getCartById>>;
		try {
			cart = await CartData.getCartById(ctx.prisma, cartId);
		} catch {
			return err(LogicErrorCode.NotFound);
		}

		try {
			await validateCart(cart, ctx.user.id);
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			if (msg.toLowerCase().includes('unauthorized')) {
				return err(LogicErrorCode.Forbidden);
			}
			if (msg.toLowerCase().includes('not found')) {
				return err(LogicErrorCode.NotFound);
			}
			return err(LogicErrorCode.InvalidInput);
		}

		let order: Awaited<ReturnType<typeof OrderData.saveOrderData>>;
		try {
			order = await OrderData.saveOrderData(ctx.prisma, ctx.user.id, {
				cardId,
				transactionFee,
				serviceFee,
				cart,
				storeId: cart.storeId
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			if (msg.toLowerCase().includes('no card found')) {
				return err(LogicErrorCode.CardNotFound);
			}
			console.error('[OrderLogic.createOrder] Unexpected error', e);
			return err(LogicErrorCode.Unexpected);
		}

		// FIXME: Incredibly hacky (inconsistent response)
		// To prevent having dealing with multiple requests for the
		// "create card with this order" flow.
		let cardAuthorizationData:
			| InitializeTransactionResponse['data']
			| undefined = undefined;

		if (!cardId) {
			try {
				cardAuthorizationData = await CardLogic.authorizeCard(ctx, {
					orderId: order.id
				});
			} catch (e) {
				console.error('[OrderLogic.createOrder] Card authorization error', e);
				return err(LogicErrorCode.Unexpected);
			}
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

		return ok({
			order,
			...(cardAuthorizationData ? { cardAuthorizationData } : {})
		});
	} catch (e) {
		console.error('[OrderLogic.createOrder] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const updateOrderStatus = async (
	ctx: AppContext,
	input: UpdateOrderStatusInput
): Promise<
	Result<Awaited<ReturnType<typeof OrderData.updateOrder>>, LogicErrorCode>
> => {
	const { data: validatedInput, success } = updateOrderSchema.safeParse(input);

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		if (!success) {
			return err(LogicErrorCode.ValidationFailed);
		}

		const { orderId, status } = validatedInput;

		const currentOrder = await ctx.prisma.order.findUnique({
			where: { id: orderId },
			include: { store: true }
		});

		if (!currentOrder) {
			return err(LogicErrorCode.OrderNotFound);
		}

		const transitionValidation = validateStatusTransition(
			currentOrder.status,
			status
		);
		if (!transitionValidation.ok) {
			return transitionValidation;
		}

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

		return ok(updatedOrder);
	} catch (e) {
		console.error('[OrderLogic.updateOrderStatus] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

const validateStatusTransition = (
	currentStatus: OrderStatus,
	newStatus: OrderStatus
): Result<void, LogicErrorCode> => {
	const validTransitions: Record<OrderStatus, OrderStatus[]> = {
		[OrderStatus.PaymentPending]: [OrderStatus.Pending, OrderStatus.Cancelled],
		[OrderStatus.Pending]: [OrderStatus.Completed, OrderStatus.Cancelled],
		[OrderStatus.Completed]: [],
		[OrderStatus.Cancelled]: []
	};

	const allowedTransitions = validTransitions[currentStatus] || [];
	if (!allowedTransitions.includes(newStatus)) {
		return err(LogicErrorCode.OrderInvalidStatusTransition);
	}

	return ok(undefined);
};

export const getOrderById = async (
	ctx: AppContext,
	orderId: string
): Promise<
	Result<Awaited<ReturnType<typeof OrderData.getOrderById>>, LogicErrorCode>
> => {
	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		const order = await OrderData.getOrderById(ctx.prisma, orderId);

		if (!order) {
			return err(LogicErrorCode.OrderNotFound);
		}

		if (order.userId !== ctx.user.id) {
			const isUserAdmin = await ctx.isAdmin();

			if (!isUserAdmin) {
				return err(LogicErrorCode.Forbidden);
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

		return ok(order);
	} catch (e) {
		console.error('[OrderLogic.getOrderById] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getOrders = async (
	ctx: AppContext,
	query: any
): Promise<
	Result<Awaited<ReturnType<typeof OrderData.getOrders>>, LogicErrorCode>
> => {
	try {
		return ok(await OrderData.getOrders(ctx.prisma, query));
	} catch (e) {
		console.error('[OrderLogic.getOrders] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};
