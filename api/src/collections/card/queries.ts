import { Resolver } from '../../types/resolvers';

const user: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.card.findUnique({ where: { id: parent.id } }).user();
};

export default {
	Card: {
		user
	}
};
