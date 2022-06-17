import { Resolver } from '../../types/resolvers';

interface FollowStoreArgs {
	storeId: string;
}

const followStore: Resolver<FollowStoreArgs> = async (_, { storeId }, ctx) => {
	const fetchedStoreFollower = await ctx.prisma.storeFollower.create({
		data: {
			followerId: ctx.user.id,
			storeId
		}
	});

	return fetchedStoreFollower;
};

interface UnfollowStoreArgs {
	storeId: string;
}

const unfollowStore: Resolver<UnfollowStoreArgs> = async (
	_,
	{ storeId },
	ctx
) => {
	const fetchedStoreFollower = await ctx.prisma.storeFollower.delete({
		where: {
			storeId_followerId: { storeId, followerId: ctx.user.id }
		}
	});

	return fetchedStoreFollower;
};

export default {
	Mutation: {
		followStore,
		unfollowStore
	}
};
