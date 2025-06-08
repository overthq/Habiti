import { PayoutStatus } from '@prisma/client';
import { ResolverContext } from '../../types/resolvers';
import prismaClient from '../../config/prisma';

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

export const markPayoutAsSuccessful = async (reference: string) => {
	const payout = await prismaClient.payout.findUnique({
		where: { id: reference }
	});

	if (!payout) {
		throw new Error('Payout not found');
	}

	await prismaClient.$transaction([
		prismaClient.payout.update({
			where: { id: reference },
			data: { status: PayoutStatus.Success }
		}),
		prismaClient.store.update({
			where: { id: payout.storeId },
			data: { paidOut: { increment: payout.amount } }
		})
	]);
};

export const markPayoutAsFailed = async (reference: string) => {
	await prismaClient.payout.update({
		where: { id: reference },
		data: { status: PayoutStatus.Failure }
	});
};
