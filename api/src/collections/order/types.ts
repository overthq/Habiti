import { gql } from 'apollo-server-express';

const OrderTypes = gql`
	type Order {
		id: ID!
		userId: ID!
		storeId: ID!
		status: OrderStatus!
		total: Int!
		user: User!
		store: Store!
		products: [OrderProduct!]!
		createdAt: String!
		updatedAt: String!
	}

	enum OrderStatus {
		Pending
		Cancelled
		Delivered
	}

	extend type Query {
		order(id: ID!): Order!
	}

	extend type Mutation {
		createOrder(cartId: ID!): Order!
	}
`;

export default OrderTypes;
