import { gql } from 'apollo-server-express';

const StoreFollowerTypes = gql`
	type StoreFollower {
		id: ID!
		storeId: ID!
		followerId: ID!
		store: Store!
		follower: User!
	}

	extend type Mutation {
		followStore(storeId: ID!): Store!
		unfollowStore(storeId: ID!): Store!
	}
`;

export default StoreFollowerTypes;
