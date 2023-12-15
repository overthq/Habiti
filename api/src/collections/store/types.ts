import { gql } from 'apollo-server-express';

const StoreTypes = gql`
	type Store {
		id: ID!
		name: String!
		description: String
		website: String
		twitter: String
		instagram: String
		revenue: Int!
		payedOut: Int!
		createdAt: String!
		updatedAt: String!

		followedByUser: Boolean!
		cartId: ID
		products: [Product!]!
		orders: [Order!]!
		managers: [StoreManager!]!
		followers: [StoreFollower!]!
		carts: [Cart!]!
		payouts: [Payout!]!
		image: Image
		categories: [StoreProductCategory!]!
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
		bankAccountNumber: String
		bankCode: String
		bankAccountReference: String
	}

	input EditStoreInput {
		name: String
		description: String
		website: String
		twitter: String
		instagram: String
		imageFile: Upload
		bankAccountNumber: String
		bankCode: String
		bankAccountReference: String
	}

	extend type Query {
		currentStore: Store!
		store(id: ID!): Store!
		stores: [Store!]!
	}

	extend type Mutation {
		createStore(input: CreateStoreInput!): Store!
		editStore(input: EditStoreInput!): Store!
		deleteStore(id: ID!): ID!
	}
`;

export default StoreTypes;
