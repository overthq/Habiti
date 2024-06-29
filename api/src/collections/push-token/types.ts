import gql from 'graphql-tag';

const PushTokenTypes = gql`
	type UserPushToken {
		id: ID!
		userId: String!
		token: String!
		type: PushTokenType!
	}

	enum PushTokenType {
		Shopper
		Merchant
	}
`;

export default PushTokenTypes;
