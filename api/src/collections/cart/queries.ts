import { Resolver } from '../../types/resolvers';

const carts: Resolver = async (_parent, _args, ctx) => {
	return ctx.prisma.cart.findMany();
};

interface CartArgs {
	id: string;
}

const cart: Resolver<CartArgs> = async (_, { id }, ctx) => {
	return ctx.prisma.cart.findUnique({ where: { id } });
};

const user: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.cart.findUnique({ where: { id: parent.id } }).user();
};

const products: Resolver = (parent, _, ctx) => {
	return ctx.prisma.cart.findUnique({ where: { id: parent.id } }).products();
};

const store: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.cart.findUnique({ where: { id: parent.id } }).store();
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

export default {
	Query: {
		carts,
		cart
	},
	Cart: {
		user,
		products,
		store,
		total
	}
};
