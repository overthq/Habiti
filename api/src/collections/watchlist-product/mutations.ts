import { Resolver } from '../../types/resolvers';

interface AddToWatchlistArgs {
	productId: string;
}

const addToWatchlist: Resolver<AddToWatchlistArgs> = (
	_,
	{ productId },
	ctx
) => {
	return ctx.prisma.watchlistProduct.create({
		data: {
			productId,
			userId: ctx.user.id
		}
	});
};

export default {
	Mutation: {
		addToWatchlist
	}
};
