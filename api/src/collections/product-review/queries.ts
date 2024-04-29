import { Resolver } from '../../types/resolvers';

export const user: Resolver = async (parent, _, ctx) => {
	const fetchedUser = await ctx.prisma.productReview
		.findUnique({ where: { id: parent.id } })
		.user();

	return fetchedUser;
};

export const product: Resolver = async (parent, _, ctx) => {
	const fetchedProduct = await ctx.prisma.productReview
		.findUnique({ where: { id: parent.id } })
		.product();

	return fetchedProduct;
};

export default {
	ProductReview: {
		user,
		product
	}
};
