import gql from 'graphql-tag';

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
		carts: [Cart!]!
		cart(id: ID!): Cart!
	}

	extend type Mutation {
		createCart(input: CreateCartInput!): Cart!
		deleteCart(cartId: ID!): Cart!
	}
`;

export default CartTypes;
