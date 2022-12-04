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
	storeId: string;
	period: StatPeriod;
}

// Stats:
// - Number of new products in selected timeframe.
// - Number of new orders in selected timeframe (pending orders).
// - Number of new customers.

const stats: Resolver<StatsArgs> = async (_, { storeId, period }, ctx) => {
	const marker = getDateFromPeriod(period);

	// TODO: Add query for number of new customers.
	// Add query for number of pending orders.

	const [products, orders, orderProducts, pendingOrderCount] =
		await ctx.prisma.$transaction([
			ctx.prisma.product.findMany({
				where: { storeId, createdAt: { gte: marker } }
			}),
			ctx.prisma.order.findMany({
				where: { storeId, createdAt: { gte: marker } }
			}),
			ctx.prisma.orderProduct.findMany({
				where: { order: { storeId, createdAt: { gte: marker } } }
				// _count: { unitPrice: true }
			}),
			ctx.prisma.order.count({
				where: { storeId, createdAt: { gte: marker }, status: 'Pending' }
			})
		]);

	return {
		storeId,
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
