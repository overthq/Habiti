import { Resolver } from '../../types/resolvers';
import { payAccount } from '../../utils/paystack';

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

	const store = await ctx.prisma.store.findUnique({
		where: { id: ctx.storeId }
	});

	// Extra validation (the frontend should cover this).
	if (store.revenue < store.payedOut + amount) {
		throw new Error('Insufficient funds');
	} else if (!store.bankAccountReference) {
		throw new Error('No account reference');
	}

	const payout = await ctx.prisma.payout.create({
		data: { storeId: ctx.storeId, amount }
	});

	await payAccount(amount.toString(), payout.id, store.bankAccountReference);

	// TODO: Move this to webhook, making it easy to revert if the third party fails.
	// 	await ctx.prisma.store.update({
	// 		where: { id: ctx.storeId },
	// 		data: { payedOut: { increment: amount } }
	// 	});

	return payout;
};

export default {
	Mutation: {
		createPayout
	}
};
