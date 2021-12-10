import { Resolver } from '../../types/resolvers';

interface CartArgs {
	id: string;
}

export const cart: Resolver<CartArgs> = async (_, { id }, ctx) => {
	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { id }
	});

	return fetchedCart;
};

interface UserCartsArgs {
	userId: string;
}

export const userCarts: Resolver<UserCartsArgs> = async (
	_,
	{ userId },
	ctx
) => {
	const carts = await ctx.prisma.cart.findMany({
		where: { userId }
	});

	return carts;
};

export default {
	Query: {
		cart,
		userCarts
	}
};
