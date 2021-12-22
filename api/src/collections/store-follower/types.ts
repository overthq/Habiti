import { gql } from 'apollo-server-express';

const StoreFollowerTypes = gql`
	type StoreFollower {
		storeId: ID!
		followerId: ID!
		store: Store!
		follower: User!
	}
`;

export default StoreFollowerTypes;
