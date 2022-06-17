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
		createCart,
		deleteCart
	}
};
