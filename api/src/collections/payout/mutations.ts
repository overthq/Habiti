import { Resolver } from '../../types/resolvers';

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

	// Run actual payout function.
	// - Create a transaction reference.
	// - Use transaction reference to create payout.

	return payout;
};

export default {
	Mutation: {
		createPayout
	}
};
