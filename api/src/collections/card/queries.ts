import { Resolver } from '../../types/resolvers';

const user: Resolver = async (parent, _, ctx) => {
	const fetchedUser = await ctx.prisma.card
		.findUnique({ where: { id: parent.id } })
		.user();

	return fetchedUser;
};

export default {
	Card: {
		user
	}
};
