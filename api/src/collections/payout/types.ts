import { gql } from 'apollo-server-express';

const PayoutTypes = gql`
	type Payout {
		id: ID!
		storeId: ID!
		amount: Int!
		createdAt: String!
		updatedAt: String!
		store: Store!
	}

	input CreatePayoutInput {
		amount: Int!
	}

	type VerifyBankAccountResponse {
		accountNumber: String!
		accountName: String!
	}

	extend type Mutation {
		createPayout(input: CreatePayoutInput!): Payout!
	}

	extend type Query {
		verifyBankAccount(
			bankCode: String!
			bankAccountNumber: String!
		): VerifyBankAccountResponse!
	}
`;

export default PayoutTypes;
