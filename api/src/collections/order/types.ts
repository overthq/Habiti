import { gql } from 'apollo-server-express';

const OrderTypes = gql`
	type Order {
		id: ID!
		userId: ID!
		storeId: ID!
		user: User!
		store: Store!
		products: [OrderProduct!]!
		createdAt: String!
		updatedAt: String!
	}

	type OrderProduct {
		orderId: ID!
		productId: ID!
		unitPrice: Int!
		quantity: Int!
		order: Order!
		product: Product!
	}

	extend type Query {
		order(id: ID!): Order!
		userOrders(userId: ID!): [Order!]!
		storeOrders(storeId: ID!): [Order!]!
	}

	extend type Mutation {
		createOrder(cartId: ID!): Order!
	}
`;

export default OrderTypes;
