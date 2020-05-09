const OrderType = `
	type Order @entity {
		_id: ID! @id
		userId: ID! @column
		user: User! @embedded
		storeId: ID! @column
		store: Store! @embedded
		status: OrderStatus! @column
		cart: [CartItem!]! @embedded
	}

	enum OrderStatus {
		Pending
		Processing
		Delivered
	}

	type CartItem @entity {
		_id: ID! @id
		itemId: ID! @column
		item: Item! @embedded
		quantity: Int! @column
	}

	input CartItemInput {
		itemId: ID!
		quantity: Int!
	}

	input PlaceOrderInput {
		userId: ID!
		storeId: ID!
		cart: [CartItemInput!]!
	}

	extend type Mutation {
		placeOrder(input: PlaceOrderInput): Order
	}

	extend type Query {
		userOrders: [Order!]!
		storeOrders(storeId: ID!): [Order!]!
	}
`;

export default OrderType;
