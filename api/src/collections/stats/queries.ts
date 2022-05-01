import { Resolver } from '../../types/resolvers';

// TODO:
// - Normalize the "period" data to get a date range.
// - Use the date range to fetch the needed data.
// - Probably fetch all the data in one query (or use a transaction).
// - Return the data in the correct format.
// - Consider caching results (maybe not though, since we need live data).

interface StatsArgs {
	storeId: string;
	period: 'Day' | 'Week' | 'Month' | 'Year';
}

const stats: Resolver<StatsArgs> = async (_, { storeId, period }) => {
	console.log(storeId, period);
	return null;
};

export default {
	Stats: {},
	Query: {
		stats
	}
};
