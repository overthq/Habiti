import { Resolver } from '../../types/resolvers';
import { resolveAccountNumber } from '../../utils/paystack';

interface VerifyBankAccountArgs {
	bankAccountNumber: string;
	bankCode: string;
}

const verifyBankAccount: Resolver<VerifyBankAccountArgs> = async (
	_,
	{ bankAccountNumber, bankCode }
) => {
	try {
		const data = await resolveAccountNumber(bankAccountNumber, bankCode);

		return {
			accountNumber: data.account_number,
			accountName: data.account_name
		};
	} catch (error) {
		// Should probably just throw this anyway. (Maybe prettify?)
	}
};

export default {
	Query: {
		verifyBankAccount
	}
};
