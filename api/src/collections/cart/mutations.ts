import { Resolver } from '../../types/resolvers';

interface AddProductArgs {
	cartId?: string;
	storeId: string;
	productId: string;
	quantity: number;
}

const addProductToCart: Resolver<AddProductArgs> = async (
	_,
	{ cartId, storeId, productId, quantity },
	ctx
) => {
	await ctx.prisma.cart.upsert({
		where: { id: cartId },
		update: {
			products: {
				upsert: {
					where: { cartId_productId: { cartId, productId } },
					create: {
						productId,
						quantity
					},
					update: {
						quantity
					}
				}
			}
		},
		create: {
			userId: ctx.user.id,
			storeId
		},
		include: {
			products: true
		}
	});
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

export default {
	Mutation: {
		addProductToCart,
		removeProductFromCart,
		deleteCart
	}
};
