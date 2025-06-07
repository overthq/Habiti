import { AnalyticsEvent } from '../../../services/analytics';
import { NotificationType } from '../../../types/notifications';
import { ResolverContext } from '../../../types/resolvers';
import {
	getStorePushTokens,
	getUserPushTokens
} from '../../../utils/notifications';
import {
	OrderNotification,
	OrderRevenueUpdate,
	OrderSideEffects
} from './types';

export async function executeOrderSideEffects(
	ctx: ResolverContext,
	sideEffects: OrderSideEffects
): Promise<void> {
	const promises: Promise<void>[] = [];

	if (sideEffects.notifications?.length) {
		promises.push(executeOrderNotifications(ctx, sideEffects.notifications));
	}

	if (sideEffects.revenueUpdate) {
		promises.push(updateStoreRevenue(ctx, sideEffects.revenueUpdate));
	}

	if (sideEffects.analyticsEvents?.length) {
		for (const event of sideEffects.analyticsEvents) {
			trackOrderEvent(ctx, event);
		}
	}

	// TODO: Implement error handling and retry logic for failed promises.
	await Promise.allSettled(promises);
}

const executeOrderNotifications = async (
	ctx: ResolverContext,
	notifications: OrderNotification[]
): Promise<void> => {
	for (const notification of notifications) {
		try {
			if (notification.type === NotificationType.NewOrder) {
				const pushTokens = await getStorePushTokens(notification.data.storeId);
				await sendOrderNotification(ctx, notification, pushTokens);
			} else {
				const pushTokens = await getUserPushTokens(ctx.user.id);
				await sendOrderNotification(ctx, notification, pushTokens);
			}
		} catch (error) {
			console.error('Failed to send order notification:', error);
		}
	}
};

const ORDER_NOTIFICATION_TYPES = [
	'NEW_ORDER',
	'ORDER_STATUS_CHANGED',
	'ORDER_COMPLETED',
	'ORDER_CANCELLED'
] as const;

async function sendOrderNotification(
	ctx: ResolverContext,
	notification: OrderNotification,
	recipientTokens: string[]
): Promise<void> {
	const { type, data } = notification;

	if (type === NotificationType.NewOrder) {
		ctx.services.notifications.queueNotification({
			type: NotificationType.NewOrder,
			data: {
				orderId: data.orderId,
				customerName: data.customerName,
				amount: data.amount!
			},
			recipientTokens
		});
	} else {
		ctx.services.notifications.queueNotification({
			type: NotificationType.OrderStatusChanged,
			data: {
				orderId: data.orderId,
				customerName: data.customerName,
				status: data.status
			},
			recipientTokens
		});
	}
}

const updateStoreRevenue = async (
	ctx: ResolverContext,
	update: OrderRevenueUpdate
) => {
	await ctx.prisma.store.update({
		where: { id: update.storeId },
		data: {
			realizedRevenue: { increment: update.realized },
			unrealizedRevenue: { increment: update.unrealized }
		}
	});
};

const trackOrderEvent = (ctx: ResolverContext, event: AnalyticsEvent) => {
	if (event.event === 'order_created' && event.properties?.orderId) {
		ctx.services.analytics.trackOrderEvent('order_created', {
			orderId: event.properties.orderId,
			userId: ctx.user?.id || 'anonymous',
			storeId: event.properties.storeId,
			amount: event.properties.amount,
			paymentMethod: event.properties.paymentMethod,
			productCount: event.properties.productCount,
			products: event.properties.products
		});
	} else if (
		event.event === 'order_status_updated' &&
		event.properties?.orderId
	) {
		ctx.services.analytics.trackOrderEvent('order_status_updated', {
			orderId: event.properties.orderId,
			userId: ctx.user?.id || 'anonymous',
			storeId: event.properties.storeId,
			amount: event.properties.amount,
			status: event.properties.newStatus
		});
	}
};
