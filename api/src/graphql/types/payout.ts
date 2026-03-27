import gql from 'graphql-tag';

const PayoutTypes = gql`
	input VerifyBankAccountInput {
		bankAccountNumber: String!
		bankCode: String!
	}

	type VerifyBankAccountResponse {
		accountNumber: String!
		accountName: String!
	}

	extend type Mutation {
		verifyBankAccount(
			input: VerifyBankAccountInput!
		): VerifyBankAccountResponse!
	}
`;

export default PayoutTypes;
