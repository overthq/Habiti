import { gql } from 'apollo-server-express';

const ImageTypes = gql`
	type Image {
		id: ID!
		path: String!
		storeId: ID
		productId: ID
		createdAt: String!
		updatedAt: String!

		store: Store
		product: Product
	}
`;

export default ImageTypes;
