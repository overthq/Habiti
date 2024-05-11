// Webhook handlers
import { PayoutStatus } from '@prisma/client';

import prismaClient from '../config/prisma';

export const handleChargeSuccess = async (data: any) => {
	// TODO: Copy over storeCard logic
	// Check if it is a tokenization charge.
	// If it is:
	// - Store card details
	// - Prepare to send back amount to user, or provide credits
	// Else:
	// - Update order status to "Confirmed"
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
			data: { paidOut: { increment: Number(data.amount) } }
		})
	]);
};

export const handleTransferFailure = async (data: any) => {
	await prismaClient.payout.update({
		where: { id: data.reference },
		data: { status: PayoutStatus.Failure }
	});
};
