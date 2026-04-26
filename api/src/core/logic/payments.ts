import type { Context } from 'hono';

import { OrderStatus, TransactionStatus } from '../../generated/prisma/client';
import { env } from '../../config/env';

import * as CardData from '../data/cards';
import * as OrderData from '../data/orders';
import * as TransactionData from '../data/transactions';
import * as StoreData from '../data/stores';
import * as PushTokenData from '../data/pushTokens';

import { NotificationType } from '../notifications';

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

import type { AppEnv } from '../../types/hono';
import { pollUntil } from '../../utils/poll';
import { runSerializable } from '../../utils/prisma';
import { rootLogger } from '../../services/logger';
import type { ApprovePaymentBody } from '../validations/rest';

export const approvePayment = async (
	c: Context<AppEnv>,
	body: ApprovePaymentBody
) =>
	c.var.tracer.startSpan(
		'paystack.approvePayment',
		async () => {
			const { transfers } = body.data;

			return runSerializable(c.var.prisma, async tx => {
				const rows: Awaited<ReturnType<typeof tx.transaction.findUnique>>[] =
					[];

				for (const transfer of transfers) {
					const row = await tx.transaction.findUnique({
						where: { id: transfer.reference }
					});

					if (
						!row ||
						row.status !== TransactionStatus.Processing ||
						row.amount !== transfer.amount
					) {
						return null;
					}

					rows.push(row);
				}

				return rows;
			});
		},
		{ transferCount: body.data.transfers.length }
	);

// --- Card charge processing ---

