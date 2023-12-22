// Webhook handlers
import { PayoutStatus } from '@prisma/client';
import prismaClient from '../config/prisma';

export const handleChargeSuccess = () => {
	// TODO: Copy over storeCard logic
};

export const handleTransferSuccess = async (data: any) => {
	// TODO: Maybe less logic duplication?
	const { storeId } = await prismaClient.payout.findUnique({
		where: { id: data.reference }
	});

	await prismaClient.$transaction([
		prismaClient.payout.update({
			where: { id: data.reference },
			data: { status: PayoutStatus.Success }
		}),
		prismaClient.store.update({
			where: { id: storeId },
			data: { payedOut: { increment: Number(data.amount) } }
		})
	]);
};

export const handleTransferFailure = async (data: any) => {
	await prismaClient.payout.update({
		where: { id: data.reference },
		data: { status: PayoutStatus.Failure }
	});
};
