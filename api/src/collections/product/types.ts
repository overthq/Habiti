import { gql } from 'apollo-server-express';

const ProductTypes = gql`
	type Product {
		name: String!
		description: String!
		unitPrice: Int!
		storeId: ID!
		store: Store!
		orders: [Order!]!
		carts: [CartProduct!]!
		createdAt: String!
		updatedAt: String!
	}

	input CreateProductInput {
		name: String!
		description: String!
		unitPrice: Int!
	}

	input EditProductInput {
		name: String
		description: String
		unitPrice: Int
	}

	extend type Query {
		product(id: ID!): Product!
		storeProducts(id: ID!): [Product!]!
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Product!
		editProduct(id: ID!, input: EditProductInput!): Product!
	}
`;

export default ProductTypes;
