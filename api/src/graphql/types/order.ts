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

	type OrderProduct {
		orderId: ID!
		productId: ID!
		unitPrice: Int!
		quantity: Int!
		order: Order!
		product: Product!
	}

	enum OrderStatus {
		Pending
		Processing
		Cancelled
		Completed
		Delivered
		PaymentPending
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

	input OrderFilterInput {
		total: IntWhere
	}

	type OrderEdge {
		cursor: String!
		node: Order!
	}

	type OrderConnection {
		edges: [OrderEdge!]!
		pageInfo: PageInfo!
		totalCount: Int!
	}

	extend type Query {
		order(id: ID!): Order!
		orders(
			first: Int
			after: String
			last: Int
			before: String
			filter: OrderFilterInput
			orderBy: [OrderOrderByInput!]
		): OrderConnection!
	}

	extend type Mutation {
		createOrder(input: CreateOrderInput!): Order!
		updateOrder(orderId: ID!, input: UpdateOrderInput!): Order!
		updateOrderStatus(orderId: ID!, status: OrderStatus!): Order!
	}
`;

export default OrderTypes;
