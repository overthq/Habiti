import { OrderStatus } from '@prisma/client';

import { storeCard } from '../data/cards';
import { markPayoutAsFailed, markPayoutAsSuccessful } from '../data/payouts';
import { getOrderById, updateOrder } from '../data/orders';
import prismaClient from '../../config/prisma';
import {
	ChargeSuccessPayload,
	isTransferCharge,
	TransferFailurePayload,
	TransferSuccessPayload
} from './validation';

const SUPPORTED_EVENTS = [
	'charge.success',
	'transfer.success',
	'transfer.failure'
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
	} else {
		await storeCard({
			email: data.customer.email,
			signature: data.authorization.signature,
			authorizationCode: data.authorization.authorization_code,
			bin: data.authorization.bin,
			last4: data.authorization.last4,
			expMonth: data.authorization.exp_month,
			expYear: data.authorization.exp_year,
			bank: data.authorization.bank,
			cardType: data.authorization.card_type,
			countryCode: data.authorization.country_code
		});
	}
	// In both cases, we want to check if `orderId` is set in the metadata.

	if (data.metadata.orderId) {
		await transitionOrderToPending(data.metadata.orderId);
	}
};

export const transitionOrderToPending = async (orderId: string) => {
	const order = await getOrderById(prismaClient, orderId);

	if (!order) {
		console.warn(`Order not found for charge: ${orderId}`);
	} else if (order.status !== OrderStatus.PaymentPending) {
		console.warn(
			`Order ${order.id} is not in the PaymentPending state. It is in the ${order.status} state.`
		);
	} else {
		await updateOrder(prismaClient, order.id, {
			status: OrderStatus.Pending
		});
	}
};

export const handleTransferSuccess = async (data: TransferSuccessPayload) => {
	await markPayoutAsSuccessful(data.reference);
};

export const handleTransferFailure = async (data: TransferFailurePayload) => {
	await markPayoutAsFailed(data.reference);
};
