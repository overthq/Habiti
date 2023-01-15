import { Resolver } from '../../types/resolvers';

interface AddToCartArgs {
	input: {
		storeId: string;
		productId: string;
		quantity: number;
	};
}

const addToCart: Resolver<AddToCartArgs> = async (
	_,
	{ input: { storeId, productId, quantity } },
	ctx
) => {
	const cart = await ctx.prisma.cart.upsert({
		where: { userId_storeId: { userId: ctx.user.id, storeId } },
		update: {},
		create: { userId: ctx.user.id, storeId }
	});

	const cartProduct = await ctx.prisma.cartProduct.upsert({
		where: { cartId_productId: { cartId: cart.id, productId } },
		update: {
			quantity
		},
		create: {
			cartId: cart.id,
			productId,
			quantity
		}
	});

	return cartProduct;
};

interface RemoveProductArgs {
	cartId: string;
	productId: string;
}

const removeFromCart: Resolver<RemoveProductArgs> = async (
	_,
	{ cartId, productId },
	ctx
) => {
	const { userId } = await ctx.prisma.cart.findUnique({
		where: {
			id: cartId
		}
	});

	if (userId === ctx.user.id) {
		const product = await ctx.prisma.cartProduct.delete({
			where: { cartId_productId: { cartId, productId } }
		});

		return `${product.cartId}-${product.productId}`;
	} else {
		throw new Error('You are not authorized to access this product');
	}
};

interface UpdateCartProductArgs {
	input: {
		cartId: string;
		productId: string;
		quantity: number;
	};
}

const updateCartProduct: Resolver<UpdateCartProductArgs> = (
	_,
	{ input: { cartId, productId, quantity } },
	ctx
) => {
	return ctx.prisma.cartProduct.update({
		where: {
			cartId_productId: { cartId, productId }
		},
		data: {
			quantity
		}
	});
};

export default {
	Mutation: {
		addToCart,
		removeFromCart,
		updateCartProduct
	}
};
