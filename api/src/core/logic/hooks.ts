import {
	OrderStatus,
	Product,
	UserPushToken
} from '../../generated/prisma/client';

import { NotificationType } from '../notifications';
import { AppContext } from '../../utils/context';
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
	ctx: AppContext,
	args: CreateOrderHooksArgs
) => {
	if (args.status === OrderStatus.Completed) {
		updateStoreRevenue(ctx.prisma, {
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
		ctx.services.notifications.queueNotification({
			type: NotificationTypeByOrderStatus[args.status],
			data: {
				orderId: args.orderId,
				customerName: args.customerName
			},
			recipientTokens: [args.pushToken.token]
		});
	}

	ctx.services.analytics.track({
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
	ctx: AppContext,
	args: UpdateOrderHooksArgs
) => {
	if (args.status === OrderStatus.Completed) {
		await updateStoreRevenue(ctx.prisma, {
			storeId: args.storeId,
			total: args.amount,
			orderId: args.orderId
		});
	} else if (args.status === OrderStatus.Cancelled) {
		await decrementUnrealizedRevenue(ctx.prisma, {
			storeId: args.storeId,
			total: args.amount
		});
	}

	ctx.services.analytics.track({
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
		ctx.services.notifications.queueNotification({
			type: NotificationTypeByOrderStatus[args.status],
			data: {
				orderId: args.orderId,
				customerName: args.customerName
			},
			recipientTokens: [args.pushToken.token]
		});
	}
};
