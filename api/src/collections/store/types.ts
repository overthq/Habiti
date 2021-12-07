const StoreTypes = `
	type Store {
		name: String!
	}

	input CreateStoreInput {
		name: String!
	}

	extend type Query {
		store: Store!
		stores: [Store!]!
	}
`;

export default StoreTypes;
