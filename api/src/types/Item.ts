const ItemType = `
	type Item @entity {
		_id: ID! @id
		name: String! @column
		description: String! @column
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
		description: String!
		pricePerUnit: Int!
		unit: ItemUnit
		featured: Boolean
	}

	extend type Mutation {
		createItem(input: ItemInput): Item!
		updateItem(itemId: ID!, input: ItemInput): Item!
		deleteItem(itemId: ID!): String!
	}

	extend type Query {
		storeItems: [Item!]!
		items: [Item!]!
	}
`;

export default ItemType;
