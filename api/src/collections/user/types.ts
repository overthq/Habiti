import gql from 'graphql-tag';

const UserTypes = gql`
	type User {
		id: ID!
		name: String!
		email: String!
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

	extend type Query {
		currentUser: User!
		user(id: ID!): User!
		users: [User!]!
	}

	input EditProfileInput {
		name: String
		email: String
	}

	input RegisterInput {
		name: String!
		email: String!
		password: String!
	}

	input AuthenticateInput {
		email: String!
		password: String!
	}

	input VerifyInput {
		email: String!
		code: String!
	}

	type AuthenticateResponse {
		accessToken: String!
		userId: ID!
	}

	type VerifyResponse {
		accessToken: String!
		userId: ID!
	}

	extend type Mutation {
		authenticate(input: AuthenticateInput!): AuthenticateResponse!
		register(input: RegisterInput!): User!
		verify(input: VerifyInput!): VerifyResponse!
		editProfile(input: EditProfileInput!): User!
		deleteUser(userId: ID!): User!
		deleteAccount: User!
	}
`;

export default UserTypes;
