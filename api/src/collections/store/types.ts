import { gql } from 'apollo-server-express';

const StoreTypes = gql`
	type Store {
		id: ID!
		name: String!
		description: String
		website: String
		twitter: String
		instagram: String
		createdAt: String!
		updatedAt: String!

		products: [Product!]!
		orders: [Order!]!
		managers: [StoreManager!]!
		followers: [StoreFollower!]!
		carts: [Cart!]!
		image: Image
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
		description: String!
		website: String
		twitter: String
		instagram: String
		imageFile: Upload
	}

	input EditStoreInput {
		name: String
		description: String
		website: String
		twitter: String
		instagram: String
		imageFile: Upload
	}

	extend type Query {
		store(id: ID!): Store!
		stores: [Store!]!
	}

	extend type Mutation {
		createStore(input: CreateStoreInput!): Store!
		editStore(id: ID!, input: EditStoreInput!): Store!
		followStore(storeId: ID!): Store!
		unfollowStore(storeId: ID!): Store!
		deleteStore(id: ID!): ID!
	}
`;

export default StoreTypes;
