import gql from 'graphql-tag';

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
		orders(orderBy: [OrderOrderByInput!]): [Order!]!
		carts: [CartProduct!]!
		images: [Image!]!
		watchlists: [WatchlistProduct!]!
		categories: [ProductCategory!]!
		reviews: [ProductReview!]!
		options: [ProductOption!]!
		relatedProducts: [Product!]!
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

	input ProductFilterInput {
		name: StringWhere
		unitPrice: IntWhere
		quantity: IntWhere
		categories: CategoriesWhere
	}

	input UpdateProductImagesInput {
		add: [Upload!]!
		remove: [ID!]!
	}

	input CategoriesWhere {
		every: ProductCategoryWhere
		some: ProductCategoryWhere
		none: ProductCategoryWhere
	}

	input ProductCategoryWhere {
		productId: StringWhere
		categoryId: StringWhere
	}

	type ProductEdge {
		cursor: String!
		node: Product!
	}

	type ProductConnection {
		edges: [ProductEdge!]!
		pageInfo: PageInfo!
		totalCount: Int!
	}

	extend type Query {
		product(id: ID!): Product!
		products(
			first: Int
			after: String
			last: Int
			before: String
			filter: ProductFilterInput
			orderBy: [ProductOrderByInput!]
		): ProductConnection!
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Product!
		editProduct(id: ID!, input: EditProductInput!): Product!
		deleteProduct(id: ID!): Product!
		updateProductImages(id: ID!, input: UpdateProductImagesInput!): Product!
	}
`;

export default ProductTypes;
