import { OrderStatus, UserPushToken } from '@prisma/client';
import { NotificationType } from '../../types/notifications';
import { ResolverContext } from '../../types/resolvers';

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
			type: NotificationType.OrderCancelled,
			data: meta,
			recipientTokens: [pushToken.token]
		});
	} else if (status === OrderStatus.Completed) {
		ctx.services.notifications.queueNotification({
			type: NotificationType.OrderCompleted,
			data: meta,
			recipientTokens: [pushToken.token]
		});
	}
};
