import { Resolver } from '../../types/resolvers';

interface CreateCartArgs {
	input: {
		storeId: string;
		productId: string;
		quantity: number;
	};
}

// Technically, storeId should be the only required field,
// but we never call this mutation without the productId and quantity fields,
// so it should be fine.

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

interface AddProductArgs {
	input: {
		cartId?: string;
		storeId: string;
		productId: string;
		quantity: number;
	};
}

const addProductToCart: Resolver<AddProductArgs> = async (
	_,
	{ input: { cartId, productId, quantity } },
	ctx
) => {
	const cart = await ctx.prisma.cart.update({
		where: { id: cartId },
		data: {
			products: {
				upsert: {
					where: { cartId_productId: { cartId, productId } },
					update: {
						quantity
					},
					create: {
						productId,
						quantity
					}
				}
			}
		}
	});

	return cart;
};

interface RemoveProductArgs {
	cartId: string;
	productId: string;
}

const removeProductFromCart: Resolver<RemoveProductArgs> = async (
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
		await ctx.prisma.cartProduct.delete({
			where: { cartId_productId: { cartId, productId } }
		});

		return cartId;
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
		addProductToCart,
		removeProductFromCart,
		deleteCart,
		updateCartProduct
	}
};
