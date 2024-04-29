import { gql } from 'apollo-server-express';

const ProductReviewTypes = gql`
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

	input AddProductReviewInput {
		productId: ID!
		body: String
		rating: Int!
	}

	extend type Mutation {
		addProductReview(input: AddProductReviewInput!): ProductReview!
	}
`;

export default ProductReviewTypes;
