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
		deleteStore
	}
};
