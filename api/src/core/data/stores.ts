import {
	OrderStatus,
	Prisma,
	PrismaClient
} from '../../generated/prisma/client';
import {
	productFiltersToPrismaClause,
	ProductFilters
} from '../../utils/queries';

interface CreateStoreParams {
	userId: string;
	name: string;
	description?: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	bankAccountNumber?: string;
	bankCode?: string;
	bankAccountReference?: string;
}

export const createStore = async (
	prisma: PrismaClient,
	params: CreateStoreParams
) => {
	const { userId, ...rest } = params;

	const store = await prisma.store.create({
		data: {
			...rest,
			managers: { create: { managerId: userId } }
		},
		include: { managers: true }
	});

	return store;
};

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
	imageUrl?: string;
	imagePublicId?: string;
}

export const updateStore = async (
	prisma: PrismaClient,
	storeId: string,
	params: UpdateStoreParams
) => {
	const { imageUrl, imagePublicId, ...rest } = params;

	let data: Prisma.StoreUpdateInput = { ...rest };

	if (imageUrl && imagePublicId) {
		data.image = {
			upsert: {
				create: { path: imageUrl, publicId: imagePublicId },
				update: { path: imageUrl, publicId: imagePublicId }
			}
		};
	}

	const store = await prisma.store.update({
		where: { id: storeId },
		data,
		include: { image: true }
	});

	return store;
};

export const getStores = async (prisma: PrismaClient, query: any) => {
	const stores = await prisma.store.findMany({ ...query });

	return stores;
};

export const getStoreById = async (prisma: PrismaClient, storeId: string) => {
	const store = await prisma.store.findUnique({
		where: { id: storeId },
		include: { image: true }
	});

	return store;
};

export const getStoreByIdWithFollowers = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const store = await prisma.store.findUnique({
		where: { id: storeId },
		include: { followers: true }
	});

	return store;
};

export const getStoreByIdWithManagers = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const store = await prisma.store.findUnique({
		where: { id: storeId },
		include: { managers: true }
	});

	return store;
};

export const getStoreByIdWithProducts = async (
	prisma: PrismaClient,
	storeId: string,
	filters?: ProductFilters
) => {
	const store = await prisma.store.findUnique({
		where: { id: storeId },
		include: {
			image: true,
			products: {
				include: { images: true },
				...productFiltersToPrismaClause(filters)
			},
			categories: true
		}
	});

	return store;
};

export const getStoreFollowers = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const storeFollowers = await prisma.store
		.findUnique({ where: { id: storeId } })
		.followers();

	return storeFollowers;
};

export const getStoreProducts = async (
	prisma: PrismaClient,
	storeId: string,
	filters?: ProductFilters
) => {
	const products = await prisma.store
		.findUnique({ where: { id: storeId } })
		.products({
			include: { images: true },
			...productFiltersToPrismaClause(filters)
		});

	return products;
};

export const getStoreManagers = async (
	prisma: PrismaClient,
	storeId: string,
	query: any
) => {
	const storeManagers = await prisma.storeManager.findMany({
		where: { storeId, ...query },
		include: { manager: true }
	});

	return storeManagers;
};

export const getStoreOrders = async (
	prisma: PrismaClient,
	storeId: string,
	query: any
) => {
	const storeOrders = await prisma.order.findMany({
		where: { storeId, ...query },
		include: { user: true }
	});

	return storeOrders;
};

export const deleteStore = async (prisma: PrismaClient, storeId: string) => {
	return prisma.store.delete({
		where: { id: storeId }
	});
};

interface CreateStoreManagerParams {
	storeId: string;
	userId: string;
}

export const createStoreManager = async (
	prisma: PrismaClient,
	params: CreateStoreManagerParams
) => {
	const manager = await prisma.storeManager.create({
		data: {
			...params,
			managerId: params.userId
		}
	});

	return manager;
};

export const removeStoreManager = async (
	prisma: PrismaClient,
	storeId: string,
	userId: string
) => {
	await prisma.storeManager.delete({
		where: {
			storeId_managerId: {
				managerId: userId,
				storeId
			}
		}
	});
};

interface FollowStoreParams {
	storeId: string;
	userId: string;
}

export const followStore = async (
	prisma: PrismaClient,
	params: FollowStoreParams
) => {
	const follower = await prisma.storeFollower.create({
		data: {
			followerId: params.userId,
			storeId: params.storeId
		}
	});

	return follower;
};

interface UnfollowStoreArgs {
	storeId: string;
	userId: string;
}

export const unfollowStore = async (
	prisma: PrismaClient,
	params: UnfollowStoreArgs
) => {
	const follower = await prisma.storeFollower.delete({
		where: {
			storeId_followerId: {
				followerId: params.userId,
				storeId: params.storeId
			}
		}
	});

	return follower;
};

export const getStoresByUserId = async (
	prisma: PrismaClient,
	userId: string
) => {
	const stores = await prisma.store.findMany({
		where: { managers: { some: { managerId: userId } } },
		include: { image: true }
	});

	return stores;
};

export const getFollowedStores = async (
	prisma: PrismaClient,
	userId: string
) => {
	const followedStores = await prisma.storeFollower.findMany({
		where: { followerId: userId },
		include: {
			store: { include: { image: true } }
		}
	});

	return followedStores.map(f => f.store);
};

export const getStoreViewerContext = async (
	prisma: PrismaClient,
	userId: string,
	storeId: string
) => {
	const storeFollower = await prisma.storeFollower.findUnique({
		where: { storeId_followerId: { storeId, followerId: userId } }
	});

	const cart = await prisma.cart.findUnique({
		where: { userId_storeId: { storeId, userId } }
	});

	return {
		isFollowing: !!storeFollower,
		cart
	};
};

export interface GetTrendingStoresOptions {
	take?: number;
}

export const getTrendingStores = async (
	prisma: PrismaClient,
	options: GetTrendingStoresOptions = {}
) => {
	const take = options.take ?? 6;

	const stores = await prisma.store.findMany({
		where: { unlisted: false },
		include: { image: true },
		orderBy: [{ orderCount: 'desc' }, { createdAt: 'desc' }],
		take
	});

	return stores;
};

export const getStoreCustomer = async (
	prisma: PrismaClient,
	storeId: string,
	userId: string
) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			orders: {
				where: { storeId },
				include: {
					products: {
						include: {
							product: {
								include: { images: true }
							}
						}
					}
				},
				orderBy: { createdAt: 'desc' }
			}
		}
	});

	return user;
};

interface UpdateStoreRevenueArgs {
	storeId: string;
	total: number;
}

export const updateStoreRevenue = async (
	prisma: PrismaClient,
	args: UpdateStoreRevenueArgs
) => {
	await prisma.store.update({
		where: { id: args.storeId },
		data: {
			realizedRevenue: { increment: args.total },
			unrealizedRevenue: { decrement: args.total }
		}
	});
};
