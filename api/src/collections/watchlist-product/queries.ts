import { Resolver } from '../../types/resolvers';

const user: Resolver = async (parent, _, ctx) => {
	const fetchedUser = await ctx.prisma.watchlistProduct
		.findUnique({
			where: {
				userId_productId: {
					userId: parent.userId,
					productId: parent.productId
				}
			}
		})
		.user();

	return fetchedUser;
};

const product: Resolver = async (parent, _, ctx) => {
	const fetchedProduct = await ctx.prisma.watchlistProduct
		.findUnique({
			where: {
				userId_productId: {
					userId: parent.userId,
					productId: parent.productId
				}
			}
		})
		.product();

	return fetchedProduct;
};

export default {
	WatchlistProduct: {
		user,
		product
	}
};
