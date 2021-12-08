const ProductTypes = `
	type Product {
		name: String!
	}

	input CreateProductInput {
		name: String!
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
