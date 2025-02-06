import { Resolver } from '../../types/resolvers';

export interface DeleteCardArgs {
	id: string;
}

export const deleteCard: Resolver<DeleteCardArgs> = async (_, { id }, ctx) => {
	const card = await ctx.prisma.card.findUnique({ where: { id } });

	if (!card) {
		throw new Error('Card not found');
	}

	if (card.userId === ctx.user.id) {
		return ctx.prisma.card.delete({ where: { id } });
	} else {
		throw new Error('You are not authorized to delete this card');
	}
};
