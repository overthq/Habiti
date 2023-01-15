import { Resolver } from '../../types/resolvers';

interface DeleteCardArgs {
	id: string;
}

const deleteCard: Resolver<DeleteCardArgs> = async (_, { id }, ctx) => {
	const card = await ctx.prisma.card.findUnique({ where: { id } });

	if (card.userId === ctx.user.id) {
		return ctx.prisma.card.delete({ where: { id } });
	} else {
		throw new Error('You are not authorized to delete this card');
	}
};

export default {
	Mutation: {
		deleteCard
	}
};
