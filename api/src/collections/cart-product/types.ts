import { gql } from 'apollo-server-express';

const CartProductTypes = gql`
	type CartProduct {
		cartId: ID!
		productId: ID!
		quantity: Int!
		cart: Cart!
		product: Product!
	}
`;

export default CartProductTypes;
