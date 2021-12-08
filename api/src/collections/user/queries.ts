import { ResolverContext } from '../../types/resolvers';

const user = async (_, { id }, ctx: ResolverContext) => {
	const fetchedUser = ctx.prisma.user.findUnique({ where: { id } });

	return fetchedUser;
};

const users = async () => {};

export default {
	Query: {
		user,
		users
	}
};
