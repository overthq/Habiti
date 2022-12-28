import { Resolver } from '../../types/resolvers';

const dateMap = {
	Day: 1,
	Week: 7,
	Month: 30,
	Year: 365
} as const;

type StatPeriod = keyof typeof dateMap;

const getDateFromPeriod = (period: StatPeriod) => {
	return new Date(new Date().getTime() - dateMap[period] * 86400000);
};

interface StatsArgs {
	period: StatPeriod;
}

// Stats:
// - Number of new products in selected timeframe.
// - Number of new orders in selected timeframe (pending orders).
// - Number of new customers.

// Note: At first, we will only support bank account payouts.
// But since it's important think ahead, the code will support
// the ability to potentially support multiple payout methods
// for a single store.

// TODO: Figure out a way to compute amount available for payout.
// A naive implementation would be something like:
// Total Revenue to date - Total payed out to date
// However, this is grossly inefficient, since we'd have to compute both values
// every time the information is needed.

// These issues (the one described above, as well as the one described below)
// highlight the need for some form of cache that stores aggregate information.
// This cache should include all time information, as well as a performant way
// to compute period-based data (for both fixed and arbitrary periods).
// God forbid we have to start dealing with epochs.
// Did a Google search, and it looks like this will probably involve
// time-series data wrangling. Welp.
// Anyways, I think that a good starting point would be to have a simple
// table that handles all time data.

// Speaking of epochs, an interesting approach would be to have a couple of tables
// (something like this):
// - StatsWeekly
// - StatsMonthly
// - StatsYearly
// - StatsAllTime
// All of which are updated every time a tracked event takes place.
// The only catch is that we only maintain one row for each store at a time.
// When generating the stats for the last year, we add:
//
// export type StoreAllTime = {
// 	revenue: number;
// 	payedOut: number;
// 	orderCount: number;
// };

const stats: Resolver<StatsArgs> = async (_, { period }, ctx) => {
	if (!ctx.storeId) {
		throw new Error('No storeId specified');
	}

	const marker = getDateFromPeriod(period);

	// TODO: Add query for number of new customers.
	// Add query for number of pending orders.

	// Revenue should be defined as the sum of totals from
	// all fulfilled orders.
	// Should invoice be a separate table, or should its fields
	// just be a part of the order table?
	// It's expensive to calculate the revenue every time.
	// We should have a cache that maintains this data.
	// It should be live i.e. be updated every time the data is changed,
	// but it should not slow down requests. A mutation can trigger the
	// computation by delegating to another service.
	// Because we need to have details like

	// In this case, we can actually have a stats table
	// on the database.
	// PK - storeId
	// The only issue with this is we STILL have to deal with the issue
	// with filtering by dates.
	// Rambling - but there might be something here.

	// Proceed with naive implementation for now.

	const [products, orders, orderProducts, pendingOrderCount] =
		await ctx.prisma.$transaction([
			ctx.prisma.product.findMany({
				where: { storeId: ctx.storeId, createdAt: { gte: marker } }
			}),
			ctx.prisma.order.findMany({
				where: { storeId: ctx.storeId, createdAt: { gte: marker } }
			}),
			ctx.prisma.orderProduct.findMany({
				where: { order: { storeId: ctx.storeId, createdAt: { gte: marker } } }
			}),
			ctx.prisma.order.count({
				where: {
					storeId: ctx.storeId,
					createdAt: { gte: marker },
					status: 'Pending'
				}
			})
		]);

	return {
		storeId: ctx.storeId,
		products,
		orders,
		revenue: orderProducts.reduce(
			(acc, next) => acc + next.unitPrice * next.quantity,
			0
		),
		pendingOrderCount
	};
};

const id: Resolver = parent => parent.storeId;

export default {
	Stats: { id },
	Query: { stats }
};
