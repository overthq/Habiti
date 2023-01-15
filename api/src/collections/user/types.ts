import { gql } from 'apollo-server-express';

const UserTypes = gql`
	type User {
		id: ID!
		name: String!
		email: String!
		phone: String!
		createdAt: String!
		updatedAt: String!

		carts: [Cart!]!
		orders: [Order!]!
		managed: [StoreManager!]!
		followed: [StoreFollower!]!
		watchlist: [WatchlistProduct!]!
		cards: [Card!]!
	}

	extend type Query {
		currentUser: User!
		user(id: ID!): User!
		users: [User!]!
	}

	input EditProfileInput {
		name: String
		email: String
		phone: String
	}

	input RegisterInput {
		name: String!
		email: String!
		phone: String!
	}

	input AuthenticateInput {
		phone: String!
	}

	input VerifyInput {
		phone: String!
		code: String!
	}

	type AuthenticateResponse {
		message: String
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
