import { ResolverContext } from '../../types/resolvers';

const deleteUser = async (_, { id }, ctx: ResolverContext) => {
	await ctx.prisma.user.delete({ where: { id } });

	return id;
};

export default {
	Mutation: {
		deleteUser
	}
};
