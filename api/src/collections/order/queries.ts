import { ResolverContext } from '../../types/resolvers';

const userOrders = async (_, { userId }, ctx: ResolverContext) => {
	const orders = await ctx.prisma.order.findMany({ where: { userId } });

	return orders;
};

const storeOrders = async (_, { storeId }, ctx: ResolverContext) => {
	const orders = await ctx.prisma.order.findMany({ where: { storeId } });

	return orders;
};

export default {
	Query: {
		userOrders,
		storeOrders
	}
};
