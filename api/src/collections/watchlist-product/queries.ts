import { Resolver } from '../../types/resolvers';

const id: Resolver = async parent => {
	return `${parent.userId}-${parent.productId}`;
};

const user: Resolver = (parent, _, ctx) => {
	return ctx.prisma.watchlistProduct
		.findUnique({
			where: {
				userId_productId: {
					userId: parent.userId,
					productId: parent.productId
				}
			}
		})
		.user();
};

const product: Resolver = (parent, _, ctx) => {
	return ctx.prisma.watchlistProduct
		.findUnique({
			where: {
				userId_productId: {
					userId: parent.userId,
					productId: parent.productId
				}
			}
		})
		.product();
};

export default {
	WatchlistProduct: {
		id,
		user,
		product
	}
};
