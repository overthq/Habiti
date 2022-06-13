import { gql } from 'apollo-server-express';

const WatchlistProductTypes = gql`
	type WatchlistProduct {
		id: ID!
		userId: ID!
		productId: ID!
		user: User!
		product: Product!
	}
`;

export default WatchlistProductTypes;
