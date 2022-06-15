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

	const computedTotal = fetchedProducts.reduce((acc, p) => {
		return acc + p.product.unitPrice * p.quantity;
	}, 0);

	return computedTotal;
};

// Aggregates?
// A bad experiment that might not work, but is worth a shot.

const productsAggregate: Resolver = parent => {
	return { count: parent.products.length };
};

export default {
	Query: {
		carts,
		cart
	},
	Cart: {
		user,
		products,
		productsAggregate,
		store,
		total
	}
};
