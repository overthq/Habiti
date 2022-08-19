import { gql } from 'apollo-server-express';

const StatsTypes = gql`
	type Stats {
		id: ID!
		storeId: ID!
		products: [Product!]!
		revenue: Int!
		orders: [Order!]!
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
