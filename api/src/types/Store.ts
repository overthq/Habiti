const StoreType = `
	type Store @entity {
		_id: ID! @id
		shortName: String! @column
		name: String! @column
		websiteUrl: String @column
		instagramUsername: String @column
		twitterUsername: String @column
	}

	input StoreInput {
		name: String
		shortName: String
		websiteUrl: String
		instagramUsername: String
		twitterUsername: String
	}

	extend type Query {
		store(storeId: ID!): Store!
		stores: [Store!]!
	}

	extend type Mutation {
		createStore(input: StoreInput): Store!
		updateStore(input: StoreInput): Store!
	}
`;

export default StoreType;
