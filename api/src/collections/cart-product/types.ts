import { gql } from 'apollo-server-express';

const CartProductTypes = gql`
	type CartProduct {
		id: ID!
		cartId: ID!
		productId: ID!
		quantity: Int!
		cart: Cart!
		product: Product!
	}

	# Small refactor:
	# We should add a cart product input as part of the
	# createCart mutation.

	input AddToCartInput {
		cartId: ID!
		productId: ID!
		quantity: Int
	}

	input UpdateCartProductInput {
		cartId: ID!
		productId: ID!
		quantity: Int!
	}

	extend type Mutation {
		addToCart(input: AddToCartInput!): CartProduct!
		updateCartProduct(input: UpdateCartProductInput!): CartProduct!
		removeFromCart(cartId: ID!, productId: ID!): ID!
	}
`;

export default CartProductTypes;
