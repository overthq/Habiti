import { gql } from 'apollo-server-express';

const PayoutTypes = gql`
	type Payout {
		id: ID!
		storeId: ID!
		amount: Int!
		createdAt: String!
		updatedAt: String!
		store: Store!
		method: PayoutMethod
	}

	type PayoutMethod {
		id: ID!
		storeId: ID!
		store: Store!
		provider: PayoutProvider!
	}

	enum PayoutProvider {
		BankAccount
	}

	input CreatePayoutInput {
		amount: Int!
	}

	extend type Query {
		payouts: [Payout!]!
	}

	extend type Mutation {
		createPayout(input: CreatePayoutInput!): Payout!
	}
`;

export default PayoutTypes;
