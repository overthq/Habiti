import { gql } from 'apollo-server-express';

const OrderTypes = gql`
	type Order {
		id: ID!
		userId: ID!
		storeId: ID!
		status: OrderStatus!
		createdAt: String!
		updatedAt: String!

		total: Int!
		user: User!
		store: Store!
		products: [OrderProduct!]!
	}

	enum OrderStatus {
		Pending
		Processing
		Cancelled
		Completed
		Delivered
	}

	type Filter {
		first: Int
		last: Int
	}

	type IntWhere {
		gt: Int
		lt: Int
		lte: Int
		gte: Int
	}

	type StringWhere {
		contains: String
	}

	input CreateOrderInput {
		cartId: ID!
		cardId: ID
	}

	input UpdateOrderInput {
		status: OrderStatus
	}

	extend type Query {
		order(id: ID!): Order!
	}

	extend type Mutation {
		createOrder(input: CreateOrderInput!): Order!
		updateOrder(orderId: ID!, input: UpdateOrderInput!): Order!
	}
`;

export default OrderTypes;
