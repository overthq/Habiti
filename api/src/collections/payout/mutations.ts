import { Resolver } from '../../types/resolvers';

interface CreatePayoutArgs {
	input: {
		amount: number;
	};
}

// TODO: We should probably move all the logic into individual functions,
// to make it easier to test, debug and enhance.

const createPayout: Resolver<CreatePayoutArgs> = async (
	_,
	{ input: { amount } },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('No storeId provided');
	}

	// Pre-payout.
	// - Check if there all preconditions are met. e.g. existing disputes.

	const store = await ctx.prisma.store.findUnique({
		where: { id: ctx.storeId }
	});

	// Extra validation (the frontend should cover this).
	if (store.revenue < store.payedOut + amount) {
		throw new Error('Insufficient funds');
	}

	// Run actual payout function.
	// - Create a transaction reference.
	// - Use transaction reference to create payout.
	// - Make this easy to revert if the third party fails.

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
