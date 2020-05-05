const StoreType = `
	type Store @entity {
		name: String! @column
	}

	input StoreInput {
		name: String
	}

	extend type Query {
		stores: [Store!]!
	}

	extend type Mutation {
		createStore(input: StoreInput): Store!
		updateStore(input: StoreInput): Store!
	}
`;

export default StoreType;
