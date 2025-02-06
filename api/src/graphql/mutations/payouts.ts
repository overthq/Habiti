import { Resolver } from '../../types/resolvers';
import { payAccount, resolveAccountNumber } from '../../utils/paystack';

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
	} else if (!store.bankAccountReference) {
		throw new Error('No account reference');
	}

	const payout = await ctx.prisma.payout.create({
		data: { storeId: ctx.storeId, amount }
	});

	await payAccount(amount.toString(), payout.id, store.bankAccountReference);

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
	const data = await resolveAccountNumber(bankAccountNumber, bankCode);

	return {
		accountNumber: data.account_number,
		accountName: data.account_name
	};
};
