import gql from 'graphql-tag';

const CartProductTypes = gql`
	type CartProduct {
		id: ID!
		cartId: ID!
		productId: ID!
		quantity: Int!
		cart: Cart!
		product: Product!
	}

	input AddToCartInput {
		storeId: ID!
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
