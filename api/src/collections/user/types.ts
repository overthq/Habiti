import { gql } from 'apollo-server-express';

const UserTypes = gql`
	type User {
		id: ID!
		name: String!
		phone: String!
		carts: [Cart!]!
		orders: [Order!]!
		managed: [StoreManager!]!
		followed: [StoreFollower!]!
		createdAt: String!
		updatedAt: String!
	}

	extend type Query {
		currentUser: User!
		user(id: ID!): User!
		users: [User!]!
	}

	extend type Mutation {
		deleteUser(userId: ID!): ID!
	}
`;

export default UserTypes;
