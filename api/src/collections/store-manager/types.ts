import gql from 'graphql-tag';

const StoreManagerTypes = gql`
	type StoreManager {
		id: ID!
		storeId: ID!
		managerId: ID!
		store: Store!
		manager: User!
	}

	input AddStoreManagerInput {
		storeId: ID!
		managerId: ID!
	}

	extend type Mutation {
		addStoreManager(input: AddStoreManagerInput): StoreManager!
		removeStoreManager(storeId: ID!, managerId: ID!): StoreManager!
	}
`;

export default StoreManagerTypes;
