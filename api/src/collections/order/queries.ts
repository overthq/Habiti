import { Resolver } from '../../types/resolvers';

interface UserOrdersArgs {
	userId: string;
}

const userOrders: Resolver<UserOrdersArgs> = async (_, { userId }, ctx) => {
	const orders = await ctx.prisma.order.findMany({ where: { userId } });

	return orders;
};

interface StoreOrdersArgs {
	storeId: string;
}

const storeOrders: Resolver<StoreOrdersArgs> = async (_, { storeId }, ctx) => {
	const orders = await ctx.prisma.order.findMany({ where: { storeId } });

	return orders;
};

const user: Resolver = async (parent, _, ctx) => {
	const fetchedUser = await ctx.prisma.order
		.findUnique({ where: { id: parent.id } })
		.user();

	return fetchedUser;
};

const store: Resolver = async (parent, _, ctx) => {
	const fetchedStore = await ctx.prisma.order
		.findUnique({ where: { id: parent.id } })
		.store();

	return fetchedStore;
};

const products: Resolver = async (parent, _, ctx) => {
	const fetchedProducts = await ctx.prisma.order
		.findUnique({ where: { id: parent.id } })
		.products();

	return fetchedProducts;
};

export default {
	Query: {
		userOrders,
		storeOrders
	},
	Order: {
		user,
		store,
		products
	}
};
