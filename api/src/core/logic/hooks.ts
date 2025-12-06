import {
	OrderStatus,
	PrismaClient,
	Product,
	UserPushToken
} from '../../generated/prisma/client';

import { NotificationType } from '../notifications';
import Services from '../../services';

interface UpdateStoreRevenueArgs {
	storeId: string;
	status: OrderStatus;
	total: number;
}

export const updateStoreRevenue = async (
	prisma: PrismaClient,
	args: UpdateStoreRevenueArgs
) => {
	await prisma.store.update({
		where: { id: args.storeId },
		data: {
			realizedRevenue: { increment: args.total },
			unrealizedRevenue: { decrement: args.total }
		}
	});
};

const NotificationTypeByOrderStatus = {
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
	paymentMethod: string;
	productCount: number;
	products: Product[];
	customerName: string;
	pushToken: UserPushToken | undefined;
	status: OrderStatus;
}

export const createOrderHooks = (
	prisma: PrismaClient,
	services: Services,
	args: CreateOrderHooksArgs
) => {
	if (args.status === OrderStatus.Completed) {
		updateStoreRevenue(prisma, {
			storeId: args.storeId,
			status: args.status,
			total: args.amount
		});
	}

	if (args.pushToken) {
		if (
			args.status === OrderStatus.Completed ||
			args.status === OrderStatus.Cancelled
		) {
			services.notifications.queueNotification({
				type: NotificationTypeByOrderStatus[args.status],
				data: {
					orderId: args.orderId,
					customerName: args.customerName
				},
				recipientTokens: [args.pushToken.token]
			});
		}
	}

	services.analytics.track({
		event: 'order_created',
		distinctId: args.userId,
		properties: {
			orderId: args.orderId,
			amount: args.amount,
			paymentMethod: args.paymentMethod,
			productCount: args.productCount,
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

export const updateOrderHooks = (
	prisma: PrismaClient,
	services: Services,
	args: UpdateOrderHooksArgs
) => {
	if (args.status === OrderStatus.Completed) {
		updateStoreRevenue(prisma, {
			storeId: args.storeId,
			status: args.status,
			total: args.amount
		});
	}

	services.analytics.track({
		event: 'order_status_updated',
		distinctId: args.userId,
		properties: {
			orderId: args.orderId,
			amount: args.amount,
			status: args.status
		},
		groups: { store: args.storeId }
	});

	if (args.pushToken) {
		if (
			args.status === OrderStatus.Completed ||
			args.status === OrderStatus.Cancelled
		) {
			services.notifications.queueNotification({
				type: NotificationTypeByOrderStatus[args.status],
				data: {
					orderId: args.orderId,
					customerName: args.customerName
				},
				recipientTokens: [args.pushToken.token]
			});
		}
	}
};
