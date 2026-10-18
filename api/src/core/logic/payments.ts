import type { Context } from 'hono';

import {
	AccountKind,
	LedgerReason,
	OrderStatus,
	PayoutStatus,
	PrismaClient,
	PushTokenType
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
import type {
	IncomingCharge,
	IncomingTransferRejection,
	StoredCardCharge
} from '../payments';

import {
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
import type { Logger } from '../../services/logger';

/**
 * How long an unpaid order holds stock. The checkout transfer account lasts
 * about 30 minutes; the extra 5 minutes lets a transfer sent at the end of
 * that window arrive before the stock is released.
 */
export const DEFAULT_PAYMENT_PENDING_EXPIRY_MS = 35 * 60 * 1000;

/** Whole-window override in minutes. Non-positive values use the default. */
export const paymentPendingExpiryMs = (overrideMinutes?: number) => {
	if (
		typeof overrideMinutes === 'number' &&
		Number.isFinite(overrideMinutes) &&
		overrideMinutes > 0
	) {
		return overrideMinutes * 60 * 1000;
	}

	return DEFAULT_PAYMENT_PENDING_EXPIRY_MS;
};

/** What the shopper is charged: goods plus the transaction and service fees. */
export const expectedOrderChargeAmount = (order: {
	total: number;
	transactionFee: number;
	serviceFee: number;
}) => order.total + order.transactionFee + order.serviceFee;

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
	card: StoredCardCharge
) => {
	return CardData.storeCard(c.var.prisma, card);
};

// --- Order transitions ---

interface ChargeAcceptance {
	amount: number;
	reference: string | null;
	currency: string | null;
}

export const transitionOrderToPending = async (
	c: Context<AppEnv>,
	orderId: string,
	webhookEventId?: string | null,
	charge?: ChargeAcceptance
) => {
	const result = await runSerializable(c.var.prisma, async tx => {
		const order = await OrderData.getOrderById(tx, orderId);

		if (!order) return { kind: 'missing' as const };

		// Orders do not store a provider reference, so `charge.reference` is
		// logged for reconciliation and not compared to a stored value.
		if (charge) {
			const expectedAmount = expectedOrderChargeAmount(order);
			const currencyOk = charge.currency == null || charge.currency === 'NGN';

			if (!currencyOk || charge.amount !== expectedAmount) {
				return {
					kind: 'amount_mismatch' as const,
					order,
					expectedAmount
				};
			}
		}

		if (order.status === OrderStatus.Cancelled) {
			return { kind: 'closed' as const, order };
		}

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

		return { kind: 'recorded' as const, order };
	});

	if (result.kind === 'missing') {
		c.var.logger.warn({ orderId }, 'order_not_found_for_charge');
		return;
	}

	if (result.kind === 'amount_mismatch') {
		// Leave the order unpaid. Stock stays held until expiry or a later
		// charge for the expected amount. Reconcile from this log and the
		// stored webhook payload — a captured charge that does not match the
		// order must not be marked paid and must not be silently dropped.
		c.var.logger.error(
			{
				orderId: result.order.id,
				status: result.order.status,
				paidAmount: charge?.amount,
				expectedAmount: result.expectedAmount,
				currency: charge?.currency,
				reference: charge?.reference,
				handling: 'left_unpaid'
			},
			'payment.charge_amount_mismatch'
		);
		return;
	}

	if (result.kind === 'closed') {
		const fields = {
			orderId: result.order.id,
			status: result.order.status,
			reference: charge?.reference
		};

		if (charge) {
			c.var.logger.error(fields, 'payment.charge_for_closed_order');
		} else {
			c.var.logger.warn(fields, 'order_not_in_payment_pending');
		}

		return;
	}

	if (result.order.status !== OrderStatus.PaymentPending) {
		c.var.logger.warn(
			{ orderId: result.order.id, status: result.order.status },
			'order_not_in_payment_pending'
		);

		return;
	}

	const pushTokens = await PushTokenData.getStorePushTokens(
		c.var.prisma,
		result.order.storeId
	);

	if (pushTokens.length > 0) {
		c.var.services.notifications.queueNotification({
			type: NotificationType.NewOrder,
			data: {
				orderId: result.order.id,
				customerName: result.order.user.name,
				amount: result.order.total
			},
			recipientTokens: pushTokens
		});
	}
};

enum PaystackWebhookEvent {
	ChargeSuccess = 'charge.success',
	TransferSuccess = 'transfer.success',
	TransferFailure = 'transfer.failure',
	TransferReversed = 'transfer.reversed',
	// Documented for Pay with Transfer: wrong amount, or the customer was
	// flagged. Paystack does not publish a separate sample for this event.
	// `transfer.failed` / `transfer.reversed` are merchant payouts, not this.
	BankTransferRejected = 'bank.transfer.rejected'
}

const PAYSTACK_SUPPORTED_WEBHOOK_EVENTS = [
	PaystackWebhookEvent.ChargeSuccess,
	PaystackWebhookEvent.TransferSuccess,
	PaystackWebhookEvent.TransferFailure,
	PaystackWebhookEvent.TransferReversed,
	PaystackWebhookEvent.BankTransferRejected
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
		await handleChargeSuccess(
			c,
			CorePayments.readIncomingCharge(data),
			webhookEventId
		);
	} else if (event === PaystackWebhookEvent.TransferSuccess) {
		await handleTransferSuccess(c, data, webhookEventId);
	} else if (event === PaystackWebhookEvent.TransferFailure) {
		await handleTransferFailure(c, data, webhookEventId);
	} else if (event === PaystackWebhookEvent.TransferReversed) {
		await handleTransferReversed(c, data, webhookEventId);
	} else if (event === PaystackWebhookEvent.BankTransferRejected) {
		await handleTransferRejection(c, CorePayments.readTransferRejection(data));
	}
};

