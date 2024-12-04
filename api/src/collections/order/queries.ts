import { Resolver } from '../../types/resolvers';

interface OrderArgs {
	id: string;
}

const order: Resolver<OrderArgs> = (_, { id }, ctx) => {
	return ctx.prisma.order.findUnique({ where: { id } });
};

const user: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.order.findUnique({ where: { id: parent.id } }).user();
};

const store: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.order.findUnique({ where: { id: parent.id } }).store();
};

const products: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.order.findUnique({ where: { id: parent.id } }).products();
};

const total: Resolver = async (parent, _, ctx) => {
	const fetchedProducts = await ctx.prisma.order
		.findUnique({ where: { id: parent.id } })
		.products();

	if (!fetchedProducts) {
		throw new Error('Order not found');
	}

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
