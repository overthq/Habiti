import { Resolver } from '../../types/resolvers';

interface StoreArgs {
	id: string;
}

const store: Resolver<StoreArgs> = async (_, { id }, ctx) => {
	const fetchedStore = await ctx.prisma.store.findUnique({ where: { id } });

	return fetchedStore;
};

const stores: Resolver = async (_, __, ctx) => {
	const fetchedStores = await ctx.prisma.store.findMany();

	return fetchedStores;
};

const products: Resolver = async (parent, _, ctx) => {
	const fetchedProducts = await ctx.prisma.store
		.findUnique({ where: { id: parent.id } })
		.products();

	return fetchedProducts;
};

const orders: Resolver = async (parent, _, ctx) => {
	const fetchedOrders = await ctx.prisma.store
		.findUnique({ where: { id: parent.id } })
		.orders();

	return fetchedOrders;
};

const managers: Resolver = async (parent, _, ctx) => {
	const fetchedManagers = await ctx.prisma.store
		.findUnique({ where: { id: parent.id } })
		.managers();

	return fetchedManagers;
};

const followers: Resolver = async (parent, _, ctx) => {
	const fetchedFollowers = await ctx.prisma.store
		.findUnique({
			where: { id: parent.id }
		})
		.followers();

	return fetchedFollowers;
};

const carts: Resolver = async (parent, _, ctx) => {
	const fetchedCarts = await ctx.prisma.store
		.findUnique({ where: { id: parent.id } })
		.carts();

	return fetchedCarts;
};

const image: Resolver = async (parent, _, ctx) => {
	const fetchedImage = await ctx.prisma.store
		.findUnique({ where: { id: parent.id } })
		.image();

	return fetchedImage;
};

// TODO: Move these to a new collections group.

const storeManagerStore: Resolver = async (parent, _, ctx) => {
	const fetchedStoreManagerStore = await ctx.prisma.storeManager
		.findUnique({
			where: {
				storeId_managerId: {
					storeId: parent.storeId,
					managerId: parent.managerId
				}
			}
		})
		.store();

	return fetchedStoreManagerStore;
};

const storeManagerManager: Resolver = async (parent, _, ctx) => {
	const fetchedStoreManagerManager = await ctx.prisma.storeManager
		.findUnique({
			where: {
				storeId_managerId: {
					storeId: parent.storeId,
					managerId: parent.managerId
				}
			}
		})
		.manager();

	return fetchedStoreManagerManager;
};

const storeFollowerStore: Resolver = async (parent, _, ctx) => {
	const fetchedStoreFollowerStore = await ctx.prisma.storeFollower
		.findUnique({
			where: {
				storeId_followerId: {
					storeId: parent.storeId,
					followerId: parent.followerId
				}
			}
		})
		.store();

	return fetchedStoreFollowerStore;
};

const storeFollowerFollower: Resolver = async (parent, _, ctx) => {
	const fetchedStoreFollowerFollower = await ctx.prisma.storeFollower
		.findUnique({
			where: {
				storeId_followerId: {
					storeId: parent.storeId,
					followerId: parent.followerId
				}
			}
		})
		.follower();

	return fetchedStoreFollowerFollower;
};

export default {
	Query: {
		store,
		stores
	},
	Store: {
		products,
		orders,
		managers,
		followers,
		carts,
		image
	},
	StoreManager: {
		store: storeManagerStore,
		manager: storeManagerManager
	},
	StoreFollower: {
		store: storeFollowerStore,
		follower: storeFollowerFollower
	}
};
