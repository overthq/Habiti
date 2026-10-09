import type { Context } from 'hono';

import {
	AccountKind,
	LedgerReason,
	OrderStatus,
	PayoutStatus
} from '../../generated/prisma/client';
import { env } from '../../config/env';

import * as CardData from '../data/cards';
import * as OrderData from '../data/orders';
import * as TransactionData from '../data/transactions';
import { moveMoney } from '../data/ledger';
import * as PushTokenData from '../data/pushTokens';
import {
	deriveExternalId,
	markWebhookEventFailed,
	markWebhookEventProcessed,
	PAYSTACK_WEBHOOK_PROVIDER,
	recordWebhookEvent
} from '../data/webhookEvents';

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
				const rows: Awaited<ReturnType<typeof tx.payout.findUnique>>[] = [];

				for (const transfer of transfers) {
					const row = await tx.payout.findUnique({
						where: { id: transfer.reference }
					});

					if (
						!row ||
						row.status !== PayoutStatus.Processing ||
						Number(row.amount) !== transfer.amount
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

export const transitionOrderToPending = async (
	c: Context<AppEnv>,
	orderId: string,
	webhookEventId?: string | null
) => {
	const order = await runSerializable(c.var.prisma, async tx => {
		const order = await OrderData.getOrderById(tx, orderId);

		if (!order || order.status === OrderStatus.Cancelled) return order;

		if (order.status === OrderStatus.PaymentPending) {
			await tx.order.update({
				where: { id: order.id },
				data: { status: OrderStatus.Pending }
			});
		}

		// Recorded for any paid order, not just one that was PaymentPending:
		// replaying a charge is how an order that advanced without its payment
		// gets repaired.
		const payment = await moveMoney(tx, {
			key: `order:${order.id}:paid`,
			reason: LedgerReason.OrderPaid,
			amount: BigInt(order.total),
			from: { kind: AccountKind.PlatformCash },
			to: { kind: AccountKind.Unrealized, storeId: order.storeId },
			description: 'Payment confirmed',
			orderId: order.id,
			webhookEventId
		});

		if (payment && order.serviceFee > 0) {
			await moveMoney(tx, {
				key: `order:${order.id}:paid:fee`,
				reason: LedgerReason.OrderPaid,
				amount: BigInt(order.serviceFee),
				from: { kind: AccountKind.PlatformCash },
				to: { kind: AccountKind.PlatformFeeRevenue },
				description: 'Service fee',
				orderId: order.id,
				webhookEventId
			});
		}

		return order;
	});

	if (!order) {
		c.var.logger.warn({ orderId }, 'order_not_found_for_charge');
		return;
	}

	if (order.status !== OrderStatus.PaymentPending) {
		c.var.logger.warn(
			{ orderId: order.id, status: order.status },
			'order_not_in_payment_pending'
		);

		return;
	}

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
};

enum PaystackWebhookEvent {
	ChargeSuccess = 'charge.success',
	TransferSuccess = 'transfer.success',
	TransferFailure = 'transfer.failure',
	TransferReversed = 'transfer.reversed'
}

const PAYSTACK_SUPPORTED_WEBHOOK_EVENTS = [
	PaystackWebhookEvent.ChargeSuccess,
	PaystackWebhookEvent.TransferSuccess,
	PaystackWebhookEvent.TransferFailure,
	PaystackWebhookEvent.TransferReversed
];

export const handlePaystackWebhookEvent = async (
	c: Context<AppEnv>,
	event: string,
	data: any,
	webhookEventId?: string | null
) =>
	c.var.tracer.startSpan(
		'paystack.webhook',
		async () => handlePaystackWebhookEventImpl(c, event, data, webhookEventId),
		{ event }
	);

const handlePaystackWebhookEventImpl = async (
	c: Context<AppEnv>,
	event: string,
	data: any,
	webhookEventId?: string | null
) => {
	c.var.logger.info({ event }, 'paystack.webhook.received');

	if (
		!PAYSTACK_SUPPORTED_WEBHOOK_EVENTS.includes(event as PaystackWebhookEvent)
	) {
		c.var.logger.warn({ event }, 'paystack.webhook.unsupported');
		return;
	}

	if (event === PaystackWebhookEvent.ChargeSuccess) {
		await handleChargeSuccess(c, data, webhookEventId);
	} else if (event === PaystackWebhookEvent.TransferSuccess) {
		await handleTransferSuccess(c, data, webhookEventId);
	} else if (event === PaystackWebhookEvent.TransferFailure) {
		await handleTransferFailure(c, data, webhookEventId);
	} else if (event === PaystackWebhookEvent.TransferReversed) {
		await handleTransferReversed(c, data, webhookEventId);
	}
};

// TODO: We should validate the data input, but I'm worried that Paystack might
// update the schema without warning.

export const handleChargeSuccess = async (
	c: Context<AppEnv>,
	data: ChargeSuccessPayload,
	webhookEventId?: string | null
) => {
	if (typeof data.metadata === 'object' && data.metadata?.orderId) {
		await transitionOrderToPending(c, data.metadata.orderId, webhookEventId);
	} else {
		c.var.logger.warn(
			{ cardType: data.authorization.card_type },
			'charge.success_without_order'
		);
	}

	if (isTransferCharge(data)) {
		// TODO: Implement DVAs and regular transfer payments here
		return true;
	}

	await processCardCharge(c, data);

	return true;
};

const handleTransferSuccess = async (
	c: Context<AppEnv>,
	data: TransferSuccessPayload,
	webhookEventId?: string | null
) => {
	if (data.reason !== 'Payout') {
		c.var.logger.warn(
			{ reason: data.reason, reference: data.reference },
			'paystack.non_payout_transfer'
		);
	} else {
		await TransactionData.markTransferSuccessful(
			c.var.prisma,
			data.reference,
			webhookEventId
		);

		const payout = await TransactionData.getPayoutById(
			c.var.prisma,
			data.reference
		);

		if (payout) {
			const pushTokens = await PushTokenData.getStorePushTokens(
				c.var.prisma,
				payout.storeId
			);

			if (pushTokens.length > 0) {
				// The notification links to the dashboard's transaction screen,
				// which needs the transaction's id, not the payout's.
				const transaction = await TransactionData.getPayoutTransaction(
					c.var.prisma,
					payout.id
				);

				c.var.services.notifications.queueNotification({
					type: NotificationType.PayoutConfirmed,
					data: {
						amount: Number(payout.amount),
						...(transaction ? { transactionId: transaction.id } : {})
					},
					recipientTokens: pushTokens
				});
			}
		}
	}
};

const handleTransferFailure = async (
	ctx: Context<AppEnv>,
	data: TransferFailurePayload,
	webhookEventId?: string | null
) => {
	if (data.reason !== 'Payout') {
		ctx.var.logger.warn(
			{ reason: data.reason, reference: data.reference },
			'paystack.non_payout_transfer'
		);
	} else {
		await TransactionData.markTransferFailed(ctx.var.prisma, data.reference, {
			failureReason: 'Paystack reported transfer failure',
			webhookEventId
		});
	}
};

export const handleTransferReversed = async (
	ctx: Context<AppEnv>,
	data: TransferReversedPayload,
	webhookEventId?: string | null
) => {
	await TransactionData.markTransferFailed(ctx.var.prisma, data.reference, {
		failureReason: 'Paystack reported transfer reversal',
		webhookEventId,
		allowSettled: true
	});
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
		await TransactionData.markTransferFailed(c.var.prisma, options.transferId, {
			failureReason: `Paystack transfer status: ${data.status}`
		});

		return data;
	}

	// Non-terminal statuses (pending, otp, etc.): leave the request Processing.
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

interface ClaimWebhookEventInput {
	rawBody: string;
	eventType: string;
	externalRef?: string | number | undefined;
	payload: unknown;
}

export const claimPaystackWebhookEvent = async (
	c: Context<AppEnv>,
	input: ClaimWebhookEventInput
) => {
	const externalId = deriveExternalId(input.rawBody, input.externalRef);

	const claim = await recordWebhookEvent(c.var.prisma, {
		provider: PAYSTACK_WEBHOOK_PROVIDER,
		eventType: input.eventType,
		externalId,
		payload: input.payload
	});

	return { ...claim, externalId };
};

interface ProcessWebhookEventInput {
	claimId: string;
	event: string;
	data: unknown;
	externalId: string;
}

// Never throws: the response has already gone out by the time this runs, so
// a failure is recorded on the event for `replay-webhooks` to pick up.
export const processPaystackWebhookEvent = async (
	c: Context<AppEnv>,
	input: ProcessWebhookEventInput
) => {
	const { claimId, event, data, externalId } = input;

	try {
		await handlePaystackWebhookEvent(c, event, data, claimId);
		await markWebhookEventProcessed(c.var.prisma, claimId);
	} catch (error) {
		c.var.logger.error(
			{ err: error, event, externalId },
			'paystack.webhook.processing_failed'
		);

		try {
			await markWebhookEventFailed(c.var.prisma, claimId, error);
		} catch (markError) {
			c.var.logger.error(
				{ err: markError, event, externalId },
				'paystack.webhook.mark_failed_errored'
			);
		}
	}
};
