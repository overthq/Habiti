import {
	OrderStatus,
	PrismaClient,
	Product,
	UserPushToken
} from '@prisma/client';
import { NotificationType } from '../notifications/types';
import AnalyticsService from '../../services/analytics';
import NotificationsService from '../../services/notifications';
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
	if (args.status === OrderStatus.Completed) {
		await prisma.store.update({
			where: { id: args.storeId },
			data: {
				realizedRevenue: { increment: args.total },
				unrealizedRevenue: { decrement: args.total }
			}
		});
	}
};

interface SendStatusNotificationArgs {
	orderId: string;
	status: OrderStatus;
	customerName: string;
	pushToken: UserPushToken;
}

export const sendStatusNotification = async (
	notificationsService: NotificationsService,
	args: SendStatusNotificationArgs
) => {
	const { pushToken, status, ...meta } = args;

	if (status === OrderStatus.Cancelled) {
		notificationsService.queueNotification({
			type: NotificationType.OrderCancelled,
			data: meta,
			recipientTokens: [pushToken.token]
		});
	} else if (status === OrderStatus.Completed) {
		notificationsService.queueNotification({
			type: NotificationType.OrderCompleted,
			data: meta,
			recipientTokens: [pushToken.token]
		});
	}
};

interface TrackOrderCreatedArgs {
	orderId: string;
	userId: string;
	storeId: string;
	amount: number;
	serviceFee: number;
	transactionFee: number;
	paymentMethod: string;
	productCount: number;
	products: Product[];
}

export const trackOrderCreated = (
	analyticsService: AnalyticsService,
	args: TrackOrderCreatedArgs
) => {
	analyticsService.track({
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

interface TrackOrderStatusUpdatedArgs {
	orderId: string;
	userId: string;
	storeId: string;
	amount: number;
	status: OrderStatus;
}

export const trackOrderStatusUpdated = (
	analyticsService: AnalyticsService,
	args: TrackOrderStatusUpdatedArgs
) => {
	analyticsService.track({
		event: 'order_status_updated',
		distinctId: args.userId,
		properties: {
			orderId: args.orderId,
			amount: args.amount,
			status: args.status
		},
		groups: { store: args.storeId }
	});
};

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
	updateStoreRevenue(prisma, {
		storeId: args.storeId,
		status: args.status,
		total: args.amount
	});

	if (args.pushToken) {
		sendStatusNotification(services.notifications, {
			orderId: args.orderId,
			status: args.status,
			customerName: args.customerName,
			pushToken: args.pushToken
		});
	}

	trackOrderCreated(services.analytics, {
		orderId: args.orderId,
		userId: args.userId,
		storeId: args.storeId,
		amount: args.amount,
		serviceFee: args.serviceFee,
		transactionFee: args.transactionFee,
		paymentMethod: args.paymentMethod,
		productCount: args.productCount,
		products: args.products
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
	updateStoreRevenue(prisma, {
		storeId: args.storeId,
		status: args.status,
		total: args.amount
	});

	trackOrderStatusUpdated(services.analytics, {
		orderId: args.orderId,
		userId: args.userId,
		storeId: args.storeId,
		amount: args.amount,
		status: args.status
	});

	if (args.pushToken) {
		sendStatusNotification(services.notifications, {
			orderId: args.orderId,
			status: args.status,
			customerName: args.customerName,
			pushToken: args.pushToken
		});
	}
};
