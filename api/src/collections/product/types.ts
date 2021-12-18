import { gql } from 'apollo-server-express';

const ProductTypes = gql`
	type Product {
		id: ID!
		name: String!
		description: String!
		unitPrice: Int!
		storeId: ID!
		createdAt: String!
		updatedAt: String!

		store: Store!
		orders: [Order!]!
		carts: [CartProduct!]!
		images: [Image!]!
		watchlists: [WatchlistProduct!]!
	}

	type Image {
		id: ID!
		path: String!
		createdAt: String!
		updatedAt: String!
	}

	type WatchlistProduct {
		userId: ID!
		productId: ID!
		user: User!
		product: Product!
	}

	input CreateProductInput {
		name: String!
		description: String!
		unitPrice: Int!
		storeId: ID!
	}

	input EditProductInput {
		name: String
		description: String
		unitPrice: Int
		imageFile: Upload
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
