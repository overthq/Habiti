import { Resolver } from '../../types/resolvers';
import { payAccount, resolveAccountNumber } from '../../utils/paystack';

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

	console.log({ store });

	// Extra validation (the frontend should cover this).
	if (store.realizedRevenue < store.payedOut + amount) {
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

interface VerifyBankAccountArgs {
	input: {
		bankAccountNumber: string;
		bankCode: string;
	};
}

const verifyBankAccount: Resolver<VerifyBankAccountArgs> = async (
	_,
	{ input: { bankAccountNumber, bankCode } }
) => {
	const data = await resolveAccountNumber(bankAccountNumber, bankCode);

	return {
		accountNumber: data.account_number,
		accountName: data.account_name
	};
};

export default {
	Mutation: {
		createPayout,
		verifyBankAccount
	}
};
