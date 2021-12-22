import { gql } from 'apollo-server-express';

const StoreManagerTypes = gql`
	type StoreManager {
		storeId: ID!
		managerId: ID!
		store: Store!
		manager: User!
	}
`;

export default StoreManagerTypes;
