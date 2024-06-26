import gql from 'graphql-tag';

const StoreFollowerTypes = gql`
	type StoreFollower {
		id: ID!
		storeId: ID!
		followerId: ID!
		store: Store!
		follower: User!
	}

	extend type Mutation {
		followStore(storeId: ID!): StoreFollower!
		unfollowStore(storeId: ID!): StoreFollower!
	}
`;

export default StoreFollowerTypes;
