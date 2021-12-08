import { ResolverContext } from '../../types/resolvers';

const createProduct = async (_, { input }, ctx: ResolverContext) => {
	const product = await ctx.prisma.product.create({
		data: {
			...input
		}
	});

	return product;
};

const editProduct = () => {};

export default {
	Mutation: {
		createProduct,
		editProduct
	}
};
