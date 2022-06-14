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
	# cartId should probably be optional,
	# so this becomes an upsert mutation
	# and we can delete "createCart"
	# In that case though, we might need to
	# accept a storeId instead of a cartId.
	# Interesting.

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
	}
`;

export default CartProductTypes;
