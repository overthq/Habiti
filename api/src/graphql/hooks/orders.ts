import { OrderStatus, UserPushToken } from '@prisma/client';
import { ResolverContext } from '../../types/resolvers';
import { getStorePushTokens } from '../../utils/notifications';

interface UpdateStoreRevenueArgs {
	storeId: string;
	status: OrderStatus;
	total: number;
}

export const updateStoreRevenue = async (
	ctx: ResolverContext,
	args: UpdateStoreRevenueArgs
) => {
	if (args.status === OrderStatus.Completed) {
		await ctx.prisma.store.update({
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
	ctx: ResolverContext,
	args: SendStatusNotificationArgs
) => {
	const { pushToken, status, ...meta } = args;

	if (status === OrderStatus.Cancelled) {
		ctx.services.notifications.queueNotification({
			type: 'ORDER_CANCELLED',
			data: meta,
			recipientTokens: [pushToken.token]
		});
	} else if (status === OrderStatus.Completed) {
		ctx.services.notifications.queueNotification({
			type: 'ORDER_COMPLETED',
			data: meta,
			recipientTokens: [pushToken.token]
		});
	}
};

interface SendNewOrderNotificationArgs {
	storeId: string;
	orderId: string;
	customerName: string;
	amount: number;
}

export const sendNewOrderNotification = async (
	ctx: ResolverContext,
	args: SendNewOrderNotificationArgs
) => {
	const { storeId, ...data } = args;
	const pushTokens = await getStorePushTokens(storeId);

	ctx.services.notifications.queueNotification({
		type: 'NEW_ORDER',
		data,
		recipientTokens: pushTokens
	});
};
