import { Resolver } from '../../types/resolvers';

interface AddToWatchlistArgs {
	productId: string;
}

const addToWatchlist: Resolver<AddToWatchlistArgs> = async (
	_,
	{ productId },
	ctx
) => {
	const watchlistProduct = await ctx.prisma.watchlistProduct.create({
		data: {
			productId,
			userId: ctx.user.id
		}
	});

	return watchlistProduct;
};

export default {
	Mutation: {
		addToWatchlist
	}
};
