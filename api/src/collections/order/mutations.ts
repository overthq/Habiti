import { ResolverContext } from '../../types/resolvers';

export const createOrder = async (_, { input }, ctx: ResolverContext) => {
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
