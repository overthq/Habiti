import { Resolver } from '../../types/resolvers';
import { initialCharge } from '../../utils/paystack';

const user: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.card.findUnique({ where: { id: parent.id } }).user();
};

interface CardAuthorizationArgs {
	amount?: number;
}

const cardAuthorization: Resolver<CardAuthorizationArgs> = async (
	_,
	{ amount },
	ctx
) => {
	const { data } = await initialCharge(ctx.user.email, amount);

	return { id: data.access_code, ...data };
};

export default {
	Query: {
		cardAuthorization
	},
	Card: {
		user
	}
};
