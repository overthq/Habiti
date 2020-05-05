const ItemType = `
	type Item @entity {
		_id: ID! @id
		name: String! @column
		storeId: ID! @column
		store: Store! @embedded
		unit: ItemUnit @column
		pricePerUnit: Int! @column
	}

	enum ItemUnit {
		Kilograms
		Litres
	}

	input ItemInput {
		name: String!
		pricePerUnit: Int!
		unit: ItemUnit
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
