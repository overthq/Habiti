import { OrderStatus, Prisma } from '../../generated/prisma/client';
import {
	productFiltersToPrismaClause,
	ProductFilters,
	OrderFilters,
	orderFiltersToPrismaClause
} from '../../utils/queries';
import type { PrismaClient, TransactionClient } from '../../config/prisma';
import * as Shapes from './shapes';

interface CreateStoreParams {
	userId?: string;
	name: string;
	description?: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	whatsapp?: string | null;
}

export const createStore = async (
	prisma: PrismaClient,
	params: CreateStoreParams,
	admin: boolean
) => {
	const { userId, ...rest } = params;

	const store = await prisma.store.create({
		data: {
			...rest,
			...(userId ? { managers: { create: { managerId: userId } } } : {})
		},
		select: admin ? Shapes.adminStore : Shapes.store
	});

	return store;
};

interface UpdateStoreParams {
	name?: string;
	description?: string;
	website?: string;
	twitter?: string;
	instagram?: string;
	whatsapp?: string | null;
	unlisted?: boolean;
	imageUrl?: string;
	imagePublicId?: string;
}

export const updateStore = async (
	prisma: PrismaClient,
	storeId: string,
	params: UpdateStoreParams,
	admin: boolean
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
		select: admin ? Shapes.adminStore : Shapes.store
	});

	return store;
};

export const getStores = async (prisma: PrismaClient, query: any) => {
	const stores = await prisma.store.findMany({
		...query,
		select: Shapes.adminStore
	});

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

// Nothing in the payout request writes the store row before the balance
// check, so without this lock two concurrent requests can both read the same
// balance and both be approved.
export const lockStoreBalance = async (
	tx: TransactionClient,
	storeId: string
) => {
	const rows = await tx.$queryRaw<
		{ realizedRevenue: bigint; paidOut: bigint; pendingPayouts: bigint }[]
	>`
		SELECT "realizedRevenue", "paidOut", "pendingPayouts"
		FROM "Store"
		WHERE "id" = ${storeId}
		FOR UPDATE
	`;

	return rows[0] ?? null;
};

export const getStoreByIdWithProducts = async (
	prisma: PrismaClient,
	storeId: string,
	admin: boolean,
	filters?: ProductFilters
) => {
	const store = await prisma.store.findUnique({
		where: { id: storeId },
		select: {
			...(admin ? Shapes.adminStore : Shapes.store),
			products: {
				select: admin ? Shapes.adminProduct : Shapes.product,
				...productFiltersToPrismaClause(filters)
			},
			categories: { select: Shapes.category },
			_count: { select: { followers: true } }
		}
	});

	return store;
};

export const getStoreProducts = async (
	prisma: PrismaClient,
	storeId: string,
	admin: boolean,
	filters?: ProductFilters
) => {
	const products = await prisma.store
		.findUnique({ where: { id: storeId } })
		.products({
			select: admin ? Shapes.adminProduct : Shapes.product,
			...productFiltersToPrismaClause(filters)
		});

	return products;
};

export const getStoreManagers = async (
	prisma: PrismaClient,
	storeId: string,
	query: any,
	admin: boolean
) => {
	const storeManagers = await prisma.storeManager.findMany({
		where: { storeId, ...query },
		select: {
			...Shapes.storeManager,
			manager: { select: admin ? Shapes.adminUser : Shapes.publicUser }
		}
	});

	return storeManagers;
};

export const getStoresByManagerId = async (
	prisma: PrismaClient,
	userId: string
) => {
	const storeManagers = await prisma.storeManager.findMany({
		where: { managerId: userId },
		select: { ...Shapes.storeManager, store: { select: Shapes.adminStore } }
	});

	return storeManagers;
};

interface GetStoreOrdersOptions {
	excludePaymentPending?: boolean;
}

export const getStoreOrders = async (
	prisma: PrismaClient,
	storeId: string,
	admin: boolean,
	filters?: OrderFilters,
	options?: GetStoreOrdersOptions
) => {
	const { where, orderBy } = orderFiltersToPrismaClause(filters);

	const storeOrders = await prisma.order.findMany({
		where: {
			storeId,
			...(options?.excludePaymentPending && {
				status: { not: OrderStatus.PaymentPending }
			}),
			...where
		},
		orderBy: orderBy ?? { createdAt: 'desc' },
		select: {
			...Shapes.order,
			user: { select: admin ? Shapes.adminUser : Shapes.publicUser }
		}
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
		select: Shapes.store
	});

	return stores;
};

export const getFollowedStores = async (
	prisma: PrismaClient,
	userId: string
) => {
	const followedStores = await prisma.storeFollower.findMany({
		where: { followerId: userId },
		select: { store: { select: Shapes.store } }
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
		where: { userId_storeId: { storeId, userId } },
		select: { ...Shapes.cart, products: { select: Shapes.cartProduct } }
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
		select: Shapes.store,
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
			...Shapes.publicUser,
			orders: {
				where: { storeId },
				select: {
					...Shapes.order,
					products: {
						select: {
							...Shapes.orderProduct,
							product: { select: Shapes.product }
						}
					}
				},
				orderBy: { createdAt: 'desc' }
			}
		}
	});

	return user;
};
