import { Resolver } from '../../types/resolvers';

interface CreateStoreArgs {
	input: {
		name: string;
	};
}

const createStore: Resolver<CreateStoreArgs> = async (_, { input }, ctx) => {
	const store = await ctx.prisma.store.create({
		data: {
			name: input.name,
			managers: {
				create: {
					managerId: ctx.user.id
				}
			}
		}
	});

	return store;
};

interface FollowStoreArgs {
	storeId: string;
}

const followStore: Resolver<FollowStoreArgs> = async (_, { storeId }, ctx) => {
	const follower = await ctx.prisma.storeFollower.create({
		data: {
			followerId: ctx.user.id,
			storeId
		}
	});

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
	await ctx.prisma.storeFollower.delete({
		where: {
			storeId_followerId: { storeId, followerId: ctx.user.id }
		}
	});
};

interface DeleteStoreArgs {
	id: string;
}

const deleteStore: Resolver<DeleteStoreArgs> = async (_, { id }, ctx) => {
	await ctx.prisma.store.delete({ where: { id } });

	return id;
};

export default {
	Mutation: {
		createStore,
		followStore,
		unfollowStore,
		deleteStore
	}
};
