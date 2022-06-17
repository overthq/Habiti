import { Resolver } from '../../types/resolvers';

interface CreateCartArgs {
	input: {
		storeId: string;
		productId: string;
		quantity: number;
	};
}

const createCart: Resolver<CreateCartArgs> = async (_, { input }, ctx) => {
	const { storeId, productId, quantity } = input;
	const cart = await ctx.prisma.cart.create({
		data: {
			userId: ctx.user.id,
			storeId,
			products: {
				create: {
					productId,
					quantity
				}
			}
		}
	});

	return cart;
};

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

		return product;
	}
};

interface DeleteCartArgs {
	id: string;
}

const deleteCart: Resolver<DeleteCartArgs> = async (_, { id }, ctx) => {
	await ctx.prisma.cart.delete({
		where: { id }
	});

	return id;
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
	const updatedCartProduct = await ctx.prisma.cartProduct
		.update({
			where: {
				cartId_productId: { cartId, productId }
			},
			data: {
				quantity
			}
		})
		.cart();

	return updatedCartProduct;
};

export default {
	Mutation: {
		createCart,
		addToCart,
		removeFromCart,
		deleteCart,
		updateCartProduct
	}
};
