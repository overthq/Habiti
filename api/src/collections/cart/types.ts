import { gql } from 'apollo-server-express';

const CartTypes = gql`
	type Cart {
		id: ID!
		userId: ID!
		storeId: ID!
		createdAt: String!
		updatedAt: String!

		total: Int!
		user: User!
		store: Store!
		products: [CartProduct!]!
	}

	input CreateCartInput {
		storeId: ID!
		productId: ID!
		quantity: Int!
	}

	extend type Query {
		cart(id: ID!): Cart!
		userCart(storeId: ID!): Cart
	}

	extend type Mutation {
		createCart(input: CreateCartInput!): Cart!
		removeFromCart(cartId: ID!, productId: ID!): Product!
		deleteCart(cartId: ID!): ID!
	}
`;

export default CartTypes;
