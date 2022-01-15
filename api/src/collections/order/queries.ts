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

const total: Resolver = async (parent, _, ctx) => {
	const fetchedProducts = await ctx.prisma.order
		.findUnique({ where: { id: parent.id } })
		.products();

	const computedTotal = fetchedProducts.reduce((acc, product) => {
		return acc + product.unitPrice * product.quantity;
	}, 0);

	return computedTotal;
};

export default {
	Query: {
		order
	},
	Order: {
		user,
		store,
		products,
		total
	}
};
