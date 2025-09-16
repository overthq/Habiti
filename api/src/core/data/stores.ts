import { PrismaClient } from '@prisma/client';

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
	prisma: PrismaClient,
	params: CreateStoreParams
) => {
	const store = await prisma.store.create({
		data: params
	});

	return store;
};

export const updateStore = async (
	prisma: PrismaClient,
	storeId: string,
	params: UpdateStoreParams
) => {
	const store = await prisma.store.update({
		where: { id: storeId },
		data: params
	});

	return store;
};

export const getStoreById = async (prisma: PrismaClient, storeId: string) => {
	const store = await prisma.store.findUnique({
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
	storeId: string
) => {
	const products = await prisma.store
		.findUnique({ where: { id: storeId } })
		.products();

	return products;
};

export const getStoreManagers = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const storeManagers = await prisma.store
		.findUnique({ where: { id: storeId } })
		.products();

	return storeManagers;
};

export const deleteStore = async (prisma: PrismaClient, storeId: string) => {
	return prisma.store.delete({
		where: { id: storeId }
	});
};

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

export const followStore = async (
	prisma: PrismaClient,
	params: CreateStoreFollowerParams
) => {
	const follower = await prisma.storeFollower.create({
		data: {
			...params,
			followerId: params.userId
		}
	});

	return follower;
};

export const unfollowStore = async (
	prisma: PrismaClient,
	storeId: string,
	userId: string
) => {
	await prisma.storeFollower.delete({
		where: {
			storeId_followerId: {
				followerId: userId,
				storeId
			}
		}
	});
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
