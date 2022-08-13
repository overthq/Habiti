import { Resolver } from '../../types/resolvers';

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

	const [products, orders, projectedRevenue] = await ctx.prisma.$transaction([
		ctx.prisma.product.findMany({
			where: {
				storeId,
				createdAt: { gte: marker }
			}
		}),

		ctx.prisma.order.findMany({
			where: {
				storeId,
				createdAt: { gte: marker }
			}
		}),
		ctx.prisma.orderProduct.aggregate({
			where: {
				order: {
					storeId,
					createdAt: { gte: marker }
				}
			},
			_count: {
				unitPrice: true
			}
		})
	]);

	return { products, orders, projectedRevenue };
};

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
