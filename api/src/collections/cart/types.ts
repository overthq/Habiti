import { gql } from 'apollo-server-express';

const CartTypes = gql`
	type Cart {
		userId: ID!
		storeId: ID!
	}

	extend type Query {
		userCarts(userId: ID!): [Cart!]!
	}
`;

export default CartTypes;
