import { Resolver } from '../../types/resolvers';

interface CartArgs {
	id: string;
}

const cart: Resolver<CartArgs> = async (_, { id }, ctx) => {
	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { id }
	});

	return fetchedCart;
};

const userCarts: Resolver = async (_, __, ctx) => {
	const carts = await ctx.prisma.cart.findMany({
		where: { userId: ctx.user.id }
	});

	return carts;
};

interface UserCartArgs {
	storeId: string;
}

const userCart: Resolver<UserCartArgs> = async (_, { storeId }, ctx) => {
	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { userId_storeId: { userId: ctx.user.id, storeId } }
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

export default {
	Query: {
		cart,
		userCarts,
		userCart
	},
	Cart: {
		user,
		products,
		store,
		total
	}
};
