const OrderTypes = `
	type Order {
		id: ID!
		userId: ID!
		storeId: ID!
		user: User!
		store: Store!
	}

	type OrderProduct {
		orderId: ID!
		productId: ID!
		quantity: Int!
		order: Order!
		product: Product!
	}

	input CreateOrderInput {
		userId: ID!
		storeId: ID!
	}

	extend type Query {
		userOrders(id: ID!): [Order!]!
		storeOrders(id: ID!): [Order!]!
	}

	extend type Mutation {
		createOrder(input: CreateOrderInput!): Order!
	}
`;

export default OrderTypes;
