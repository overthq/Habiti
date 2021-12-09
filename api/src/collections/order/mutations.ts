import { Resolver } from '../../types/resolvers';

export const createOrder: Resolver<any> = async (_, { input }, ctx) => {
	const order = await ctx.prisma.order.create({
		data: { ...input }
	});

	return order;
};

export default {
	Mutation: {
		createOrder
	}
};
