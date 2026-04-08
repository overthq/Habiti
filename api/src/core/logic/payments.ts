import { OrderStatus } from '../../generated/prisma/client';
import { env } from '../../config/env';

import * as CardData from '../data/cards';
import * as OrderData from '../data/orders';
import * as TransactionData from '../data/transactions';
import * as StoreData from '../data/stores';

import * as CorePayments from '../payments';

import {
	CardChargeSuccessPayload,
	ChargeSuccessPayload,
	isTransferCharge,
	TransferFailurePayload,
	TransferReversedPayload,
	TransferSuccessPayload
} from '../payments/validation';
import type {
	ChargeAuthorizationOptions,
	InitialChargeOptions,
	PayAccountOptions,
	VerifyTransferOptions
} from '../payments/types';

import type { AppContext } from '../../utils/context';
import { pollUntil } from '../../utils/poll';
import logger from '../../utils/logger';

// --- Payment approval ---

// `body` here comes directly from Paystack.
export const approvePayment = async (ctx: AppContext, body: any) => {
	// It's currently hard to know what the shape of the information from Paystack
	// looks like here, so I'm checking all the _reasonable_ places.
	// It would be good to be sure where this information should be, so we can
	// validate with Zod, but this should work for now.

	const reference = body?.reference || body?.data?.reference;
	const amount = body?.amount || body?.data?.amount;

	if (!reference) {
		throw new Error('Unable to extract reference parameter');
	} else if (!amount) {
		throw new Error('Unable to extract amount parameter');
	}

	const transaction = await ctx.prisma.transaction.findFirst({
		where: {
			id: reference,
			status: 'Processing',
			amount
		}
	});

	return transaction;
};

// --- Card charge processing ---

export const processCardCharge = async (
	ctx: AppContext,
	data: CardChargeSuccessPayload
) => {
	const card = await CardData.storeCard(ctx.prisma, {
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

	return card;
};

// --- Order transitions ---

export const onChargeSuccessful = async (ctx: AppContext, orderId: string) => {
	await transitionOrderToPending(ctx, orderId);
};

export const transitionOrderToPending = async (
	ctx: AppContext,
	orderId: string
) => {
	try {
		const order = await OrderData.getOrderById(ctx.prisma, orderId);

		if (!order) {
			logger.warn(`Order not found for charge: ${orderId}`);
		} else if (order.status !== OrderStatus.PaymentPending) {
			logger.warn(
				`Order ${order.id} is not in the PaymentPending state. It is in the ${order.status} state.`
			);
		} else {
			await OrderData.updateOrder(ctx.prisma, order.id, {
				status: OrderStatus.Pending
			});

			await StoreData.incrementUnrealizedRevenue(ctx.prisma, {
				storeId: order.storeId,
				total: order.total
			});
		}
	} catch (error) {
		logger.error(error);
	}
};

const PAYSTACK_SUPPORTED_WEBHOOK_EVENTS = [
	'charge.success',
	'transfer.success',
	'transfer.failure',
	'transfer.reversed'
];

export const handlePaystackWebhookEvent = async (
	ctx: AppContext,
	event: string,
	data: any
) => {
	try {
		logger.info(`Handling event: ${event}`);

		if (!PAYSTACK_SUPPORTED_WEBHOOK_EVENTS.includes(event)) {
			logger.warn(`Unsupported event: ${event}`);
			return;
		}

		if (event === 'charge.success') {
			await handleChargeSuccess(ctx, data);
		} else if (event === 'transfer.success') {
			await handleTransferSuccess(data);
		} else if (event === 'transfer.failure') {
			await handleTransferFailure(data);
		} else if (event === 'transfer.reversed') {
			await handleTransferReversed(ctx, data);
		}
	} catch (error) {
		logger.error(error);
	}
};

// TODO: We should validate the data input, but I'm worried that Paystack might
// update the schema without warning.

export const handleChargeSuccess = async (
	ctx: AppContext,
	data: ChargeSuccessPayload
) => {
	if (typeof data.metadata === 'object' && data.metadata?.orderId) {
		await onChargeSuccessful(ctx, data.metadata.orderId);
	} else {
		logger.warn('Successful charge without any order attached!');
	}

	if (isTransferCharge(data)) {
		// TODO: Implement DVAs and regular transfer payments here
		return;
	}

	await processCardCharge(ctx, data);
};

const handleTransferSuccess = async (data: TransferSuccessPayload) => {
	if (data.reason !== 'Payout') {
		logger.warn(
			`Found non-payout transfer. Reason: ${data.reason}. Reference: ${data.reference}`
		);
	} else {
		await TransactionData.markTransferSuccessful(data.reference);
	}
};

const handleTransferFailure = async (data: TransferFailurePayload) => {
	if (data.reason !== 'Payout') {
		logger.warn(
			`Found non-payout transfer. Reason: ${data.reason}. Reference: ${data.reference}`
		);
	} else {
		await TransactionData.markTransferFailed(data.reference);
	}
};

export const handleTransferReversed = async (
	ctx: AppContext,
	data: TransferReversedPayload
) => {};

export const verifyTransaction = async (ctx: AppContext, reference: string) => {
	const { data, status } = await CorePayments.verifyTransaction(reference);

	if (status === true && data.status === 'success') {
		return await handleChargeSuccess(ctx, data);
	}
};

export const verifyTransfer = async (
	ctx: AppContext,
	options: VerifyTransferOptions
) => {
	const { data, status } = await CorePayments.verifyTransfer(options);

	if (status === true && data.status === 'success') {
		await TransactionData.markTransferSuccessful(options.transferId);
	} else {
		await TransactionData.markTransferFailed(options.transferId);
	}

	return data;
};

export const chargeAuthorization = async (
	ctx: AppContext,
	options: ChargeAuthorizationOptions
) => {
	const data = await CorePayments.chargeAuthorization(options);

	if (env.NODE_ENV !== 'production') {
		pollUntil(() => verifyTransaction(ctx, data.data.reference), {
			intervalMs: 5_000,
			maxAttempts: 12
		});
	}

	return data;
};

export const initialCharge = async (
	ctx: AppContext,
	options: InitialChargeOptions
) => {
	const data = await CorePayments.initialCharge(options);

	if (env.NODE_ENV !== 'production') {
		pollUntil(() => verifyTransaction(ctx, data.data.reference), {
			intervalMs: 5_000,
			maxAttempts: 24
		});
	}

	return data;
};

export const payAccount = async (
	ctx: AppContext,
	options: PayAccountOptions
) => {
	const data = await CorePayments.payAccount(options);

	if (env.NODE_ENV !== 'production') {
		pollUntil(() => verifyTransfer(ctx, { transferId: data.data.reference }), {
			intervalMs: 5_000,
			maxAttempts: 24
		});
	}

	return data;
};
