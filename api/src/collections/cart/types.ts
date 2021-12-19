import { gql } from 'apollo-server-express';

const CartTypes = gql`
	type Cart {
		id: ID!
		userId: ID!
		storeId: ID!
		createdAt: String!
		updatedAt: String!

		user: User!
		store: Store!
		products: [CartProduct!]!
		product(id: ID!): CartProduct
	}

	type CartProduct {
		cartId: ID!
		productId: ID!
		quantity: Int!
		cart: Cart!
		product: Product!
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
		addProductToCart(input: AddProductToCartInput!): Cart!
		removeProductFromCart(cartId: ID!, productId: ID!): ID!
		deleteCart(cartId: ID!): ID!
		updateCartProduct(input: UpdateCartProductInput!): CartProduct!
	}
`;

export default CartTypes;
