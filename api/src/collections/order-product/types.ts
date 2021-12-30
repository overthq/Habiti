import { gql } from 'apollo-server-express';

const OrderProductTypes = gql`
	type OrderProduct {
		orderId: ID!
		productId: ID!
		unitPrice: Int!
		quantity: Int!
		order: Order!
		product: Product!
	}
`;

export default OrderProductTypes;
