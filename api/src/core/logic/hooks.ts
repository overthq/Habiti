import type { Context } from 'hono';

import {
	OrderStatus,
	Product,
	UserPushToken
} from '../../generated/prisma/client';

import { NotificationType } from '../notifications';
import type { AppEnv } from '../../types/hono';
import { updateStoreRevenue, decrementUnrealizedRevenue } from '../data/stores';

const NotificationTypeByOrderStatus = {
	[OrderStatus.ReadyForPickup]: NotificationType.ReadyForPickup,
	[OrderStatus.Cancelled]: NotificationType.OrderCancelled,
	[OrderStatus.Completed]: NotificationType.OrderCompleted
} as const;

interface CreateOrderHooksArgs {
	orderId: string;
	userId: string;
	storeId: string;
	amount: number;
	serviceFee: number;
	transactionFee: number;
	products: Product[];
	customerName: string;
	pushToken: UserPushToken | undefined;
	status: OrderStatus;
}

export const createOrderHooks = (
	c: Context<AppEnv>,
	args: CreateOrderHooksArgs
) => {
	if (args.status === OrderStatus.Completed) {
		updateStoreRevenue(c.var.prisma, {
			storeId: args.storeId,
			total: args.amount,
			orderId: args.orderId
		});
	}

	if (
		args.pushToken &&
		(args.status === OrderStatus.Completed ||
			args.status === OrderStatus.Cancelled)
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

	c.var.services.analytics.track({
		event: 'order_created',
		distinctId: args.userId,
		properties: {
			orderId: args.orderId,
			amount: args.amount,
			productCount: args.products.length,
			products: args.products
		},
		groups: { store: args.storeId }
	});
};

interface UpdateOrderHooksArgs {
	customerName: string;
	pushToken: UserPushToken | undefined;
	orderId: string;
	userId: string;
	storeId: string;
	amount: number;
	status: OrderStatus;
}

export const updateOrderHooks = async (
	c: Context<AppEnv>,
	args: UpdateOrderHooksArgs
) => {
	if (args.status === OrderStatus.Completed) {
		await updateStoreRevenue(c.var.prisma, {
			storeId: args.storeId,
			total: args.amount,
			orderId: args.orderId
		});
	} else if (args.status === OrderStatus.Cancelled) {
		await decrementUnrealizedRevenue(c.var.prisma, {
			storeId: args.storeId,
			total: args.amount
		});
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
