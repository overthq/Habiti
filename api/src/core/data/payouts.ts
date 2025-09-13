import { PayoutStatus, PrismaClient } from '@prisma/client';
import prismaClient from '../../config/prisma';

interface SavePayoutParams {
	storeId: string;
	amount: number;
}

export const savePayout = async (
	prisma: PrismaClient,
	params: SavePayoutParams
) => {
	const { storeId, amount } = params;

	return prisma.payout.create({
		data: { storeId, amount }
	});
};

export const getStorePayouts = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const payouts = await prisma.payout.findMany({
		where: { storeId }
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
