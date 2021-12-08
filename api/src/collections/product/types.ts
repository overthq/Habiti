const ProductTypes = `
	type Product {
		name: String!
		description: String!
		unitPrice: Int!
		storeId: ID!
		store: Store!
	}

	input CreateProductInput {
		name: String!
		description: String!
		unitPrice: Int!
	}

	extend type Query {
		product(id: ID!): Product!
		storeProducts(id: ID!): [Product!]!
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Product!
		editProduct(id: ID!): Product!
	}
`;

export default ProductTypes;
