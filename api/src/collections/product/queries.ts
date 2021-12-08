import { ResolverContext } from '../../types/resolvers';

const product = async (_, { id }, ctx: ResolverContext) => {
	const fetchedProduct = await ctx.prisma.product.findUnique({ where: { id } });

	return fetchedProduct;
};

const storeProducts = async (_, { storeId }, ctx: ResolverContext) => {
	// TODO: Use cursors for pagination.
	// Try to extract the pagination logic for use in other resolvers.
	const products = await ctx.prisma.product.findMany({ where: { storeId } });

	return products;
};

export default {
	Query: {
		product,
		storeProducts
	}
};
