import { Resolver } from '../../types/resolvers';

// TODO:
// - Normalize the "period" data to get a date range.
// - Use the date range to fetch the needed data.
// - Probably fetch all the data in one query (or use a transaction).
// - Return the data in the correct format.
// - Consider caching results (maybe not though, since we need live data).

enum StatPeriod {
	Day = 'Day',
	Week = 'Week',
	Month = 'Month',
	Year = 'Year'
}

const getDateFromPeriod = (period: StatPeriod): Date => {
	const currentDate = new Date();

	const dateMap = {
		[StatPeriod.Day]: 1,
		[StatPeriod.Week]: 7,
		[StatPeriod.Month]: 30,
		[StatPeriod.Year]: 365
	};

	return new Date(currentDate - dateMap[period] * 24 * 60 * 60 * 1000);
};

interface StatsArgs {
	storeId: string;
	period: StatPeriod;
}

const stats: Resolver<StatsArgs> = async (_, { storeId, period }, ctx) => {
	console.log(storeId, period);
	const products = await ctx.prisma.product.findMany({
		where: {
			storeId,
			createdAt: {
				gte: getDateFromPeriod(period)
			}
		}
	});

	return null;
};

export default {
	Stats: {},
	Query: {
		stats
	}
};
