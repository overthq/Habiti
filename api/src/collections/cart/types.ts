import { gql } from 'apollo-server-express';

const CartTypes = gql`
	type Cart {
		id: ID!
		userId: ID!
		storeId: ID!
		user: User!
		store: Store!
		products: [CartProduct!]!
		createdAt: String!
		updatedAt: String!
	}

	type CartProduct {
		cartId: ID!
		productId: ID!
		quantity: Int!
		cart: Cart!
		product: Product!
	}

	input CreateCartInput {
		userId: ID!
		storeId: ID!
	}

	input AddProductToCartInput {
		cartId: ID
		storeId: ID!
		productId: ID!
		quantity: Int
	}

	extend type Query {
		cart(id: ID!): Cart!
		userCarts(userId: ID!): [Cart!]!
	}

	extend type Mutation {
		addProductToCart(input: AddProductToCartInput!): Cart!
		removeProductFromCart(cartId: ID!, productId: ID!): ID!
		deleteCart(cartId: ID!): ID!
	}
`;

export default CartTypes;
