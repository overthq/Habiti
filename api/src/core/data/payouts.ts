import { PayoutStatus, PrismaClient } from '../../generated/prisma/client';
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

interface UpdatePayoutParams {
	payoutId: string;
	status: PayoutStatus;
}

export const updatePayout = async (
	prisma: PrismaClient,
	params: UpdatePayoutParams
) => {
	const { payoutId, status } = params;

	const updatedPayout = await prisma.$transaction(async tx => {
		const existingPayout = await tx.payout.findUnique({
			where: { id: payoutId }
		});

		if (!existingPayout) {
			throw new Error('Payout not found');
		}

		const updated = await tx.payout.update({
			where: { id: payoutId },
			data: { status },
			include: { store: true }
		});

		if (
			status === PayoutStatus.Success &&
			existingPayout.status !== PayoutStatus.Success
		) {
			await tx.store.update({
				where: { id: existingPayout.storeId },
				data: { paidOut: { increment: existingPayout.amount } }
			});
		}

		return updated;
	});

	return updatedPayout;
};

export const getStorePayouts = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const payouts = await prisma.payout.findMany({
		where: { storeId },
		include: { store: true }
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

export const getPayouts = async (prisma: PrismaClient, query: any) => {
	const payouts = await prisma.payout.findMany({
		...query,
		include: { store: true }
	});

	return payouts;
};

export const getPayoutById = async (prisma: PrismaClient, payoutId: string) => {
	const payout = await prisma.payout.findUnique({
		where: { id: payoutId },
		include: { store: true }
	});

	return payout;
};
