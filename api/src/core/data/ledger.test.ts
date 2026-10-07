import { describe, expect, test } from 'bun:test';

import {
	AccountKind,
	EntryDirection,
	LedgerReason,
	PayoutStatus,
	TransactionStatus,
	TransactionType
} from '../../generated/prisma/client';
import {
	emptyProjection,
	foldJournals,
	oppositeDirection,
	presentEntries,
	realizedRevenueOf,
	signedEntry,
	type JournalEffect,
	type StoreProjection
} from './ledger';

/**
 * The accounting fold, exercised without a database.
 *
 * These tests are the specification for what each business event does to a
 * store's money. If the postings in `stores.ts` / `transactions.ts` ever drift
 * from the table in the plan, this is what catches it.
 */

const STORE = 'store-1';
const USER = 'user-1';

let nextSequence = 0n;

const journal = (
	reason: LedgerReason,
	entries: {
		kind: AccountKind;
		direction: EntryDirection;
		amount: bigint;
		storeId?: string | null | undefined;
		userId?: string | null | undefined;
	}[],
	extra: Partial<Pick<JournalEffect, 'payoutRequestId' | 'orderId'>> = {}
): JournalEffect => {
	nextSequence += 1n;

	return {
		transactionId: `tx-${nextSequence}`,
		sequence: nextSequence,
		reason,
		description: null,
		orderId: extra.orderId ?? null,
		payoutRequestId: extra.payoutRequestId ?? null,
		createdAt: new Date(Number(nextSequence) * 1000),
		entries: entries.map(entry => ({
			kind: entry.kind,
			direction: entry.direction,
			amount: entry.amount,
			storeId: entry.storeId === undefined ? STORE : entry.storeId,
			userId: entry.userId ?? null
		}))
	};
};

const debit = (kind: AccountKind, amount: bigint, storeId?: string | null) => ({
	kind,
	direction: EntryDirection.Debit,
	amount,
	storeId
});

const credit = (
	kind: AccountKind,
	amount: bigint,
	storeId?: string | null
) => ({
	kind,
	direction: EntryDirection.Credit,
	amount,
	storeId
});

// --- The postings, one per business event --------------------------------

const orderPaid = (total: bigint, fee: bigint) =>
	journal(LedgerReason.OrderPaid, [
		debit(AccountKind.PlatformCash, total + fee, null),
		credit(AccountKind.StorePending, total),
		credit(AccountKind.PlatformFeeRevenue, fee, null)
	]);

const orderCompleted = (total: bigint) =>
	journal(LedgerReason.OrderCompleted, [
		debit(AccountKind.StorePending, total),
		credit(AccountKind.StoreAvailable, total)
	]);

const refundIssued = (total: bigint) =>
	journal(LedgerReason.RefundIssued, [
		debit(AccountKind.StoreAvailable, total),
		{
			kind: AccountKind.CustomerCredit,
			direction: EntryDirection.Credit,
			amount: total,
			storeId: null,
			userId: USER
		}
	]);

const cancelledBeforeCompletion = (total: bigint) =>
	journal(LedgerReason.OrderCancelledBeforeCompletion, [
		debit(AccountKind.StorePending, total),
		{
			kind: AccountKind.CustomerCredit,
			direction: EntryDirection.Credit,
			amount: total,
			storeId: null,
			userId: USER
		}
	]);

const payoutRequested = (amount: bigint, id: string) =>
	journal(
		LedgerReason.PayoutRequested,
		[
			debit(AccountKind.StoreAvailable, amount),
			credit(AccountKind.StorePayoutInTransit, amount)
		],
		{ payoutRequestId: id }
	);

const payoutSettled = (amount: bigint, id: string) =>
	journal(
		LedgerReason.PayoutSettled,
		[
			debit(AccountKind.StorePayoutInTransit, amount),
			credit(AccountKind.PlatformCash, amount, null)
		],
		{ payoutRequestId: id }
	);

const payoutFailed = (amount: bigint, id: string) =>
	journal(
		LedgerReason.PayoutFailed,
		[
			debit(AccountKind.StorePayoutInTransit, amount),
			credit(AccountKind.StoreAvailable, amount)
		],
		{ payoutRequestId: id }
	);

const fold = (
	journals: JournalEffect[],
	statuses?: Map<string, PayoutStatus>
) => foldJournals(journals, STORE, statuses);

/** The identity the payout check and the dashboard both depend on. */
const expectIdentity = (projection: StoreProjection) => {
	expect(
		realizedRevenueOf(projection) -
			projection.paidOut -
			projection.pendingPayouts
	).toBe(projection.available);
};

