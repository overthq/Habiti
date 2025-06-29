import gql from 'graphql-tag';

const UserTypes = gql`
	type User {
		id: ID!
		name: String!
		email: String!
		suspended: Boolean!
		createdAt: String!
		updatedAt: String!

		pushTokens: [UserPushToken!]!
		carts: [Cart!]!
		orders: [Order!]!
		managed: [StoreManager!]!
		followed: [StoreFollower!]!
		watchlist: [WatchlistProduct!]!
		cards: [Card!]!
		addresses: [DeliveryAddress!]!
	}

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

	extend type Query {
		currentUser: User!
		user(id: ID!): User!
		users: [User!]!
	}

	input EditProfileInput {
		name: String
		email: String
	}

	input SavePushTokenInput {
		token: String!
		type: PushTokenType!
	}

	input DeletePushTokenInput {
		token: String!
		type: PushTokenType!
	}

	extend type Mutation {
		editProfile(input: EditProfileInput!): User!
		deleteAccount: User!
		savePushToken(input: SavePushTokenInput!): UserPushToken!
		deletePushToken(input: DeletePushTokenInput!): UserPushToken!
	}
`;

export default UserTypes;
