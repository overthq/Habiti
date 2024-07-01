import gql from 'graphql-tag';

const OrderTypes = gql`
	type Order {
		id: ID!
		userId: ID!
		storeId: ID!
		status: OrderStatus!
		transactionFee: Int!
		serviceFee: Int!
		total: Int!
		createdAt: String!
		updatedAt: String!

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

	input CreateOrderInput {
		cartId: ID!
		transactionFee: Int!
		serviceFee: Int!
		cardId: ID
	}

	input UpdateOrderInput {
		status: OrderStatus
	}

	input OrderOrderByInput {
		createdAt: Sort
		updatedAt: Sort
		total: Sort
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
