import { Order, OrderStatus } from '@prisma/client';
import { ResolverContext } from '../../../types/resolvers';
import { UpdateOrderStatusInput, OrderUpdateResult } from './types';
import { NotificationType } from '../../../types/notifications';

export const updateOrderStatus = async (
	input: UpdateOrderStatusInput,
	ctx: ResolverContext
): Promise<OrderUpdateResult> => {
	const { orderId, status } = input;

	await validateUpdateOrderInput(input);

	const currentOrder = await ctx.prisma.order.findUnique({
		where: { id: orderId },
		include: { store: true }
	});

	if (!currentOrder) {
		throw new Error(`Order not found: ${orderId}`);
	}

	await validateStatusTransition(currentOrder.status, status);

	const updatedOrder = await ctx.prisma.order.update({
		where: { id: orderId },
		data: { status },
		include: {
			products: { include: { product: true } },
			store: true
		}
	});

	const sideEffects = prepareSideEffectsForStatusUpdate(
		updatedOrder,
		status,
		ctx
	);

	return { order: updatedOrder, sideEffects };
};

// Validation functions
export const validateUpdateOrderInput = async (
	input: UpdateOrderStatusInput
): Promise<void> => {
	if (!input.orderId) {
		throw new Error('Order ID is required');
	}

	if (!Object.values(OrderStatus).includes(input.status)) {
		throw new Error('Invalid order status');
	}
};

export const validateStatusTransition = async (
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

const statusToNotificationType = {
	[OrderStatus.Completed]: NotificationType.OrderCompleted,
	[OrderStatus.Cancelled]: NotificationType.OrderCancelled,
	[OrderStatus.PaymentPending]: NotificationType.OrderStatusChanged,
	[OrderStatus.Pending]: NotificationType.OrderStatusChanged
} as const;

export const prepareSideEffectsForStatusUpdate = (
	order: Order,
	status: OrderStatus,
	ctx: ResolverContext
): OrderUpdateResult['sideEffects'] => {
	const sideEffects: OrderUpdateResult['sideEffects'] = {
		notifications: [],
		revenueUpdate: undefined,
		analyticsEvents: []
	};

	sideEffects.notifications.push({
		type: statusToNotificationType[status],
		data: {
			orderId: order.id,
			storeId: order.storeId,
			amount: order.total,
			status,
			customerName: ctx.user.name
		}
	});

	if (status === OrderStatus.Completed) {
		sideEffects.revenueUpdate = {
			storeId: order.storeId,
			realized: order.total,
			unrealized: -order.total
		};
	}

	sideEffects.analyticsEvents.push({
		event: 'order_status_updated',
		properties: {
			orderId: order.id,
			storeId: order.storeId,
			oldStatus: order.status,
			newStatus: status,
			amount: order.total
		}
	});

	return sideEffects;
};
