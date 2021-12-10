import { Resolver } from '../../types/resolvers';

const product: Resolver = async (_, { id }, ctx) => {
	const fetchedProduct = await ctx.prisma.product.findUnique({ where: { id } });

	return fetchedProduct;
};

const storeProducts: Resolver = async (_, { storeId }, ctx) => {
	// TODO: Use cursors for pagination.
	// Try to extract the pagination logic for use in other resolvers.
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

// Maybe create a codemod (like this) to generate field resolvers.
// Doing this at runtime is terrible,
// since we have to create the resolver every time, before we can use it.
// Maybe even create an NPM package for it.

// const collections = {
// 	user: ['orders', 'managed', 'followed', 'carts'],
// 	stores: ['products', 'orders', 'managers', 'followers', 'carts']
// };

// const buildFieldResolver = (field: keyof typeof collections) => {
// 	const resolver: Resolver = async (p, _, c) => {
// 		const fetched = await c.prisma[field]
// 			.findUnique({ where: { id: p.id } })
// 			[collections[field]]();
// 		return fetched;
// 	};
// 	return resolver;
// };

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
