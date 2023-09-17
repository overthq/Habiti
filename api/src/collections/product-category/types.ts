import { gql } from 'apollo-server-express';

const ProductCategoryTypes = gql`
	type ProductCategory {
		id: ID!
		productId: ID!
		categoryId: ID!

		product: Product!
		category: StoreProductCategory!
	}

	type StoreProductCategory {
		id: ID!
		name: String!
		storeId: ID!

		store: Store!
		products: [ProductCategory!]!
	}

	input CreateCategoryInput {
		name: String!
	}

	input AddProductToCategoryInput {
		productId: ID!
		categoryId: ID!
	}

	input RemoveProductFromCategoryInput {
		productId: ID!
		categoryId: ID!
	}

	extend type Mutation {
		createProductCategory(input: CreateCategoryInput!): StoreProductCategory!
		deleteProductCategory(categoryId: ID!): StoreProductCategory!
		addProductToCategory(input: AddProductToCategoryInput!): ProductCategory!
		removeProductFromCategory(
			input: RemoveProductFromCategoryInput!
		): ProductCategory!
	}
`;

export default ProductCategoryTypes;
