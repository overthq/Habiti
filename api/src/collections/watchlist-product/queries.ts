import { Resolver } from '../../types/resolvers';

const id: Resolver = async parent => {
	return `${parent.userId}-${parent.productId}`;
};

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
		id,
		user,
		product
	}
};
