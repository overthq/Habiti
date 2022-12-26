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

	extend type Mutation {
		createPayout(input: CreatePayoutInput!): Payout!
	}
`;

export default PayoutTypes;
