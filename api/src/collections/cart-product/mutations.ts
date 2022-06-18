import { Resolver } from '../../types/resolvers';

interface AddToCartArgs {
	input: {
		cartId?: string;
		storeId: string;
		productId: string;
		quantity: number;
	};
}

const addToCart: Resolver<AddToCartArgs> = async (
	_,
	{ input: { cartId, productId, quantity } },
	ctx
) => {
	const cartProduct = await ctx.prisma.cartProduct.upsert({
		where: { cartId_productId: { cartId, productId } },
		update: {
			quantity
		},
		create: {
			cartId,
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

const updateCartProduct: Resolver<UpdateCartProductArgs> = async (
	_,
	{ input: { cartId, productId, quantity } },
	ctx
) => {
	const updatedCartProduct = await ctx.prisma.cartProduct.update({
		where: {
			cartId_productId: { cartId, productId }
		},
		data: {
			quantity
		}
	});

	return updatedCartProduct;
};

export default {
	Mutation: {
		addToCart,
		removeFromCart,
		updateCartProduct
	}
};
