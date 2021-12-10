import { Resolver } from '../../types/resolvers';

const product: Resolver = async (_, { id }, ctx) => {
	const fetchedProduct = await ctx.prisma.product.findUnique({ where: { id } });

	return fetchedProduct;
};

const storeProducts: Resolver = async (_, { storeId }, ctx) => {
	const products = await ctx.prisma.product.findMany({ where: { storeId } });

	return products;
};

const orders: Resolver = async (parent, _, ctx) => {
	const fetchedOrders = await ctx.prisma.product
		.findUnique({ where: { id: parent.id } })
		.orders();

	return fetchedOrders;
};

const carts: Resolver = async (parent, _, ctx) => {
	const fetchedCarts = await ctx.prisma.product
		.findUnique({ where: { id: parent.id } })
		.orders();

	return fetchedCarts;
};

const store: Resolver = async (parent, _, ctx) => {
	const fetchedStore = await ctx.prisma.product
		.findUnique({
			where: { id: parent.id }
		})
		.store();

	return fetchedStore;
};

export default {
	Query: {
		product,
		storeProducts
	},
	Product: {
		orders,
		carts,
		store
	}
};
