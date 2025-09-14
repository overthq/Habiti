import { Resolver } from '../../types/resolvers';
import * as CardLogic from '../../core/logic/cards';

export interface DeleteCardArgs {
	id: string;
}

export const deleteCard: Resolver<DeleteCardArgs> = async (_, { id }, ctx) => {
	return CardLogic.deleteCard(ctx, { cardId: id });
};
