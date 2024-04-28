import { gql } from 'apollo-server-express';

const ProductOptionTypes = gql`
	type ProductOption {
		id: ID!
		productId: ID!
		name: String!
		description: String

		product: Product!
	}

	input AddProductOptionInput {
		productId: ID!
		name: String!
		description: String
	}

	extend type Mutation {
		addProductOption(input: AddProductOptionInput!): ProductOption!
	}
`;

export default ProductOptionTypes;
