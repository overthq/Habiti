import { markPayoutAsFailed, markPayoutAsSuccessful } from '../data/payouts';
import {
	ChargeSuccessPayload,
	isTransferCharge,
	TransferFailurePayload,
	TransferSuccessPayload
} from './validation';
import { processCardCharge } from '../logic/payments';

const SUPPORTED_EVENTS = [
	'charge.success',
	'transfer.success',
	'transfer.failure',
	'transfer.reversed'
];

export const handlePaystackWebhookEvent = async (event: string, data: any) => {
	try {
		if (!SUPPORTED_EVENTS.includes(event)) {
			console.warn(`Unsupported event: ${event}`);
			return;
		}

		if (event === 'charge.success') {
			await handleChargeSuccess(data);
		} else if (event === 'transfer.success') {
			await handleTransferSuccess(data);
		} else if (event === 'transfer.failure') {
			await handleTransferFailure(data);
		}
	} catch (error) {
		console.error(error);
	}
};

// TODO: We should validate the data input, but I'm worried that Paystack might
// update the schema without warning.

export const handleChargeSuccess = async (data: ChargeSuccessPayload) => {
	if (isTransferCharge(data)) {
		// TODO: Implement DVAs and regular transfer payments here
		return;
	}

	await processCardCharge(data);
};

export const handleTransferSuccess = async (data: TransferSuccessPayload) => {
	if (data.reason !== 'Payout') {
		console.warn(
			`Found non-payout transfer. Reason: ${data.reason}. Reference: ${data.reference}`
		);
	} else {
		await markPayoutAsSuccessful(data.reference);
	}
};

export const handleTransferFailure = async (data: TransferFailurePayload) => {
	if (data.reason !== 'Payout') {
		console.warn(
			`Found non-payout transfer. Reason: ${data.reason}. Reference: ${data.reference}`
		);
	} else {
		await markPayoutAsFailed(data.reference);
	}
};
