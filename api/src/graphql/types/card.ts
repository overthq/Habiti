import gql from 'graphql-tag';

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

	type CardAuthorization {
		id: ID!
		authorization_url: String!
		access_code: String!
		reference: String!
	}

	extend type Query {
		cardAuthorization(amount: Int): CardAuthorization!
	}

	extend type Mutation {
		deleteCard(id: ID!): Card!
	}
`;

export default CardTypes;