describe('ledger fold', () => {
	test('payment lands in pending, not available', () => {
		const { projection } = fold([orderPaid(100_000n, 500n)]);

		expect(projection.unrealizedRevenue).toBe(100_000n);
		expect(projection.available).toBe(0n);
		expectIdentity(projection);
	});

	test('completion moves pending to available', () => {
		const { projection } = fold([
			orderPaid(100_000n, 500n),
			orderCompleted(100_000n)
		]);

		expect(projection.unrealizedRevenue).toBe(0n);
		expect(projection.available).toBe(100_000n);
		expect(realizedRevenueOf(projection)).toBe(100_000n);
		expectIdentity(projection);
	});

	/**
	 * The bug this rework exists to make impossible: the old code classified
	 * `Refund` as a credit while its only caller decremented `realizedRevenue`,
	 * so the two records moved in opposite directions on every refund.
	 */
	test('refund lowers both available and realized revenue', () => {
		const { projection } = fold([
			orderPaid(100_000n, 500n),
			orderCompleted(100_000n),
			refundIssued(100_000n)
		]);

		expect(projection.available).toBe(0n);
		expect(realizedRevenueOf(projection)).toBe(0n);
		expectIdentity(projection);
	});

	test('cancelling before completion never touches available', () => {
		const { projection } = fold([
			orderPaid(100_000n, 500n),
			cancelledBeforeCompletion(100_000n)
		]);

		expect(projection.unrealizedRevenue).toBe(0n);
		expect(projection.available).toBe(0n);
		expect(realizedRevenueOf(projection)).toBe(0n);
		expectIdentity(projection);
	});

	test('requested payout leaves available immediately, before settling', () => {
		const { projection } = fold([
			orderPaid(100_000n, 500n),
			orderCompleted(100_000n),
			payoutRequested(40_000n, 'p1')
		]);

		expect(projection.available).toBe(60_000n);
		expect(projection.pendingPayouts).toBe(40_000n);
		expect(projection.paidOut).toBe(0n);
		expect(realizedRevenueOf(projection)).toBe(100_000n);
		expectIdentity(projection);
	});

	test('settlement moves in-transit to paid out, available unchanged', () => {
		const { projection } = fold([
			orderPaid(100_000n, 500n),
			orderCompleted(100_000n),
			payoutRequested(40_000n, 'p1'),
			payoutSettled(40_000n, 'p1')
		]);

		expect(projection.available).toBe(60_000n);
		expect(projection.pendingPayouts).toBe(0n);
		expect(projection.paidOut).toBe(40_000n);
		expect(realizedRevenueOf(projection)).toBe(100_000n);
		expectIdentity(projection);
	});

	test('failed payout returns the money and does not count as paid out', () => {
		const { projection } = fold([
			orderPaid(100_000n, 500n),
			orderCompleted(100_000n),
			payoutRequested(40_000n, 'p1'),
			payoutFailed(40_000n, 'p1')
		]);

		expect(projection.available).toBe(100_000n);
		expect(projection.pendingPayouts).toBe(0n);
		expect(projection.paidOut).toBe(0n);
		expect(realizedRevenueOf(projection)).toBe(100_000n);
		expectIdentity(projection);
	});

	test("another store's journals never move this store", () => {
		const foreign = journal(LedgerReason.OrderCompleted, [
			debit(AccountKind.StorePending, 50_000n, 'store-2'),
			credit(AccountKind.StoreAvailable, 50_000n, 'store-2')
		]);

		const { projection } = fold([
			orderPaid(100_000n, 500n),
			orderCompleted(100_000n),
			foreign
		]);

		expect(projection.available).toBe(100_000n);
		expectIdentity(projection);
	});

	test('projection is empty before any journal', () => {
		const { projection } = fold([]);
		expect(projection).toEqual(emptyProjection());
		expectIdentity(projection);
	});
});

