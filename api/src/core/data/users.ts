import { PrismaClient } from '../../generated/prisma/client';
import { UserFilters, userFiltersToPrismaClause } from '../../utils/queries';
export interface CreateUserParams {
	name: string;
	email?: string | null;
	appleId?: string;
	isAnonymous?: boolean;
	passwordHash?: string;
}

export const createUser = async (
	prisma: PrismaClient,
	params: CreateUserParams
) => {
	const user = await prisma.user.create({
		data: params
	});

	return user;
};

interface UpdateUserParams {
	name?: string;
	email?: string;
	appleId?: string;
	isAnonymous?: boolean;
	passwordHash?: string;
	suspended?: boolean;
}

export const updateUser = async (
	prisma: PrismaClient,
	userId: string,
	params: UpdateUserParams
) => {
	const user = await prisma.user.update({
		where: { id: userId },
		data: params
	});

	return user;
};

export const getUserById = async (prisma: PrismaClient, userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId }
	});

	return user;
};

export const getUserByEmail = async (prisma: PrismaClient, email: string) => {
	const user = await prisma.user.findUnique({
		where: { email }
	});

	return user;
};

export const getUserByAppleId = async (
	prisma: PrismaClient,
	appleId: string
) => {
	const user = await prisma.user.findUnique({
		where: { appleId }
	});

	return user;
};

export const mergeUsers = async (
	prisma: PrismaClient,
	fromUserId: string,
	toUserId: string
) => {
	const sessions = await prisma.session.findMany({
		where: { userId: fromUserId },
		select: { id: true }
	});

	await prisma.$transaction(async tx => {
		// Carts are unique per (userId, storeId): merge into an existing cart
		// for the same store, otherwise transfer ownership.
		const carts = await tx.cart.findMany({
			where: { userId: fromUserId },
			include: { products: true }
		});

		for (const cart of carts) {
			const existing = await tx.cart.findUnique({
				where: { userId_storeId: { userId: toUserId, storeId: cart.storeId } }
			});

			if (existing) {
				for (const product of cart.products) {
					await tx.cartProduct.upsert({
						where: {
							cartId_productId: {
								cartId: existing.id,
								productId: product.productId
							}
						},
						update: { quantity: product.quantity },
						create: {
							cartId: existing.id,
							productId: product.productId,
							quantity: product.quantity
						}
					});
				}

				await tx.cart.delete({ where: { id: cart.id } });
			} else {
				await tx.cart.update({
					where: { id: cart.id },
					data: { userId: toUserId }
				});
			}
		}

		// Unique-constrained join rows: copy (skipping duplicates), then let
		// the source rows go away with the user delete below.
		const watchlist = await tx.watchlistProduct.findMany({
			where: { userId: fromUserId }
		});

		if (watchlist.length > 0) {
			await tx.watchlistProduct.createMany({
				data: watchlist.map(({ productId }) => ({
					userId: toUserId,
					productId
				})),
				skipDuplicates: true
			});
		}

		const follows = await tx.storeFollower.findMany({
			where: { followerId: fromUserId }
		});
		if (follows.length > 0) {
			await tx.storeFollower.createMany({
				data: follows.map(({ storeId }) => ({
					storeId,
					followerId: toUserId
				})),
				skipDuplicates: true
			});
		}

		const pushTokens = await tx.userPushToken.findMany({
			where: { userId: fromUserId }
		});
		if (pushTokens.length > 0) {
			await tx.userPushToken.createMany({
				data: pushTokens.map(({ token, type }) => ({
					userId: toUserId,
					token,
					type
				})),
				skipDuplicates: true
			});
		}

		// Plain ownership transfers.
		await tx.order.updateMany({
			where: { userId: fromUserId },
			data: { userId: toUserId }
		});

		await tx.productReview.updateMany({
			where: { userId: fromUserId },
			data: { userId: toUserId }
		});

		await tx.card.updateMany({
			where: { userId: fromUserId },
			data: { userId: toUserId }
		});

		await tx.address.updateMany({
			where: { userId: fromUserId },
			data: { userId: toUserId }
		});

		// Cascades clean up sessions, refresh tokens and any remaining rows.
		await tx.user.delete({ where: { id: fromUserId } });
	});

	return { sessionIds: sessions.map(({ id }) => id) };
};

export const deleteUser = async (prisma: PrismaClient, userId: string) => {
	await prisma.user.delete({
		where: { id: userId }
	});
};

export const getManagedStores = async (
	prisma: PrismaClient,
	userId: string
) => {
	const managedStores = await prisma.storeManager.findMany({
		where: { managerId: userId },
		include: { store: true }
	});

	return managedStores.map(({ store }) => store);
};

export const getUsers = async (prisma: PrismaClient, filters?: UserFilters) => {
	const { where, orderBy } = userFiltersToPrismaClause(filters);

	return prisma.user.findMany({
		where,
		orderBy: orderBy ?? { createdAt: 'desc' }
	});
};
