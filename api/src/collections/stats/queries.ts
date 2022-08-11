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

const dateMap = {
	[StatPeriod.Day]: 1,
	[StatPeriod.Week]: 7,
	[StatPeriod.Month]: 30,
	[StatPeriod.Year]: 365
};

const getDateFromPeriod = (period: StatPeriod): Date => {
	const currentDate = new Date();

	return new Date(
		currentDate.getTime() - dateMap[period] * 24 * 60 * 60 * 1000
	);
};

interface StatsArgs {
	storeId: string;
	period: StatPeriod;
}

const stats: Resolver<StatsArgs> = async (_, { storeId, period }, ctx) => {
	const marker = getDateFromPeriod(period);

	const products = await ctx.prisma.product.findMany({
		where: {
			storeId,
			createdAt: { gte: marker }
		}
	});

	const orders = await ctx.prisma.order.findMany({
		where: {
			storeId,
			createdAt: { gte: marker }
		}
	});

	// This does not work, because we need to add the order "total"
	// to the orders table, instead of relying on computing it from the
	// order products every time.
	// However, if we do this, it means that that column has to be updated
	// every time an order product is deleted/updated.

	const projectedRevenue = await ctx.prisma.order.aggregate({
		where: {
			storeId,
			createdAt: { gte: marker }
		},
		_count: {
			_all: true
		}
	});

	await ctx.prisma.orderProduct.aggregate({
		where: {
			order: {
				storeId,
				createdAt: { gte: marker }
			}
		},
		_count: {
			unitPrice: true
		}
	});

	return { products, orders, projectedRevenue };
};

// const pendingOrders : Resolver = async () => {
// }

// const newOrders: Resolver = async () => {
// }

// const revenue: Resolver = async () => {
// };

const id: Resolver = parent => {
	return parent.storeId;
};

export default {
	Stats: {
		id
	},
	Query: {
		stats
	}
};
