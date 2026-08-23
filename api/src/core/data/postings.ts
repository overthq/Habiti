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
 * The business-event vocabulary of the ledger. Every movement of money in the
 * system goes through exactly one of these, so the postings table lives in one
 * readable place rather than being spread across the call sites that trigger
 * it.
 *
 * Each function derives its own idempotency key from the event, so replaying a
 * webhook or retrying a request is a no-op rather than a double-count.
 */

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
	/** Order total, owed to the store. */
	total: bigint;
	/** Habiti's service fee, kept by the platform. */
	serviceFee: bigint;
	webhookEventId?: string | null;
}

/**
 * Customer's payment cleared.
 *
 * The Paystack processing fee is deliberately not booked: Paystack deducts it
 * before settling, so we never receive it. We record only the `total +
 * serviceFee` that actually reaches us.
 */
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

/** Order fulfilled: the store's money becomes withdrawable. */
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
	/** Whether the order had already completed, i.e. the money was withdrawable. */
	wasRealized: boolean;
}

/**
 * Order cancelled: the customer is made whole out of the store's balance.
 *
 * Which store bucket the money comes from depends on whether the order had
 * completed. Both cases credit the customer the same way -- the refund lands
 * in their credit account, which an admin can later cash out.
 */
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

/**
 * Payout requested. The money leaves the withdrawable balance immediately, so
 * a second request in the same window sees the reduced figure -- there is no
 * period where requested-but-unsettled money looks spendable.
 */
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

/** Paystack confirmed the transfer: the money has left the platform. */
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

/**
 * Transfer failed or was reversed: the money comes back to the store.
 *
 * This is a real reversing journal, not a compensating "adjustment" whose
 * direction had to be inferred.
 */
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

interface CustomerCreditWithdrawnParams {
	userId: string;
	amount: bigint;
	/** Distinguishes repeat withdrawals by the same customer. */
	reference: string;
}

/** Admin cashed a customer's refund credit out to them. */
export const recordCustomerCreditWithdrawn = async (
	tx: TransactionClient,
	params: CustomerCreditWithdrawnParams
): Promise<PostJournalResult> => {
	const customerCredit = await getOrCreateAccount(tx, {
		kind: AccountKind.CustomerCredit,
		userId: params.userId
	});
	const cash = await getOrCreateAccount(tx, { kind: AccountKind.PlatformCash });

	return postJournal(tx, {
		reason: LedgerReason.CustomerCreditWithdrawn,
		idempotencyKey: `credit:${params.userId}:withdrawn:${params.reference}`,
		description: 'Refund paid out to customer',
		entries: [
			{
				account: customerCredit,
				direction: EntryDirection.Debit,
				amount: params.amount
			},
			{ account: cash, direction: EntryDirection.Credit, amount: params.amount }
		]
	});
};
