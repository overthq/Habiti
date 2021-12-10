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
		cart: Cart!
		product: Product!
	}

	input CreateCartInput {
		userId: ID!
		storeId: ID!
	}

	extend type Query {
		cart(id: ID!): Cart!
		userCarts(userId: ID!): [Cart!]!
	}
`;

export default CartTypes;
