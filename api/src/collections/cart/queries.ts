import { Resolver } from '../../types/resolvers';

const carts: Resolver = async (_parent, _args, ctx) => {
	const fetchedCarts = await ctx.prisma.cart.findMany();

	return fetchedCarts;
};

interface CartArgs {
	id: string;
}

const cart: Resolver<CartArgs> = async (_, { id }, ctx) => {
	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { id }
	});

	return fetchedCart;
};

const user: Resolver = async (parent, _, ctx) => {
	const fetchedUser = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.user();

	return fetchedUser;
};

const products: Resolver = async (parent, _, ctx) => {
	const fetchedProducts = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.products();

	return fetchedProducts;
};

const store: Resolver = async (parent, _, ctx) => {
	const fetchedStore = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.store();

	return fetchedStore;
};

const total: Resolver = async (parent, _, ctx) => {
	const fetchedProducts = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.products({ include: { product: true } });

	// For some reason, the Prisma API does not support a sum aggregation on
	// more than one field (in this case, product.unitPrice and quantity).
	// It would even be trickier to handle given that "product" is based on a join.

	const computedTotal = fetchedProducts.reduce((acc, p) => {
		return acc + p.product.unitPrice * p.quantity;
	}, 0);

	return computedTotal;
};

// const productsAggregate: Resolver = async (parent, _args, ctx) => {
// 	const count = await ctx.prisma.cartProduct.count({
// 		where: { cartId: parent.id }
// 	});

// 	return { count };
// };

export default {
	Query: {
		carts,
		cart
	},
	Cart: {
		user,
		products,
		// productsAggregate,
		store,
		total
	}
};
