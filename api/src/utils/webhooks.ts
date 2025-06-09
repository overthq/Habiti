import { storeCard } from '../core/data/cards';
import {
	markPayoutAsFailed,
	markPayoutAsSuccessful
} from '../core/data/payouts';

export const handlePaystackWebhookEvent = async (event: string, data: any) => {
	if (event === 'charge.success') {
		await storeCard(data);
	} else if (event === 'transfer.success') {
		await handleTransferSuccess(data);
	} else if (event === 'transfer.failure') {
		await handleTransferFailure(data);
	}
};

interface TransferSuccessPayload {
	reference: string;
}

export const handleTransferSuccess = async (data: TransferSuccessPayload) => {
	await markPayoutAsSuccessful(data.reference);
};

interface TransferFailurePayload {
	reference: string;
}

export const handleTransferFailure = async (data: TransferFailurePayload) => {
	await markPayoutAsFailed(data.reference);
};
