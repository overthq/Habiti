import { authenticatedResolver } from '../permissions';

export interface CreateCartArgs {
	input: {
		storeId: string;
		productId: string;
		quantity: number;
	};
}

export const createCart = authenticatedResolver<CreateCartArgs>(
	(_, { input }, ctx) => {
		const { storeId, productId, quantity } = input;

		return ctx.prisma.cart.create({
			data: {
				userId: ctx.user.id,
				storeId,
				products: { create: { productId, quantity } }
			}
		});
	}
);

export interface DeleteCartArgs {
	id: string;
}

export const deleteCart = authenticatedResolver<DeleteCartArgs>(
	(_, { id }, ctx) => {
		return ctx.prisma.cart.delete({ where: { id, userId: ctx.user.id } });
	}
);

export interface AddToCartArgs {
	input: {
		storeId: string;
		productId: string;
		quantity: number;
	};
}

export const addToCart = authenticatedResolver<AddToCartArgs>(
	async (_, { input: { storeId, productId, quantity } }, ctx) => {
		const cart = await ctx.prisma.cart.upsert({
			where: { userId_storeId: { userId: ctx.user.id, storeId } },
			update: {},
			create: { userId: ctx.user.id, storeId }
		});

		const cartProduct = await ctx.prisma.cartProduct.upsert({
			where: { cartId_productId: { cartId: cart.id, productId } },
			update: { quantity },
			create: {
				cartId: cart.id,
				productId,
				quantity
			}
		});

		return cartProduct;
	}
);

export interface RemoveProductArgs {
	cartId: string;
	productId: string;
}

export const removeFromCart = authenticatedResolver<RemoveProductArgs>(
	async (_, { cartId, productId }, ctx) => {
		const cart = await ctx.prisma.cart.findUnique({ where: { id: cartId } });

		if (!cart) {
			throw new Error('Cart not found');
		}

		if (cart.userId !== ctx.user.id) {
			throw new Error('You are not authorized to access this product');
		}

		const product = await ctx.prisma.cartProduct.delete({
			where: { cartId_productId: { cartId, productId } }
		});

		return `${product.cartId}-${product.productId}`;
	}
);

export interface UpdateCartProductArgs {
	input: {
		cartId: string;
		productId: string;
		quantity: number;
	};
}

export const updateCartProduct = authenticatedResolver<UpdateCartProductArgs>(
	async (_, { input: { cartId, productId, quantity } }, ctx) => {
		return ctx.prisma.cartProduct.update({
			where: { cartId_productId: { cartId, productId } },
			data: { quantity },
			include: {
				cart: true,
				product: true
			}
		});
	}
);
