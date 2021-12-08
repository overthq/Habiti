const StoreTypes = `
	type Store {
		name: String!
	}

	type StoreFollower {
		userId: ID!
		storeId: ID!
		user: User!
		store: Store!
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
		followStore(userId: ID!, storeId: ID!): Boolean!
		deleteStore(id: ID!): ID!
	}
`;

export default StoreTypes;
