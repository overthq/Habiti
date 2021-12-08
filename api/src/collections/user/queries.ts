import { ResolverContext } from '../../types/resolvers';

const user = async (_, { id }, ctx: ResolverContext) => {
	const fetchedUser = await ctx.prisma.user.findUnique({ where: { id } });

	return fetchedUser;
};

const users = async (_, __, ctx: ResolverContext) => {
	const fetchedUsers = await ctx.prisma.user.findMany();

	return fetchedUsers;
};

export default {
	Query: {
		user,
		users
	}
};
