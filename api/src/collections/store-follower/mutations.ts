import { Resolver } from '../../types/resolvers';
import { getPushTokensForStore } from '../../utils/notifications';

interface FollowStoreArgs {
	storeId: string;
}

const followStore: Resolver<FollowStoreArgs> = async (_, { storeId }, ctx) => {
	const follower = await ctx.prisma.storeFollower.create({
		data: { followerId: ctx.user.id, storeId },
		include: { store: true }
	});

	const pushTokens = await getPushTokensForStore(storeId);

	for (const pushToken of pushTokens) {
		if (pushToken) {
			ctx.services.notifications.queueNotification({
				type: 'NEW_FOLLOW',
				data: {
					followerName: ctx.user.name
				},
				recipientTokens: [pushToken]
			});
		}
	}

	return follower;
};

interface UnfollowStoreArgs {
	storeId: string;
}

const unfollowStore: Resolver<UnfollowStoreArgs> = async (
	_,
	{ storeId },
	ctx
) => {
	return ctx.prisma.storeFollower.delete({
		where: { storeId_followerId: { storeId, followerId: ctx.user.id } }
	});
};

export default {
	Mutation: {
		followStore,
		unfollowStore
	}
};
