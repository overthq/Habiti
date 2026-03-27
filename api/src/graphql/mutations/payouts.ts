import { Resolver } from '../../types/resolvers';
import { resolveAccountNumber } from '../../core/payments';

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
