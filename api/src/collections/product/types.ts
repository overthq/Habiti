import { gql } from 'apollo-server-express';

const ProductTypes = gql`
	type Product {
		id: ID!
		name: String!
		description: String!
		unitPrice: Int!
		quantity: Int!
		storeId: ID!
		createdAt: String!
		updatedAt: String!

		inCart: Boolean!
		store: Store!
		orders: [Order!]!
		carts: [CartProduct!]!
		images: [Image!]!
		watchlists: [WatchlistProduct!]!
		categories: [ProductCategory!]!
	}

	input CreateProductInput {
		name: String!
		description: String!
		unitPrice: Int!
		quantity: Int!
		imageFiles: [Upload!]!
	}

	input EditProductInput {
		name: String
		description: String
		unitPrice: Int
		quantity: Int
		imageFiles: [Upload!]!
	}

	input ProductOrderByInput {
		createdAt: Sort
		updatedAt: Sort
		unitPrice: Sort
	}

	extend type Query {
		product(id: ID!): Product!
		storeProducts(storeId: ID!, orderBy: [ProductOrderByInput!]): [Product!]!
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Product!
		editProduct(id: ID!, input: EditProductInput!): Product!
		deleteProduct(id: ID!): Product!
	}
`;

export default ProductTypes;
