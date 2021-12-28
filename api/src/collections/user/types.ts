import { gql } from 'apollo-server-express';

const UserTypes = gql`
	type User {
		id: ID!
		name: String!
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
		phone: String
	}

	extend type Mutation {
		editProfile(input: EditProfileInput!): User!
		deleteUser(userId: ID!): ID!
	}
`;

export default UserTypes;