describe('statement projection', () => {
	test('shows completion, refund and payout; hides payment and settlement', () => {
		const { statement } = fold(
			[
				orderPaid(100_000n, 500n),
				orderCompleted(100_000n),
				payoutRequested(40_000n, 'p1'),
				payoutSettled(40_000n, 'p1'),
				refundIssued(10_000n)
			],
			new Map([['p1', PayoutStatus.Settled]])
		);

		expect(statement.map(row => row.type)).toEqual([
			TransactionType.Revenue,
			TransactionType.Payout,
			TransactionType.Refund
		]);
	});

	test('balanceAfter tracks the withdrawable balance', () => {
		const { statement, projection } = fold([
			orderPaid(100_000n, 500n),
			orderCompleted(100_000n),
			payoutRequested(40_000n, 'p1')
		]);

		expect(statement.map(row => row.balanceAfter)).toEqual([100_000n, 60_000n]);
		expect(statement[statement.length - 1]!.balanceAfter).toBe(
			projection.available
		);
	});

	test('a payout row carries the request status, not a fixed Success', () => {
		const journals = [
			orderPaid(100_000n, 500n),
			orderCompleted(100_000n),
			payoutRequested(40_000n, 'p1')
		];

		const processing = fold(
			journals,
			new Map([['p1', PayoutStatus.Processing]])
		);
		const failed = fold(journals, new Map([['p1', PayoutStatus.Failed]]));

		expect(processing.statement[1]!.status).toBe(TransactionStatus.Processing);
		expect(failed.statement[1]!.status).toBe(TransactionStatus.Failure);
	});

	test('a cancelled-before-completion order produces no statement row', () => {
		const { statement } = fold([
			orderPaid(100_000n, 500n),
			cancelledBeforeCompletion(100_000n)
		]);

		expect(statement).toEqual([]);
	});

	test('a failed payout adds a reversing row and leaves the original', () => {
		const { statement } = fold(
			[
				orderPaid(100_000n, 500n),
				orderCompleted(100_000n),
				payoutRequested(40_000n, 'p1'),
				payoutFailed(40_000n, 'p1')
			],
			new Map([['p1', PayoutStatus.Failed]])
		);

		expect(statement.map(row => row.type)).toEqual([
			TransactionType.Revenue,
			TransactionType.Payout,
			TransactionType.Adjustment
		]);
		expect(statement[1]!.status).toBe(TransactionStatus.Failure);
		expect(statement[2]!.balanceAfter).toBe(100_000n);
	});
});

/**
 * Property-style cover for the invariant everything else rests on.
 *
 * The specific sequences above were chosen by hand, which means they test the
 * cases I thought of. This throws arbitrary but *legal* histories at the fold
 * -- money can only be completed if it was paid, only be refunded if it was
 * completed, only be paid out if it is available -- and checks that the
 * identity survives all of them.
 */
describe('fold invariants under arbitrary histories', () => {
	// Deterministic PRNG so a failure is reproducible from the seed alone.
	const rng = (seed: number) => () => {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff;
		return seed / 0x7fffffff;
	};

	const buildHistory = (seed: number) => {
		const next = rng(seed);
		const journals: JournalEffect[] = [];

		let pending = 0n;
		let available = 0n;
		let inTransit = 0n;
		let payoutCount = 0;
		let orderCount = 0;

		for (let step = 0; step < 40; step++) {
			const roll = next();
			const amount = BigInt(1 + Math.floor(next() * 500)) * 100n;

			if (roll < 0.3) {
				journals.push(orderPaid(amount, 500n));
				pending += amount;
			} else if (roll < 0.5 && pending > 0n) {
				const take = pending;
				journals.push(orderCompleted(take));
				pending -= take;
				available += take;
				orderCount++;
			} else if (roll < 0.6 && available > 0n) {
				journals.push(refundIssued(available));
				available = 0n;
			} else if (roll < 0.7 && pending > 0n) {
				journals.push(cancelledBeforeCompletion(pending));
				pending = 0n;
			} else if (roll < 0.85 && available > 0n) {
				const id = `p${++payoutCount}`;
				journals.push(payoutRequested(available, id));
				inTransit += available;
				available = 0n;
			} else if (inTransit > 0n && payoutCount > 0) {
				const id = `p${payoutCount}`;
				if (next() < 0.5) {
					journals.push(payoutSettled(inTransit, id));
				} else {
					journals.push(payoutFailed(inTransit, id));
					available += inTransit;
				}
				inTransit = 0n;
			}
		}

		return {
			journals,
			expected: { pending, available, inTransit, orderCount }
		};
	};

	test('the balance identity holds for every prefix of every history', () => {
		for (let seed = 1; seed <= 50; seed++) {
			const { journals } = buildHistory(seed);

			for (let cut = 0; cut <= journals.length; cut++) {
				const { projection } = fold(journals.slice(0, cut));

				expect(
					realizedRevenueOf(projection) -
						projection.paidOut -
						projection.pendingPayouts
				).toBe(projection.available);
			}
		}
	});

	test('no bucket ever goes negative', () => {
		for (let seed = 1; seed <= 50; seed++) {
			const { journals } = buildHistory(seed);
			const { projection } = fold(journals);

			expect(projection.available >= 0n).toBe(true);
			expect(projection.unrealizedRevenue >= 0n).toBe(true);
			expect(projection.pendingPayouts >= 0n).toBe(true);
			expect(projection.paidOut >= 0n).toBe(true);
		}
	});

	test('the fold tracks the buckets the history intended', () => {
		for (let seed = 1; seed <= 50; seed++) {
			const { journals, expected } = buildHistory(seed);
			const { projection } = fold(journals);

			expect(projection.unrealizedRevenue).toBe(expected.pending);
			expect(projection.available).toBe(expected.available);
			expect(projection.pendingPayouts).toBe(expected.inTransit);
		}
	});

	test('statement balanceAfter always equals the available balance at that point', () => {
		for (let seed = 1; seed <= 50; seed++) {
			const { journals } = buildHistory(seed);
			const { statement } = fold(journals);

			for (const row of statement) {
				const upTo = journals.findIndex(
					j => j.transactionId === row.transactionId
				);
				const { projection } = fold(journals.slice(0, upTo + 1));

				expect(row.balanceAfter).toBe(projection.available);
			}
		}
	});
});

