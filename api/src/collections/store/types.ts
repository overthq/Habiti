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
		): [Product!]!
		orders(orderBy: [OrderOrderByInput!]): [Order!]!
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
	}
`;

export default StoreTypes;
