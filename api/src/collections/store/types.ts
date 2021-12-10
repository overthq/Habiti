import { gql } from 'apollo-server-express';

const StoreTypes = gql`
	type Store {
		id: ID!
		name: String!
		products: [Product!]!
		orders: [Order!]!
		managers: [StoreManager!]!
		followers: [StoreFollower!]!
		carts: [Cart!]!
		createdAt: String!
		updatedAt: String!
	}

	type StoreManager {
		storeId: ID!
		managerId: ID!
		store: Store!
		manager: User!
	}

	type StoreFollower {
		storeId: ID!
		followerId: ID!
		store: Store!
		follower: User!
	}

	input CreateStoreInput {
		name: String!
	}

	extend type Query {
		store: Store!
		stores: [Store!]!
		followedStores(userId: ID!): [Store!]!
	}

	extend type Mutation {
		createStore(input: CreateStoreInput!): Store!
		followStore(userId: ID!, storeId: ID!): StoreFollower!
		deleteStore(id: ID!): ID!
	}
`;

export default StoreTypes;
