import { Resolver } from '../../types/resolvers';
import { payAccount, resolveAccountNumber } from '../../core/payments';

export interface CreatePayoutArgs {
	input: { amount: number };
}

export const createPayout: Resolver<CreatePayoutArgs> = async (
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

	if (!store) {
		throw new Error('Store not found');
	}

	// Extra validation (the frontend should cover this).
	if (store.realizedRevenue < store.paidOut + amount) {
		throw new Error('Insufficient funds');
	} else if (!store.bankAccountReference || !store.bankAccountNumber) {
		throw new Error('No account details provided');
	}

	const payout = await ctx.prisma.payout.create({
		data: { storeId: ctx.storeId, amount }
	});

	await payAccount({
		amount: amount.toString(),
		reference: payout.id,
		recipient: store.bankAccountReference,
		metadata: { payoutId: payout.id }
	});

	return payout;
};

export interface VerifyBankAccountArgs {
	input: {
		bankAccountNumber: string;
		bankCode: string;
	};
}

export const verifyBankAccount: Resolver<VerifyBankAccountArgs> = async (
	_,
	{ input: { bankAccountNumber, bankCode } }
) => {
	const { data } = await resolveAccountNumber({
		accountNumber: bankAccountNumber,
		bankCode
	});

	return {
		accountNumber: data.account_number,
		accountName: data.account_name
	};
};
