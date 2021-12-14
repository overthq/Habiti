import { gql } from 'apollo-server-express';

const StoreTypes = gql`
	type Store {
		id: ID!
		name: String!
		description: String
		website: String
		twitter: String
		instagram: String
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
		description: String
		website: String
		twitter: String
		instagram: String
	}

	extend type Query {
		store(id: ID!): Store!
		stores: [Store!]!
		followedStores(userId: ID!): [Store!]!
	}

	extend type Mutation {
		createStore(input: CreateStoreInput!): Store!
		followStore(storeId: ID!): StoreFollower!
		unfollowStore(storeId: ID!): ID!
		deleteStore(id: ID!): ID!
	}
`;

export default StoreTypes;
