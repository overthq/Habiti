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

	type WatchlistProduct {
		id: ID!
		userId: ID!
		productId: ID!
		user: User!
		product: Product!
	}

	type ProductReview {
		id: ID!
		productId: ID!
		body: String
		rating: Int!
		createdAt: String!
		updatedAt: String!

		user: User!
		product: Product!
	}

	type ProductOption {
		id: ID!
		productId: ID!
		name: String!
		description: String

		product: Product!
	}

	type ProductCategory {
		productId: ID!
		categoryId: ID!

		product: Product!
		category: StoreProductCategory!
	}

	type ProductCategoryEdge {
		cursor: String!
		node: ProductCategory
	}

	type StoreProductCategory {
		id: ID!
		storeId: ID!
		name: String!
		description: String

		store: Store!
		products: [ProductCategory!]!
	}

	input CreateCategoryInput {
		name: String!
		description: String
	}

	input EditCategoryInput {
		name: String
		description: String
	}

	input UpdateProductCategoriesInput {
		add: [ID!]!
		remove: [ID!]!
	}

	input AddProductOptionInput {
		productId: ID!
		name: String!
		description: String
	}

	input AddProductReviewInput {
		productId: ID!
		body: String
		rating: Int!
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
		storeProductCategory(id: ID!): StoreProductCategory
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Product!
		editProduct(id: ID!, input: EditProductInput!): Product!
		deleteProduct(id: ID!): Product!
		updateProductImages(id: ID!, input: UpdateProductImagesInput!): Product!
		addToWatchlist(productId: ID!): WatchlistProduct!
		addProductReview(input: AddProductReviewInput!): ProductReview!
		addProductOption(input: AddProductOptionInput!): ProductOption!
		createProductCategory(input: CreateCategoryInput!): StoreProductCategory!
		editProductCategory(
			categoryId: ID!
			input: EditCategoryInput!
		): StoreProductCategory!
		deleteProductCategory(categoryId: ID!): StoreProductCategory!
		updateProductCategories(
			id: ID!
			input: UpdateProductCategoriesInput!
		): Product!
	}
`;

export default ProductTypes;
