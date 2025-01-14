import gql from 'graphql-tag';

const ImageTypes = gql`
	type Image {
		id: ID!
		path: String!
		publicId: String!
		storeId: ID
		productId: ID
		createdAt: String!
		updatedAt: String!

		store: Store
		product: Product
	}

	extend type Mutation {
		deleteImage(id: ID!): Image!
		deleteImages(imageIds: [ID!]!): [Image!]!
	}
`;

export default ImageTypes;
