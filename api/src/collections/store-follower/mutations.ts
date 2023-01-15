import { Resolver } from '../../types/resolvers';

interface FollowStoreArgs {
	storeId: string;
}

const followStore: Resolver<FollowStoreArgs> = async (_, { storeId }, ctx) => {
	return ctx.prisma.storeFollower.create({
		data: { followerId: ctx.user.id, storeId }
	});
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
