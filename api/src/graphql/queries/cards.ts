import { Resolver } from '../../types/resolvers';
import * as CardLogic from '../../core/logic/cards';

const user: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.card.findUnique({ where: { id: parent.id } }).user();
};

export interface CardAuthorizationArgs {
	orderId?: string;
}

const cardAuthorization: Resolver<CardAuthorizationArgs> = async (
	_,
	{ orderId },
	ctx
) => {
	return CardLogic.authorizeCard(ctx, { orderId });
};

export default {
	Query: {
		cardAuthorization
	},
	Card: {
		user
	}
};
