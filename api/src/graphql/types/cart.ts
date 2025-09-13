import gql from 'graphql-tag';

const CartTypes = gql`
	type Cart {
		id: ID!
		userId: ID!
		storeId: ID!
		createdAt: String!
		updatedAt: String!

		total: Int!
		fees: Fees!
		user: User!
		store: Store!
		products: [CartProduct!]!
	}

	type CartProduct {
		cartId: ID!
		productId: ID!
		quantity: Int!
		cart: Cart!
		product: Product!
	}

	type Fees {
		id: ID!
		transaction: Int!
		service: Int!
		total: Int!
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

	extend type Query {
		carts: [Cart!]!
		cart(id: ID!): Cart!
	}

	extend type Mutation {
		deleteCart(cartId: ID!): Cart!
		addToCart(input: AddToCartInput!): CartProduct!
		updateCartProduct(input: UpdateCartProductInput!): CartProduct!
		removeFromCart(cartId: ID!, productId: ID!): ID!
	}
`;

export default CartTypes;
