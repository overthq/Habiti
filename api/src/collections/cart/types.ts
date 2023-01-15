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
		# productsAggregate: Aggregate!
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
		deleteCart(cartId: ID!): Cart!
	}

	# We can't use type here, since it's not an entity (entities require IDs).
	# I don't have the time to start creating a scalar right now.
	# However, if you do, feel free to implement this.

	# type Aggregate {
	# 	count: Int!
	# }
`;

export default CartTypes;
