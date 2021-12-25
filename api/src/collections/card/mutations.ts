import { Resolver } from '../../types/resolvers';

interface DeleteCardArgs {
	id: string;
}

const deleteCard: Resolver<DeleteCardArgs> = async (_, { id }, ctx) => {
	const card = await ctx.prisma.card.findUnique({ where: { id } });

	if (card.userId === ctx.user.id) {
		const card = await ctx.prisma.card.delete({ where: { id } });
		return card;
	}
};

export default {
	Mutation: {
		deleteCard
	}
};
