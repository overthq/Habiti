import { Order, OrderStatus, User } from '@prisma/client';
import { ResolverContext } from '../../../types/resolvers';
import { UpdateOrderStatusInput, OrderUpdateResult } from './types';
import { NotificationType } from '../../../types/notifications';

// Validation functions
export async function validateUpdateOrderInput(
	input: UpdateOrderStatusInput
): Promise<void> {
	if (!input.orderId) {
		throw new Error('Order ID is required');
	}

	if (!Object.values(OrderStatus).includes(input.status)) {
		throw new Error('Invalid order status');
	}
}

export async function validateStatusTransition(
	currentStatus: OrderStatus,
	newStatus: OrderStatus
): Promise<void> {
	const validTransitions: Record<OrderStatus, OrderStatus[]> = {
		[OrderStatus.PaymentPending]: [OrderStatus.Pending, OrderStatus.Cancelled],
		[OrderStatus.Pending]: [
			OrderStatus.Processing,
			OrderStatus.Completed,
			OrderStatus.Cancelled
		],
		[OrderStatus.Processing]: [OrderStatus.Cancelled],
		[OrderStatus.Delivered]: [OrderStatus.Completed],
		[OrderStatus.Completed]: [], // Terminal state
		[OrderStatus.Cancelled]: [] // Terminal state
	};

	const allowedTransitions = validTransitions[currentStatus] || [];
	if (!allowedTransitions.includes(newStatus)) {
		throw new Error(
			`Invalid status transition from ${currentStatus} to ${newStatus}`
		);
	}
}

const statusToNotificationType = {
	[OrderStatus.Completed]: NotificationType.OrderCompleted,
	[OrderStatus.Cancelled]: NotificationType.OrderCancelled,
	[OrderStatus.PaymentPending]: NotificationType.OrderStatusChanged,
	[OrderStatus.Pending]: NotificationType.OrderStatusChanged,
	[OrderStatus.Processing]: NotificationType.OrderStatusChanged,
	[OrderStatus.Delivered]: NotificationType.OrderStatusChanged
} as const;

export function prepareSideEffectsForStatusUpdate(
	order: Order & { user: User },
	status: OrderStatus
): OrderUpdateResult['sideEffects'] {
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
			customerName: order.user.name
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
}

export async function updateOrderStatus(
	input: UpdateOrderStatusInput,
	ctx: ResolverContext
): Promise<OrderUpdateResult> {
	const { orderId, status } = input;

	await validateUpdateOrderInput(input);

	const currentOrder = await ctx.prisma.order.findUnique({
		where: { id: orderId },
		include: { user: true, store: true }
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
			user: true,
			store: true
		}
	});

	const sideEffects = prepareSideEffectsForStatusUpdate(updatedOrder, status);

	return { order: updatedOrder, sideEffects };
}
