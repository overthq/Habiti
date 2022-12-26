import { Resolver } from '../../types/resolvers';

// TODO: Remove placeholder
interface CreatePayoutArgs {
	input: {
		amount: number;
	};
}

const createPayout: Resolver<CreatePayoutArgs> = async (
	_,
	{ input: { amount } },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('No storeId provided');
	}

	const [payout] = await ctx.prisma.$transaction([
		ctx.prisma.payout.create({ data: { storeId: ctx.storeId, amount } }),
		ctx.prisma.store.update({
			where: { id: ctx.storeId },
			data: { payedOut: { increment: amount } }
		})
	]);

	return payout;
};

export default {
	Mutation: {
		createPayout
	}
};
