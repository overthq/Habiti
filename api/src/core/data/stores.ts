import {
	OrderStatus,
	Prisma,
	PrismaClient
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';
import {
	productFiltersToPrismaClause,
	ProductFilters,
	OrderFilters,
	orderFiltersToPrismaClause
} from '../../utils/queries';
import { runSerializable } from '../../utils/prisma';
import {
	recordOrderCompleted,
	recordOrderPaid,
	recordRefund
} from './postings';

interface CreateStoreParams {
	userId?: string;
	name: string;
	description?: string;
	website?: string;
	twitter?: string;
	instagram?: string;
}

export const createStore = async (
	prisma: PrismaClient,
	params: CreateStoreParams
) => {
	const { userId, ...rest } = params;

	const store = await prisma.store.create({
		data: {
			...rest,
			...(userId ? { managers: { create: { managerId: userId } } } : {})
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

/**
 * Reads the revenue columns and holds a row lock on the store for the rest of
 * the surrounding transaction.
 *
 * The payout path never writes the store row (`paidOut` only moves later, when
 * Paystack confirms the transfer), so concurrent payout requests have no write
 * conflict to collide on and `findUnique` takes no lock of its own. Without
 * this, two requests can both read the same balance and both be approved.
 */
export const lockStoreBalance = async (
	tx: TransactionClient,
	storeId: string
) => {
	const rows = await tx.$queryRaw<
		{ realizedRevenue: number; paidOut: number }[]
	>`
		SELECT "realizedRevenue", "paidOut"
		FROM "Store"
		WHERE "id" = ${storeId}
		FOR UPDATE
	`;

	return rows[0] ?? null;
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
			categories: true,
			_count: { select: { followers: true } }
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

export const getStoresByManagerId = async (
	prisma: PrismaClient,
	userId: string
) => {
	const storeManagers = await prisma.storeManager.findMany({
		where: { managerId: userId },
		include: { store: { include: { image: true } } }
	});

	return storeManagers;
};

interface GetStoreOrdersOptions {
	excludePaymentPending?: boolean;
}

export const getStoreOrders = async (
	prisma: PrismaClient,
	storeId: string,
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
		where: { userId_storeId: { storeId, userId } },
		include: { products: true }
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
	orderId: string;
}

/**
 * Order completed: the store's money becomes withdrawable.
 *
 * This used to increment `realizedRevenue` and decrement `unrealizedRevenue`
 * directly, alongside a separate ledger row whose direction was decided by an
 * enum lookup in another file. Both records now come out of the same journal.
 */
export const updateStoreRevenue = async (
	prisma: PrismaClient,
	args: UpdateStoreRevenueArgs
) => {
	await runSerializable(prisma, async tx => {
		await recordOrderCompleted(tx, {
			storeId: args.storeId,
			orderId: args.orderId,
			total: BigInt(args.total)
		});
	});
};

interface RecordOrderPaymentArgs {
	storeId: string;
	orderId: string;
	total: number;
	serviceFee: number;
	webhookEventId?: string | null;
}

/**
 * Payment cleared. Replaces `incrementUnrealizedRevenue`, which moved a store
 * column without writing any ledger row at all -- the gap that made the two
 * records impossible to reconcile.
 */
export const recordOrderPayment = async (
	prisma: PrismaClient,
	args: RecordOrderPaymentArgs
) => {
	await runSerializable(prisma, async tx => {
		await recordOrderPaid(tx, {
			storeId: args.storeId,
			orderId: args.orderId,
			total: BigInt(args.total),
			serviceFee: BigInt(args.serviceFee),
			webhookEventId: args.webhookEventId ?? null
		});
	});
};

interface ReverseOrderRevenueArgs {
	storeId: string;
	/** The order's customer -- who the refund is owed to, not who cancelled. */
	customerId: string;
	total: number;
	orderId: string;
	wasRealized: boolean;
}

/**
 * Order cancelled. The money comes out of whichever bucket it was sitting in
 * and lands in the customer's credit account.
 */
export const reverseOrderRevenue = async (
	prisma: PrismaClient,
	args: ReverseOrderRevenueArgs
) => {
	await runSerializable(prisma, async tx => {
		await recordRefund(tx, {
			storeId: args.storeId,
			userId: args.customerId,
			orderId: args.orderId,
			total: BigInt(args.total),
			wasRealized: args.wasRealized
		});
	});
};
