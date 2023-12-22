import { Resolver } from '../../types/resolvers';
import { payAccount } from '../../utils/paystack';

interface CreatePayoutArgs {
	input: { amount: number };
}

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

	return payout;
};

export default {
	Mutation: {
		createPayout
	}
};
