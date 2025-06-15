import { Resolver } from '../../types/resolvers';

export const carts: Resolver = async (_parent, _args, ctx) => {
	return ctx.prisma.cart.findMany();
};

export interface CartArgs {
	id: string;
}

export const cart: Resolver<CartArgs> = async (_, { id }, ctx) => {
	return ctx.prisma.cart.findUnique({ where: { id } });
};

export const user: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.cart.findUnique({ where: { id: parent.id } }).user();
};

export const products: Resolver = (parent, _, ctx) => {
	return ctx.prisma.cart.findUnique({ where: { id: parent.id } }).products({
		include: { product: true },
		orderBy: { product: { name: 'asc' } }
	});
};

export const store: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.cart.findUnique({ where: { id: parent.id } }).store();
};

export const total: Resolver = async (parent, _, ctx) => {
	const fetchedProducts = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.products({ include: { product: true } });

	if (!fetchedProducts) {
		throw new Error('Cart not found');
	}

	const computedTotal = fetchedProducts.reduce((acc, p) => {
		return acc + p.product.unitPrice * p.quantity;
	}, 0);

	return computedTotal;
};

const calculatePaystackFee = (subTotal: number) => {
	return Math.min(200000, 0.015 * subTotal + 10000);
};

const calculateHabitiFee = () => 100000;

export const fees: Resolver = async (parent, _, ctx) => {
	// FIXME: This is duplicated from the total resolver.
	// Use a denormalized field for the total instead.

	const fetchedProducts = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.products({ include: { product: true } });

	if (!fetchedProducts) {
		throw new Error('Cart not found');
	}

	const computedTotal = fetchedProducts.reduce((acc, p) => {
		return acc + p.product.unitPrice * p.quantity;
	}, 0);

	const transaction = calculatePaystackFee(computedTotal);
	const service = calculateHabitiFee();
	const total = transaction + service;

	return { id: `fees-${parent.id}`, transaction, service, total };
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
		total,
		fees
	}
};
