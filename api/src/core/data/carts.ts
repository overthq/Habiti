import { ResolverContext } from '../../types/resolvers';

export const getCartById = async (ctx: ResolverContext, cartId: string) => {
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

export const deleteCart = async (ctx: ResolverContext, cartId: string) => {
	await ctx.prisma.cart.delete({ where: { id: cartId } });
};

export const getCartsByUserId = async (
	ctx: ResolverContext,
	userId: string
) => {
	const carts = await ctx.prisma.cart.findMany({
		where: { userId },
		include: {
			products: { include: { product: true } },
			store: true
		}
	});

	return carts;
};

export const addProductToCart = async (
	ctx: ResolverContext,
	cartId: string,
	storeId: string,
	productId: string
) => {
	await ctx.prisma.cart.upsert({
		where: { id: cartId },
		update: { products: { create: { productId, quantity: 1 } } },
		create: {
			userId: ctx.user.id,
			storeId,
			products: { create: { productId, quantity: 1 } }
		}
	});
};

export const removeProductFromCart = async (
	ctx: ResolverContext,
	cartId: string,
	productId: string
) => {
	await ctx.prisma.cartProduct.delete({
		where: { cartId_productId: { cartId, productId } }
	});
};

export const clearCart = async (ctx: ResolverContext, cartId: string) => {
	await ctx.prisma.cart.delete({ where: { id: cartId } });
};
