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

		followedByUser: Boolean!
		cartId: ID
		products: [Product!]!
		orders: [Order!]!
		managers: [StoreManager!]!
		followers: [StoreFollower!]!
		carts: [Cart!]!
		image: Image
	}

	enum StoreStatPeriod {
		Day
		Week
		Month
		Year
	}

	input CreateStoreInput {
		name: String!
		description: String!
		website: String
		twitter: String
		instagram: String
		storeImage: Upload
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
		currentStore: Store!
		store(id: ID!): Store!
		stores: [Store!]!
	}

	extend type Mutation {
		createStore(input: CreateStoreInput!): Store!
		editStore(id: ID!, input: EditStoreInput!): Store!
		deleteStore(id: ID!): ID!
	}
`;

export default StoreTypes;
