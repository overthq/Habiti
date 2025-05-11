import { ResolverContext } from '../../types/resolvers';

export const loadCart = async (ctx: ResolverContext, cartId: string) => {
	const cart = await ctx.prisma.cart.findUnique({
		where: { id: cartId, userId: ctx.user.id },
		include: {
			products: { include: { product: true } },
			store: true
		}
	});

	if (!cart) {
		throw new Error('Cart not found');
	}

	return cart;
};
