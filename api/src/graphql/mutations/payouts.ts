import { Resolver } from '../../types/resolvers';
import { resolveAccountNumber } from '../../core/payments';
import { storeAuthorizedResolver } from '../permissions';
import * as PayoutLogic from '../../core/logic/payouts';

export interface CreatePayoutArgs {
	input: { amount: number };
}

export const createPayout = storeAuthorizedResolver<CreatePayoutArgs>(
	(_, { input: { amount } }, ctx) => {
		return PayoutLogic.createPayout(ctx, { amount });
	}
);

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
