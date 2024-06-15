import gql from 'graphql-tag';

const OrderProductTypes = gql`
	type OrderProduct {
		id: ID!
		orderId: ID!
		productId: ID!
		unitPrice: Int!
		quantity: Int!
		order: Order!
		product: Product!
	}
`;

export default OrderProductTypes;
