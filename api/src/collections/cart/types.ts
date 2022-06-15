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
		productsAggregate: Aggregate!
	}

	input CreateCartInput {
		storeId: ID!
		productId: ID!
		quantity: Int!
	}

	extend type Query {
		carts: [Cart!]!
		cart(id: ID!): Cart!
	}

	extend type Mutation {
		createCart(input: CreateCartInput!): Cart!
		deleteCart(cartId: ID!): ID!
	}

	# Spitballing:
	# We should have an aggregate type that we use for all
	# array connections (mostly for count though).
	type Aggregate {
		count: Int!
	}
`;

export default CartTypes;
