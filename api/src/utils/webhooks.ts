import { z } from 'zod';
import { storeCard } from '../core/data/cards';
import {
	markPayoutAsFailed,
	markPayoutAsSuccessful
} from '../core/data/payouts';
import { getOrderById, updateOrder } from '../core/data/orders';
import prismaClient from '../config/prisma';
import { OrderStatus } from '@prisma/client';

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

const handleChargeSuccess = async (data: ChargeSuccessPayload) => {
	if (isTransferCharge(data)) {
		// TODO: Implement DVAs and regular transfer payments here
		return;
	} else {
		await storeCard(data);

		// Transition status from PaymentPending to Pending
		if (data.metadata.orderId) {
			const order = await getOrderById(prismaClient, data.metadata.orderId);

			if (!order) {
				console.warn(`Order not found for charge: ${data.metadata.orderId}`);
				return;
			} else if (order.status !== OrderStatus.PaymentPending) {
				console.warn(
					`Order ${order.id} is not in the PaymentPending state. It is in the ${order.status} state.`
				);
				return;
			}

			await updateOrder(prismaClient, order.id, {
				status: OrderStatus.Pending
			});
		}
	}
};

export const handleTransferSuccess = async (data: TransferSuccessPayload) => {
	await markPayoutAsSuccessful(data.reference);
};

export const handleTransferFailure = async (data: TransferFailurePayload) => {
	await markPayoutAsFailed(data.reference);
};

const TransferSuccessSchema = z.object({
	reference: z.string()
});

const TransferFailureSchema = z.object({
	reference: z.string()
});

type TransferSuccessPayload = z.infer<typeof TransferSuccessSchema>;
type TransferFailurePayload = z.infer<typeof TransferFailureSchema>;

const CardAuthorizationSchema = z.object({
	authorization_code: z.string(),
	card_type: z.enum(['visa', 'mastercard', 'verve', 'american_express']),
	last4: z.string(),
	exp_month: z.string(),
	exp_year: z.string(),
	bin: z.string(),
	bank: z.string(),
	channel: z.string(),
	signature: z.string(),
	reusable: z.boolean(),
	country_code: z.string(),
	account_name: z.string()
});

const TransferAuthorizationSchema = z.object({
	authorization_code: z.string(),
	bin: z.string(),
	last4: z.string(),
	exp_month: z.string(),
	exp_year: z.string(),
	card_type: z.literal('transfer'),
	bank: z.string(),
	country_code: z.string(),
	brand: z.string(),
	reusable: z.boolean(),
	sender_bank: z.string(),
	sender_bank_account_number: z.string(),
	sender_country: z.string(),
	sender_name: z.string(),
	narration: z.string(),
	receiver_bank_account_number: z.string(),
	receiver_bank: z.string()
});

const CardChargeMetadataSchema = z.object({
	userId: z.string().optional().nullable(),
	orderId: z.string().optional().nullable()
});

const CardChargeSuccessSchema = z.object({
	customer: z.object({ email: z.string() }), // I don't know if this is actually supplied.
	authorization: CardAuthorizationSchema,
	metadata: CardChargeMetadataSchema
});

const TransferChargeSuccessSchema = z.object({
	authorization: TransferAuthorizationSchema,
	metadata: CardChargeMetadataSchema
});

type CardChargeSuccessPayload = z.infer<typeof CardChargeSuccessSchema>;
type TransferChargeSuccessPayload = z.infer<typeof TransferChargeSuccessSchema>;
type ChargeSuccessPayload =
	| CardChargeSuccessPayload
	| TransferChargeSuccessPayload;

const isTransferCharge = (
	data: ChargeSuccessPayload
): data is TransferChargeSuccessPayload => {
	return data.authorization.card_type === 'transfer';
};
