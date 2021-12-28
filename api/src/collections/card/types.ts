import { gql } from 'apollo-server-express';

const CardTypes = gql`
	type Card {
		id: ID!
		userId: ID!
		email: String!
		authorizationCode: String!
		cardType: String!
		last4: String!
		expMonth: String!
		expYear: String!
		bin: String!
		bank: String!
		signature: String!
		countryCode: String!
		user: User!
	}

	extend type Mutation {
		deleteCard(id: ID!): Card!
	}
`;

export default CardTypes;
