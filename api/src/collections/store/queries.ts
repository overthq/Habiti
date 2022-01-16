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

const followedByUser: Resolver = async (parent, _, ctx) => {
	const fetchedFollower = await ctx.prisma.storeFollower.findUnique({
		where: {
			storeId_followerId: { storeId: parent.id, followerId: ctx.user.id }
		}
	});

	return !!fetchedFollower;
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
		image,
		followedByUser
	}
};