/**
 * Regression cover for the production backfill failure.
 *
 * A store that was paid out and then had orders refunded can end up with
 * `paidOut` exceeding `realizedRevenue` -- the old refund path decremented
 * realized revenue while paid-out only ever rose. The opening balance for such
 * a store is negative, which the first version of the backfill could not
 * express: it tried to post a credit of -350,000 and was rejected by the
 * "amounts are always positive" rule.
 */
describe('signed entries', () => {
	const account = {
		id: 'acct-1',
		kind: AccountKind.StoreAvailable,
		storeId: STORE,
		userId: null
	};

	test('a positive amount keeps its direction', () => {
		const entry = signedEntry(account, 500n, EntryDirection.Credit);

		expect(entry).toEqual({
			account,
			direction: EntryDirection.Credit,
			amount: 500n
		});
	});

	test('a negative amount flips direction and keeps the amount positive', () => {
		const entry = signedEntry(account, -350_000n, EntryDirection.Credit);

		expect(entry).toEqual({
			account,
			direction: EntryDirection.Debit,
			amount: 350_000n
		});
	});

	test('a zero amount produces nothing', () => {
		expect(signedEntry(account, 0n, EntryDirection.Debit)).toBeNull();
		expect(
			presentEntries([signedEntry(account, 0n, EntryDirection.Debit)])
		).toEqual([]);
	});

	test('flipping preserves the journal arithmetic', () => {
		// Intent: debit cash by (U + A), credit available by A, with A negative.
		const cash = {
			id: 'acct-cash',
			kind: AccountKind.PlatformCash,
			storeId: null,
			userId: null
		};

		const entries = presentEntries([
			signedEntry(cash, -350_000n, EntryDirection.Debit),
			signedEntry(account, -350_000n, EntryDirection.Credit)
		]);

		const total = (direction: EntryDirection) =>
			entries
				.filter(e => e.direction === direction)
				.reduce((sum, e) => sum + e.amount, 0n);

		expect(total(EntryDirection.Debit)).toBe(total(EntryDirection.Credit));
		expect(entries.every(e => e.amount > 0n)).toBe(true);
	});

	test('oppositeDirection is an involution', () => {
		expect(oppositeDirection(EntryDirection.Debit)).toBe(EntryDirection.Credit);
		expect(oppositeDirection(oppositeDirection(EntryDirection.Debit))).toBe(
			EntryDirection.Debit
		);
	});
});

describe('overdrawn opening balance', () => {
	/** The mirrored opening balance the backfill posts for such a store. */
	const overdrawnOpening = (paidOut: bigint) => [
		journal(LedgerReason.OpeningBalance, [
			credit(AccountKind.PlatformCash, paidOut, null),
			debit(AccountKind.StoreAvailable, paidOut)
		]),
		journal(LedgerReason.OpeningBalance, [
			debit(AccountKind.PlatformCash, paidOut, null),
			credit(AccountKind.StorePayoutInTransit, paidOut)
		]),
		journal(LedgerReason.PayoutSettled, [
			debit(AccountKind.StorePayoutInTransit, paidOut),
			credit(AccountKind.PlatformCash, paidOut, null)
		])
	];

	test('reproduces a store that was paid out more than it earned', () => {
		const { projection } = fold(overdrawnOpening(350_000n));

		expect(projection.available).toBe(-350_000n);
		expect(projection.paidOut).toBe(350_000n);
		expect(projection.pendingPayouts).toBe(0n);
		// realizedRevenue = available + paidOut + pendingPayouts = 0, which is
		// exactly what the legacy columns said.
		expect(realizedRevenueOf(projection)).toBe(0n);
		expectIdentity(projection);
	});

	test('the store can trade back out of the hole', () => {
		const { projection } = fold([
			...overdrawnOpening(350_000n),
			orderPaid(500_000n, 1_000n),
			orderCompleted(500_000n)
		]);

		expect(projection.available).toBe(150_000n);
		expect(projection.paidOut).toBe(350_000n);
		expect(realizedRevenueOf(projection)).toBe(500_000n);
		expectIdentity(projection);
	});
});
