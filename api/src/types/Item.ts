const ItemType = `
	type Item @entity {
		_id: ID! @id
		name: String! @column
		storeId: ID! @column
		store: Store! @embedded
		unit: ItemUnit @column
		pricePerUnit: Int! @column
		featured: Boolean! @column
	}

	enum ItemUnit {
		Kilogram
		Litre
	}

	input ItemInput {
		name: String!
		pricePerUnit: Int!
		unit: ItemUnit
		featured: Boolean
	}

	extend type Mutation {
		createItem(storeId: ID!, input: ItemInput): Item!
		updateItem(storeId: ID!, itemId: ID!, input: ItemInput): Item!
		deleteItem(storeId: ID!, itemId: ID!): String
	}

	extend type Query {
		storeItems(storeId: ID!): [Item!]!
		items: [Item!]!
	}
`;

export default ItemType;
