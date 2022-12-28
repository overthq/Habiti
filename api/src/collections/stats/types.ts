import { gql } from 'apollo-server-express';

const StatsTypes = gql`
	type Stats {
		id: ID!
		storeId: ID!
		products: [Product!]!
		revenue: Int!
		orders: [Order!]!
		pendingOrderCount: Int!
	}

	type NewStats {
		daily: Stats!
		weekly: Stats!
		monthly: Stats!
		yearly: Stats!
	}

	enum StatPeriod {
		Day
		Week
		Month
		Year
	}

	extend type Query {
		stats(period: StatPeriod): Stats!
	}
`;

export default StatsTypes;
