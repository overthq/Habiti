import { Resolver } from '../../types/resolvers';

interface CreateCartArgs {
	input: {
		storeId: string;
		productId: string;
		quantity: number;
	};
}

const createCart: Resolver<CreateCartArgs> = (_, { input }, ctx) => {
	const { storeId, productId, quantity } = input;

	return ctx.prisma.cart.create({
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
};

interface DeleteCartArgs {
	id: string;
}

const deleteCart: Resolver<DeleteCartArgs> = (_, { id }, ctx) => {
	return ctx.prisma.cart.delete({ where: { id } });
};

export default {
	Mutation: {
		createCart,
		deleteCart
	}
};
