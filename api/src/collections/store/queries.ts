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

const followedStores: Resolver = async (_, __, ctx) => {
	const { followed } = await ctx.prisma.user.findUnique({
		where: { id: ctx.user.id },
		include: {
			followed: true
		}
	});

	return followed;
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

// TODO: Move these to a new collections group.

const storeManagerStore: Resolver = async (parent, _, ctx) => {
	const fetchedStores = await ctx.prisma.storeManager
		.findUnique({
			where: {
				storeId_managerId: {
					storeId: parent.storeId,
					managerId: parent.managerId
				}
			}
		})
		.store();

	return fetchedStores;
};

const storeManagerManager: Resolver = async (parent, _, ctx) => {
	const fetchedStores = await ctx.prisma.storeManager
		.findUnique({
			where: {
				storeId_managerId: {
					storeId: parent.storeId,
					managerId: parent.managerId
				}
			}
		})
		.manager();

	return fetchedStores;
};

export default {
	Query: {
		store,
		stores,
		followedStores
	},
	Store: {
		products,
		orders,
		managers,
		followers,
		carts
	},
	StoreManager: {
		store: storeManagerStore,
		manager: storeManagerManager
	}
};
