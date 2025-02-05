import gql from 'graphql-tag';

const StoreTypes = gql`
	type Store {
		id: ID!
		name: String!
		description: String
		website: String
		twitter: String
		instagram: String
		realizedRevenue: Int!
		unrealizedRevenue: Int!
		paidOut: Int!
		bankAccountNumber: String
		bankCode: String
		bankAccountReference: String
		createdAt: String!
		updatedAt: String!

		followedByUser: Boolean!
		cartId: ID
		products(
			filter: ProductFilterInput
			orderBy: [ProductOrderByInput!]
			first: Int
			after: String
		): ProductConnection!
		orders(orderBy: [OrderOrderByInput!]): [Order!]!
		managers: [StoreManager!]!
		followers: [StoreFollower!]!
		carts: [Cart!]!
		payouts: [Payout!]!
		image: Image
		categories: [StoreProductCategory!]!
	}

	type StoreFollower {
		storeId: ID!
		followerId: ID!
		store: Store!
		follower: User!
	}

	type StoreManager {
		storeId: ID!
		managerId: ID!
		store: Store!
		manager: User!
	}

	input AddStoreManagerInput {
		storeId: ID!
		managerId: ID!
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
	}

	input StoreFilterInput {
		name: StringWhere
	}

	extend type Query {
		currentStore: Store!
		store(id: ID!): Store!
		stores(filter: StoreFilterInput): [Store!]!
	}

	extend type Mutation {
		createStore(input: CreateStoreInput!): Store!
		editStore(input: EditStoreInput!): Store!
		deleteStore(id: ID!): ID!
		followStore(storeId: ID!): StoreFollower!
		unfollowStore(storeId: ID!): StoreFollower!
		addStoreManager(input: AddStoreManagerInput): StoreManager!
		removeStoreManager(managerId: ID!): StoreManager!
	}
`;

export default StoreTypes;
