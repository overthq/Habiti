import { ResolverContext } from '../../types/resolvers';

interface SavePayoutParams {
	storeId: string;
	amount: number;
}

export const savePayout = async (
	ctx: ResolverContext,
	params: SavePayoutParams
) => {
	const { storeId, amount } = params;

	await ctx.prisma.payout.create({
		data: { storeId, amount }
	});
};

export const getStorePayouts = async (ctx: ResolverContext) => {
	if (!ctx.storeId) {
		throw new Error('Store ID is required');
	}

	const payouts = await ctx.prisma.payout.findMany({
		where: { storeId: ctx.storeId }
	});

	return payouts;
};
