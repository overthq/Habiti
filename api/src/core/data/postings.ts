import {
	AccountKind,
	EntryDirection,
	LedgerReason
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';
import {
	getOrCreateAccount,
	postJournal,
	type PostJournalEntry,
	type PostJournalResult
} from './ledger';

/**
 * Entries of zero are dropped rather than rejected: a store with no service
 * fee is a legitimate order, not a malformed journal. The remaining entries
 * still have to balance.
 */
const nonZero = (entries: PostJournalEntry[]) =>
	entries.filter(entry => entry.amount !== 0n);

interface OrderPaidParams {
	storeId: string;
	orderId: string;
	total: bigint;
	serviceFee: bigint;
	webhookEventId?: string | null;
}

export const recordOrderPaid = async (
	tx: TransactionClient,
	params: OrderPaidParams
): Promise<PostJournalResult> => {
	const cash = await getOrCreateAccount(tx, { kind: AccountKind.PlatformCash });
	const pending = await getOrCreateAccount(tx, {
		kind: AccountKind.StorePending,
		storeId: params.storeId
	});
	const feeRevenue = await getOrCreateAccount(tx, {
		kind: AccountKind.PlatformFeeRevenue
	});

	return postJournal(tx, {
		reason: LedgerReason.OrderPaid,
		idempotencyKey: `order:${params.orderId}:paid`,
		description: 'Payment confirmed',
		orderId: params.orderId,
		webhookEventId: params.webhookEventId ?? null,
		entries: nonZero([
			{
				account: cash,
				direction: EntryDirection.Debit,
				amount: params.total + params.serviceFee
			},
			{
				account: pending,
				direction: EntryDirection.Credit,
				amount: params.total
			},
			{
				account: feeRevenue,
				direction: EntryDirection.Credit,
				amount: params.serviceFee
			}
		])
	});
};

interface OrderCompletedParams {
	storeId: string;
	orderId: string;
	total: bigint;
}

export const recordOrderCompleted = async (
	tx: TransactionClient,
	params: OrderCompletedParams
): Promise<PostJournalResult> => {
	const pending = await getOrCreateAccount(tx, {
		kind: AccountKind.StorePending,
		storeId: params.storeId
	});
	const available = await getOrCreateAccount(tx, {
		kind: AccountKind.StoreAvailable,
		storeId: params.storeId
	});

	return postJournal(tx, {
		reason: LedgerReason.OrderCompleted,
		idempotencyKey: `order:${params.orderId}:completed`,
		description: 'Order completed',
		orderId: params.orderId,
		entries: [
			{
				account: pending,
				direction: EntryDirection.Debit,
				amount: params.total
			},
			{
				account: available,
				direction: EntryDirection.Credit,
				amount: params.total
			}
		]
	});
};

interface RefundParams {
	storeId: string;
	userId: string;
	orderId: string;
	total: bigint;
	wasRealized: boolean;
}

export const recordRefund = async (
	tx: TransactionClient,
	params: RefundParams
): Promise<PostJournalResult> => {
	const source = await getOrCreateAccount(tx, {
		kind: params.wasRealized
			? AccountKind.StoreAvailable
			: AccountKind.StorePending,
		storeId: params.storeId
	});
	const customerCredit = await getOrCreateAccount(tx, {
		kind: AccountKind.CustomerCredit,
		userId: params.userId
	});

	const reason = params.wasRealized
		? LedgerReason.RefundIssued
		: LedgerReason.OrderCancelledBeforeCompletion;

	return postJournal(tx, {
		reason,
		idempotencyKey: `order:${params.orderId}:refunded`,
		description: params.wasRealized
			? 'Order cancelled — refund'
			: 'Order cancelled before completion — refund',
		orderId: params.orderId,
		entries: [
			{
				account: source,
				direction: EntryDirection.Debit,
				amount: params.total
			},
			{
				account: customerCredit,
				direction: EntryDirection.Credit,
				amount: params.total
			}
		]
	});
};

interface PayoutRequestedParams {
	storeId: string;
	payoutRequestId: string;
	amount: bigint;
}

export const recordPayoutRequested = async (
	tx: TransactionClient,
	params: PayoutRequestedParams
): Promise<PostJournalResult> => {
	const available = await getOrCreateAccount(tx, {
		kind: AccountKind.StoreAvailable,
		storeId: params.storeId
	});
	const inTransit = await getOrCreateAccount(tx, {
		kind: AccountKind.StorePayoutInTransit,
		storeId: params.storeId
	});

	return postJournal(tx, {
		reason: LedgerReason.PayoutRequested,
		idempotencyKey: `payout:${params.payoutRequestId}:requested`,
		description: 'Payout requested',
		payoutRequestId: params.payoutRequestId,
		entries: [
			{
				account: available,
				direction: EntryDirection.Debit,
				amount: params.amount
			},
			{
				account: inTransit,
				direction: EntryDirection.Credit,
				amount: params.amount
			}
		]
	});
};

interface PayoutResolutionParams {
	storeId: string;
	payoutRequestId: string;
	amount: bigint;
	webhookEventId?: string | null;
}

export const recordPayoutSettled = async (
	tx: TransactionClient,
	params: PayoutResolutionParams
): Promise<PostJournalResult> => {
	const inTransit = await getOrCreateAccount(tx, {
		kind: AccountKind.StorePayoutInTransit,
		storeId: params.storeId
	});
	const cash = await getOrCreateAccount(tx, { kind: AccountKind.PlatformCash });

	return postJournal(tx, {
		reason: LedgerReason.PayoutSettled,
		idempotencyKey: `payout:${params.payoutRequestId}:settled`,
		description: 'Payout settled',
		payoutRequestId: params.payoutRequestId,
		webhookEventId: params.webhookEventId ?? null,
		entries: [
			{
				account: inTransit,
				direction: EntryDirection.Debit,
				amount: params.amount
			},
			{ account: cash, direction: EntryDirection.Credit, amount: params.amount }
		]
	});
};

export const recordPayoutFailed = async (
	tx: TransactionClient,
	params: PayoutResolutionParams
): Promise<PostJournalResult> => {
	const inTransit = await getOrCreateAccount(tx, {
		kind: AccountKind.StorePayoutInTransit,
		storeId: params.storeId
	});
	const available = await getOrCreateAccount(tx, {
		kind: AccountKind.StoreAvailable,
		storeId: params.storeId
	});

	return postJournal(tx, {
		reason: LedgerReason.PayoutFailed,
		idempotencyKey: `payout:${params.payoutRequestId}:failed`,
		description: 'Payout failed — reversed',
		payoutRequestId: params.payoutRequestId,
		webhookEventId: params.webhookEventId ?? null,
		entries: [
			{
				account: inTransit,
				direction: EntryDirection.Debit,
				amount: params.amount
			},
			{
				account: available,
				direction: EntryDirection.Credit,
				amount: params.amount
			}
		]
	});
};
