import { Resolver } from '../../types/resolvers';

const createProduct: Resolver = async (_, { input }, ctx) => {
	const product = await ctx.prisma.product.create({
		data: input
	});

	return product;
};

const editProduct: Resolver = async (_, { id, input }, ctx) => {
	const product = await ctx.prisma.product.update({
		where: { id },
		data: input
	});

	return product;
};

export default {
	Mutation: {
		createProduct,
		editProduct
	}
};
