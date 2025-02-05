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

	type CartProduct {
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
		addToCart(input: AddToCartInput!): CartProduct!
		updateCartProduct(input: UpdateCartProductInput!): CartProduct!
		removeFromCart(cartId: ID!, productId: ID!): ID!
	}
`;

export default CartTypes;
