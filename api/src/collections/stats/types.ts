import { gql } from 'apollo-server-express';

const StatsTypes = gql`
	type Stats {
		storeId: ID!
		store: Store!
		revenue: ID!
		pendingOrders: Int!
		newOrders: Int!
	}

	enum StatPeriod {
		Day
		Week
		Month
		Year
	}

	extend type Query {
		stats(storeId: ID!, period: StatPeriod): Stats!
	}
`;

export default StatsTypes;
