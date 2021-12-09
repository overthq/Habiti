import { Resolver } from '../../types/resolvers';

interface UserOrdersArgs {
	userId: string;
}

const userOrders: Resolver<UserOrdersArgs> = async (_, { userId }, ctx) => {
	const orders = await ctx.prisma.order.findMany({ where: { userId } });

	return orders;
};

interface StoreOrdersArgs {
	storeId: string;
}

const storeOrders: Resolver<StoreOrdersArgs> = async (_, { storeId }, ctx) => {
	const orders = await ctx.prisma.order.findMany({ where: { storeId } });

	return orders;
};

export default {
	Query: {
		userOrders,
		storeOrders
	}
};