export const processCardCharge = async (
	c: Context<AppEnv>,
	data: CardChargeSuccessPayload
) => {
	const card = await CardData.storeCard(c.var.prisma, {
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

export const onChargeSuccessful = async (
	c: Context<AppEnv>,
	orderId: string
) => {
	await transitionOrderToPending(c, orderId);
};

export const transitionOrderToPending = async (
	c: Context<AppEnv>,
	orderId: string
) => {
	try {
		const order = await OrderData.getOrderById(c.var.prisma, orderId);

		if (!order) {
			c.var.logger.warn({ orderId }, 'order_not_found_for_charge');
		} else if (order.status !== OrderStatus.PaymentPending) {
			c.var.logger.warn(
				{ orderId: order.id, status: order.status },
				'order_not_in_payment_pending'
			);
		} else {
			await OrderData.updateOrder(c.var.prisma, order.id, {
				status: OrderStatus.Pending
			});

			await StoreData.incrementUnrealizedRevenue(c.var.prisma, {
				storeId: order.storeId,
				total: order.total
			});

			const pushTokens = await PushTokenData.getStorePushTokens(
				c.var.prisma,
				order.storeId
			);

			if (pushTokens.length > 0) {
				c.var.services.notifications.queueNotification({
					type: NotificationType.NewOrder,
					data: {
						orderId: order.id,
						customerName: order.user.name,
						amount: order.total
					},
					recipientTokens: pushTokens
				});
			}
		}
	} catch (error) {
		c.var.logger.error({ err: error, orderId }, 'transition_order_failed');
	}
};

const PAYSTACK_SUPPORTED_WEBHOOK_EVENTS = [
	'charge.success',
	'transfer.success',
	'transfer.failure',
	'transfer.reversed'
];

export const handlePaystackWebhookEvent = async (
	c: Context<AppEnv>,
	event: string,
	data: any
) =>
	c.var.tracer.startSpan(
		'paystack.webhook',
		async () => handlePaystackWebhookEventImpl(c, event, data),
		{ event }
	);

const handlePaystackWebhookEventImpl = async (
	c: Context<AppEnv>,
	event: string,
	data: any
) => {
	try {
		c.var.logger.info({ event }, 'paystack.webhook.received');

		if (!PAYSTACK_SUPPORTED_WEBHOOK_EVENTS.includes(event)) {
			c.var.logger.warn({ event }, 'paystack.webhook.unsupported');
			return;
		}

		if (event === 'charge.success') {
			await handleChargeSuccess(c, data);
		} else if (event === 'transfer.success') {
			await handleTransferSuccess(c, data);
		} else if (event === 'transfer.failure') {
			await handleTransferFailure(c, data);
		} else if (event === 'transfer.reversed') {
			await handleTransferReversed(c, data);
		}
	} catch (error) {
		c.var.logger.error({ err: error, event }, 'paystack.webhook.failed');
	}
};

// TODO: We should validate the data input, but I'm worried that Paystack might
// update the schema without warning.

export const handleChargeSuccess = async (
	c: Context<AppEnv>,
	data: ChargeSuccessPayload
) => {
	if (typeof data.metadata === 'object' && data.metadata?.orderId) {
		await onChargeSuccessful(c, data.metadata.orderId);
	} else {
		c.var.logger.warn(
			{ cardType: data.authorization.card_type },
			'charge.success_without_order'
		);
	}

	if (isTransferCharge(data)) {
		// TODO: Implement DVAs and regular transfer payments here
		return;
	}

	await processCardCharge(c, data);
};

const handleTransferSuccess = async (
	c: Context<AppEnv>,
	data: TransferSuccessPayload
) => {
	if (data.reason !== 'Payout') {
		c.var.logger.warn(
			{ reason: data.reason, reference: data.reference },
			'paystack.non_payout_transfer'
		);
	} else {
		await TransactionData.markTransferSuccessful(c.var.prisma, data.reference);

		const transaction = await TransactionData.getTransactionById(
			c.var.prisma,
			data.reference
		);

		if (transaction) {
			const pushTokens = await PushTokenData.getStorePushTokens(
				c.var.prisma,
				transaction.storeId
			);

			if (pushTokens.length > 0) {
				c.var.services.notifications.queueNotification({
					type: NotificationType.PayoutConfirmed,
					data: {
						amount: transaction.amount,
						transactionId: transaction.id
					},
					recipientTokens: pushTokens
				});
			}
		}
	}
};

const handleTransferFailure = async (
	ctx: Context<AppEnv>,
	data: TransferFailurePayload
) => {
	if (data.reason !== 'Payout') {
		ctx.var.logger.warn(
			{ reason: data.reason, reference: data.reference },
			'paystack.non_payout_transfer'
		);
	} else {
		await TransactionData.markTransferFailed(ctx.var.prisma, data.reference);
	}
};

export const handleTransferReversed = async (
	ctx: Context<AppEnv>,
	data: TransferReversedPayload
) => {
	await TransactionData.markTransferFailed(ctx.var.prisma, data.reference);
};

export const verifyTransaction = async (
	c: Context<AppEnv>,
	reference: string
) => {
	const { data, status } = await CorePayments.verifyTransaction(reference);

	if (status === true && data.status === 'success') {
		return await handleChargeSuccess(c, data);
	}
};

const TERMINAL_TRANSFER_FAILURE_STATUSES = new Set([
	'failed',
	'reversed',
	'abandoned'
]);

export const verifyTransfer = async (
	c: Context<AppEnv>,
	options: VerifyTransferOptions
) => {
	const { data, status } = await CorePayments.verifyTransfer(options);

	if (status !== true) {
		return data;
	}

	if (data.status === 'success') {
		await TransactionData.markTransferSuccessful(
			c.var.prisma,
			options.transferId
		);

		return data;
	}

	if (TERMINAL_TRANSFER_FAILURE_STATUSES.has(data.status)) {
		await TransactionData.markTransferFailed(c.var.prisma, options.transferId);
		return data;
	}

	// Non-terminal statuses (pending, otp, etc.): keep the row Processing.
	return data;
};

export const chargeAuthorization = async (
	c: Context<AppEnv>,
	options: ChargeAuthorizationOptions
) => {
	const data = await CorePayments.chargeAuthorization(options);

	if (env.NODE_ENV !== 'production') {
		pollUntil(() => verifyTransaction(c, data.data.reference), {
			intervalMs: 5_000,
			maxAttempts: 12
		});
	}

	return data;
};

export const initialCharge = async (
	c: Context<AppEnv>,
	options: InitialChargeOptions
) => {
	const data = await CorePayments.initialCharge(options);

	if (env.NODE_ENV !== 'production') {
		pollUntil(() => verifyTransaction(c, data.data.reference), {
			intervalMs: 5_000,
			maxAttempts: 24
		});
	}

	return data;
};

export const payAccount = async (
	c: Context<AppEnv>,
	options: PayAccountOptions
) => {
	const data = await CorePayments.payAccount(options);

	if (env.NODE_ENV !== 'production') {
		pollUntil(
			async () => {
				const verifyResult = await verifyTransfer(c, {
					transferId: data.data.reference
				});

				return verifyResult.status === 'success';
			},
			{ intervalMs: 5_000, maxAttempts: 24 }
		).catch(error => {
			rootLogger.error(
				{ err: error, reference: data.data.reference },
				'payAccount.verifyTransfer_poll_failed'
			);
		});
	}

	return data;
};
