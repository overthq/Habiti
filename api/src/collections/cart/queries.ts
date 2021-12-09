import { Resolver } from '../../types/resolvers';

interface CartArgs {
	userId: string;
	storeId: string;
}

export const cart: Resolver<CartArgs> = async (_, { userId, storeId }, ctx) => {
	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { userId_storeId: { userId, storeId } }
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