// TODO: We should validate the data input, but I'm worried that Paystack might
// update the schema without warning.

export const handleChargeSuccess = async (
	c: Context<AppEnv>,
	charge: IncomingCharge,
	webhookEventId?: string | null
) => {
	if (charge.instrument === 'dedicated_account' && !charge.orderId) {
		c.var.logger.warn(
			{ reference: charge.reference },
			'payment.unsolicited_transfer_ignored'
		);
	} else if (charge.orderId) {
		if (charge.amount == null) {
			// Cannot prove the shopper paid the order total. Leave it unpaid.
			c.var.logger.error(
				{
					orderId: charge.orderId,
					reference: charge.reference,
					handling: 'left_unpaid'
				},
				'payment.charge_amount_missing'
			);
		} else {
			await transitionOrderToPending(c, charge.orderId, webhookEventId, {
				amount: charge.amount,
				reference: charge.reference,
				currency: charge.currency
			});
		}
	} else {
		c.var.logger.warn(
			{ reference: charge.reference, instrument: charge.instrument },
			'charge.success_without_order'
		);
	}

	if (charge.card) {
		await processCardCharge(c, charge.card);
	}

	return true;
};

const handleTransferRejection = async (
	c: Context<AppEnv>,
	rejection: IncomingTransferRejection
) => {
	// A dedicated-account rejection is not a checkout payment.
	if (rejection.instrument === 'dedicated_account') {
		c.var.logger.warn(
			{
				orderId: rejection.orderId,
				reference: rejection.reference,
				reason: rejection.reason
			},
			'payment.transfer_rejected_ignored'
		);
		return;
	}

	c.var.logger.error(
		{
			orderId: rejection.orderId,
			reference: rejection.reference,
			amount: rejection.amount,
			reason: rejection.reason
		},
		'payment.transfer_rejected'
	);

	if (!rejection.orderId) return;

	const order = await OrderData.getOrderById(c.var.prisma, rejection.orderId);

	if (!order) {
		c.var.logger.warn(
			{ orderId: rejection.orderId, reference: rejection.reference },
			'payment.transfer_rejected_order_missing'
		);
		return;
	}

	// The provider refunds the rejected transfer, and checkout can still take
	// the correct amount. Cancelling here would drop a later successful charge.
	// The expiry job closes the order if they never pay.
	if (order.status !== OrderStatus.PaymentPending) {
		c.var.logger.warn(
			{
				orderId: order.id,
				status: order.status,
				reference: rejection.reference
			},
			'payment.transfer_rejected_order_not_pending'
		);
		return;
	}

	const tokens = await c.var.prisma.userPushToken.findMany({
		where: { userId: order.userId, type: PushTokenType.Shopper }
	});

	if (tokens.length === 0) return;

	c.var.services.notifications.queueNotification({
		type: NotificationType.PaymentRejected,
		data: { orderId: order.id },
		recipientTokens: tokens.map(token => token.token)
	});
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
		return await handleChargeSuccess(c, CorePayments.readIncomingCharge(data));
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

export interface ExpiredPaymentPendingOrder {
	id: string;
	userId: string;
	storeId: string;
	total: number;
	pushTokens: string[];
}

/**
 * Cancels PaymentPending orders older than the checkout transfer window and
 * puts their stock back. A charge that lands first moves the order to Pending
 * inside its own transaction, and this re-reads status before restoring.
 */
export const expirePaymentPendingOrders = async (
	prisma: PrismaClient,
	options: {
		now?: Date;
		expiryMs?: number;
		logger?: Pick<Logger, 'info' | 'warn' | 'error'>;
	} = {}
): Promise<ExpiredPaymentPendingOrder[]> => {
	const now = options.now ?? new Date();
	const expiryMs = options.expiryMs ?? DEFAULT_PAYMENT_PENDING_EXPIRY_MS;
	const logger = options.logger ?? rootLogger;
	const cutoff = new Date(now.getTime() - expiryMs);

	const staleOrders = await prisma.order.findMany({
		where: {
			status: OrderStatus.PaymentPending,
			createdAt: { lt: cutoff }
		},
		include: {
			products: true,
			user: { include: { pushTokens: true } }
		}
	});

	const expired: ExpiredPaymentPendingOrder[] = [];

	for (const order of staleOrders) {
		try {
			const cancelled = await runSerializable(prisma, async tx => {
				const current = await tx.order.findUnique({
					where: { id: order.id }
				});

				if (!current || current.status !== OrderStatus.PaymentPending) {
					return false;
				}

				await OrderData.restoreProductQuantities(tx, {
					products: order.products.map(product => ({
						productId: product.productId,
						quantity: product.quantity
					}))
				});

				await OrderData.updateOrderStatus(tx, current, OrderStatus.Cancelled);

				return true;
			});

			if (!cancelled) continue;

			const pushTokens = order.user.pushTokens
				.filter(token => token.type === PushTokenType.Shopper)
				.map(token => token.token);

			expired.push({
				id: order.id,
				userId: order.userId,
				storeId: order.storeId,
				total: order.total,
				pushTokens
			});

			logger.info(
				{
					orderId: order.id,
					storeId: order.storeId,
					createdAt: order.createdAt
				},
				'payment_pending.expired'
			);
		} catch (error) {
			logger.error(
				{ err: error, orderId: order.id },
				'payment_pending.expire_failed'
			);
		}
	}

	return expired;
};
