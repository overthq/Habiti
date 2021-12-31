import { Resolver } from '../../types/resolvers';

interface OrderArgs {
	id: string;
}

const order: Resolver<OrderArgs> = async (_, { id }, ctx) => {
	const fetchedOrder = await ctx.prisma.order.findUnique({ where: { id } });

	return fetchedOrder;
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
		order
	},
	Order: {
		user,
		store,
		products
	}
};
