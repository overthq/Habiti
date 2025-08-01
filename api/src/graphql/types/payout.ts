import gql from 'graphql-tag';

const PayoutTypes = gql`
	type Payout {
		id: ID!
		storeId: ID!
		amount: Int!
		status: PayoutStatus!
		createdAt: String!
		updatedAt: String!
		store: Store!
	}

	enum PayoutStatus {
		Pending
		Success
		Failure
	}

	input CreatePayoutInput {
		amount: Int!
	}

	input VerifyBankAccountInput {
		bankAccountNumber: String!
		bankCode: String!
	}

	type VerifyBankAccountResponse {
		accountNumber: String!
		accountName: String!
	}

	extend type Mutation {
		createPayout(input: CreatePayoutInput!): Payout!
		verifyBankAccount(
			input: VerifyBankAccountInput!
		): VerifyBankAccountResponse!
	}
`;

export default PayoutTypes;
