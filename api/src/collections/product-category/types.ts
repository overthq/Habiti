import gql from 'graphql-tag';

const ProductCategoryTypes = gql`
	type ProductCategory {
		id: ID!
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

	input AddProductToCategoryInput {
		productId: ID!
		categoryId: ID!
	}

	input RemoveProductFromCategoryInput {
		productId: ID!
		categoryId: ID!
	}

	extend type Query {
		storeProductCategory(id: ID!): StoreProductCategory
	}

	extend type Mutation {
		createProductCategory(input: CreateCategoryInput!): StoreProductCategory!
		editProductCategory(
			categoryId: ID!
			input: EditCategoryInput!
		): StoreProductCategory!
		deleteProductCategory(categoryId: ID!): StoreProductCategory!
		addProductToCategory(input: AddProductToCategoryInput!): ProductCategory!
		removeProductFromCategory(
			input: RemoveProductFromCategoryInput!
		): ProductCategory!
	}
`;

export default ProductCategoryTypes;
