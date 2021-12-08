const OrderTypes = `
	type Order {
		id: ID!
		userId: ID!
		storeId: ID!
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
