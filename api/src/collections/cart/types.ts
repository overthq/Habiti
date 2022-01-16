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
		product(id: ID!): CartProduct
	}

	input CreateCartInput {
		storeId: ID!
		productId: ID!
		quantity: Int!
	}

	input AddProductToCartInput {
		cartId: ID!
		productId: ID!
		quantity: Int
	}

	input UpdateCartProductInput {
		cartId: ID!
		productId: ID!
		quantity: Int!
	}

	extend type Query {
		cart(id: ID!): Cart!
		userCarts(userId: ID!): [Cart!]!
		userCart(storeId: ID!): Cart
	}

	extend type Mutation {
		createCart(input: CreateCartInput!): Cart!
		addProductToCart(input: AddProductToCartInput!): Product!
		removeProductFromCart(cartId: ID!, productId: ID!): Cart!
		deleteCart(cartId: ID!): ID!
		updateCartProduct(input: UpdateCartProductInput!): CartProduct!
	}
`;

export default CartTypes;
