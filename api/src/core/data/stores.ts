import { ResolverContext } from '../../types/resolvers';

interface CreateStoreParams {
	name: string;
	description?: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	bankAccountNumber?: string;
	bankCode?: string;
	bankAccountReference?: string;
}

interface UpdateStoreParams {
	name?: string;
	description?: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	bankAccountNumber?: string;
	bankCode?: string;
	bankAccountReference?: string;
	unlisted?: boolean;
}

interface CreateStoreManagerParams {
	storeId: string;
	userId: string;
}

interface CreateStoreFollowerParams {
	storeId: string;
	userId: string;
}

export const createStore = async (
	ctx: ResolverContext,
	params: CreateStoreParams
) => {
	const store = await ctx.prisma.store.create({
		data: params
	});

	return store;
};

export const updateStore = async (
	ctx: ResolverContext,
	storeId: string,
	params: UpdateStoreParams
) => {
	const store = await ctx.prisma.store.update({
		where: { id: storeId },
		data: params
	});

	return store;
};

export const getStoreById = async (ctx: ResolverContext, storeId: string) => {
	const store = await ctx.prisma.store.findUnique({
		where: { id: storeId },
		include: {
			image: true,
			products: {
				include: { images: true }
			},
			managers: {
				include: { manager: true }
			},
			followers: {
				include: { follower: true }
			}
		}
	});

	return store;
};

export const deleteStore = async (ctx: ResolverContext, storeId: string) => {
	await ctx.prisma.store.delete({
		where: { id: storeId }
	});
};

export const updateStoreRevenue = async (
	ctx: ResolverContext,
	storeId: string,
	amount: number,
	type: 'unrealized' | 'realized' | 'paidOut'
) => {
	const updateData = {};

	if (type === 'unrealized') {
		updateData['unrealizedRevenue'] = { increment: amount };
	} else if (type === 'realized') {
		updateData['realizedRevenue'] = { increment: amount };
	} else if (type === 'paidOut') {
		updateData['paidOut'] = { increment: amount };
	}

	const store = await ctx.prisma.store.update({
		where: { id: storeId },
		data: updateData
	});

	return store;
};

export const incrementOrderCount = async (
	ctx: ResolverContext,
	storeId: string
) => {
	const store = await ctx.prisma.store.update({
		where: { id: storeId },
		data: { orderCount: { increment: 1 } }
	});

	return store;
};

export const createStoreManager = async (
	ctx: ResolverContext,
	params: CreateStoreManagerParams
) => {
	const manager = await ctx.prisma.storeManager.create({
		data: {
			...params,
			managerId: params.userId
		}
	});

	return manager;
};

export const removeStoreManager = async (
	ctx: ResolverContext,
	storeId: string,
	userId: string
) => {
	await ctx.prisma.storeManager.delete({
		where: {
			storeId_managerId: {
				managerId: userId,
				storeId
			}
		}
	});
};

export const followStore = async (
	ctx: ResolverContext,
	params: CreateStoreFollowerParams
) => {
	const follower = await ctx.prisma.storeFollower.create({
		data: {
			...params,
			followerId: params.userId
		}
	});

	return follower;
};

export const unfollowStore = async (
	ctx: ResolverContext,
	storeId: string,
	userId: string
) => {
	await ctx.prisma.storeFollower.delete({
		where: {
			storeId_followerId: {
				followerId: userId,
				storeId
			}
		}
	});
};

export const getStoresByUserId = async (
	ctx: ResolverContext,
	userId: string
) => {
	const stores = await ctx.prisma.store.findMany({
		where: { managers: { some: { managerId: userId } } },
		include: { image: true }
	});

	return stores;
};

export const getFollowedStores = async (
	ctx: ResolverContext,
	userId: string
) => {
	const followedStores = await ctx.prisma.storeFollower.findMany({
		where: { followerId: userId },
		include: {
			store: { include: { image: true } }
		}
	});

	return followedStores.map(f => f.store);
};
