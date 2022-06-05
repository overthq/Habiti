import { Resolver } from '../../types/resolvers';

interface FollowStoreArgs {
	storeId: string;
}

const followStore: Resolver<FollowStoreArgs> = async (_, { storeId }, ctx) => {
	const fetchedStore = await ctx.prisma.storeFollower
		.create({
			data: {
				followerId: ctx.user.id,
				storeId
			}
		})
		.store();

	return fetchedStore;
};

interface UnfollowStoreArgs {
	storeId: string;
}

const unfollowStore: Resolver<UnfollowStoreArgs> = async (
	_,
	{ storeId },
	ctx
) => {
	const fetchedStore = await ctx.prisma.storeFollower
		.delete({
			where: {
				storeId_followerId: { storeId, followerId: ctx.user.id }
			}
		})
		.store();

	return fetchedStore;
};

export default {
	Mutation: {
		followStore,
		unfollowStore
	}
};
