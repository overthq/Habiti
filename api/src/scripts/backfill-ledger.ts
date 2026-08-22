import prisma from '../config/prisma';
import {
	AccountKind,
	EntryDirection,
	LedgerReason,
	PayoutStatus,
	TransactionStatus,
	TransactionType
} from '../generated/prisma/client';
import {
	getOrCreateAccount,
	postJournal,
	realizedRevenueOf,
	rebuildStoreProjections,
	replayStore,
	type PostJournalEntry
} from '../core/data/ledger';
import { recordPayoutRequested } from '../core/data/postings';
import { runSerializable } from '../utils/prisma';
import { rootLogger } from '../services/logger';

/**
 * Seeds the double-entry ledger from the pre-ledger `Store` columns.
 *
 * Deliberately an *opening balance*, not a replay of order history. Replaying
 * would mean deriving balances from records we know to be wrong -- the old
 * `Refund` classification moved the ledger and the store columns in opposite
 * directions -- and any disagreement with payouts already made would be a
 * disagreement about money merchants have already been paid. The opening
 * balance asserts only what is true today, and the ledger is authoritative
 * from here forward.
 *
 * Pre-cutover history stays in the `Transaction` table, read-only. It is not
 * merged into the statement: the two have incompatible running balances, and a
 * seam where `balanceAfter` silently changes meaning is worse than a clean
 * start.
 *
 * Idempotent -- every journal carries a deterministic key, so re-running is a
 * no-op.
 *
 * Run: cd api && bun run src/scripts/backfill-ledger.ts [--dry-run]
 */

const DRY_RUN = process.argv.includes('--dry-run');

interface StoreSnapshot {
	id: string;
	name: string;
	unrealizedRevenue: bigint;
	realizedRevenue: bigint;
	paidOut: bigint;
}

const nonZero = (entries: PostJournalEntry[]) =>
	entries.filter(entry => entry.amount !== 0n);

const backfillStore = async (store: StoreSnapshot) => {
	// In-flight payouts, which the old schema tracked as Processing rows rather
	// than a column.
	const inFlight = await prisma.transaction.findMany({
		where: {
			storeId: store.id,
			type: TransactionType.Payout,
			status: TransactionStatus.Processing
		},
		select: { id: true, amount: true, createdAt: true }
	});

	const pendingPayouts = inFlight.reduce(
		(sum, row) => sum + BigInt(row.amount),
		0n
	);

	const unrealized = store.unrealizedRevenue;
	const paidOut = store.paidOut;
	// Withdrawable *before* in-flight payouts are subtracted: the
	// PayoutRequested journals below move that portion into transit.
	const availableGross = store.realizedRevenue - paidOut;

	if (DRY_RUN) {
		rootLogger.info(
			{
				store: store.name,
				unrealized,
				availableGross,
				paidOut,
				pendingPayouts,
				inFlightCount: inFlight.length
			},
			'backfill.plan'
		);
		return { skipped: false };
	}

	await runSerializable(prisma, async tx => {
		const cash = await getOrCreateAccount(tx, {
			kind: AccountKind.PlatformCash
		});
		const pending = await getOrCreateAccount(tx, {
			kind: AccountKind.StorePending,
			storeId: store.id
		});
		const available = await getOrCreateAccount(tx, {
			kind: AccountKind.StoreAvailable,
			storeId: store.id
		});
		const inTransit = await getOrCreateAccount(tx, {
			kind: AccountKind.StorePayoutInTransit,
			storeId: store.id
		});

		// 1. Current positions: what we are holding for this store right now.
		const positionEntries = nonZero([
			{
				account: cash,
				direction: EntryDirection.Debit,
				amount: unrealized + availableGross
			},
			{
				account: pending,
				direction: EntryDirection.Credit,
				amount: unrealized
			},
			{
				account: available,
				direction: EntryDirection.Credit,
				amount: availableGross
			}
		]);

		if (positionEntries.length >= 2) {
			await postJournal(tx, {
				reason: LedgerReason.OpeningBalance,
				idempotencyKey: `opening:${store.id}:positions`,
				description: 'Opening balance',
				entries: positionEntries
			});
		}

		// 2. Historical `paidOut` is a lifetime counter, not a position, so it
		//    cannot be expressed as a balance. Reproduce it with a settled
		//    payout whose net effect on every position is zero.
		if (paidOut > 0n) {
			await postJournal(tx, {
				reason: LedgerReason.OpeningBalance,
				idempotencyKey: `opening:${store.id}:paid-out-seed`,
				description: 'Opening balance — historical payouts',
				entries: [
					{ account: cash, direction: EntryDirection.Debit, amount: paidOut },
					{
						account: inTransit,
						direction: EntryDirection.Credit,
						amount: paidOut
					}
				]
			});

			await postJournal(tx, {
				reason: LedgerReason.PayoutSettled,
				idempotencyKey: `opening:${store.id}:paid-out-settled`,
				description: 'Opening balance — historical payouts settled',
				entries: [
					{
						account: inTransit,
						direction: EntryDirection.Debit,
						amount: paidOut
					},
					{ account: cash, direction: EntryDirection.Credit, amount: paidOut }
				]
			});
		}

		// 3. Re-create in-flight payouts under their original ids, so a
		//    `transfer.success` still in flight at Paystack resolves against the
		//    same reference it was issued with.
		for (const row of inFlight) {
			const amount = BigInt(row.amount);

			await tx.payoutRequest.upsert({
				where: { id: row.id },
				update: {},
				create: {
					id: row.id,
					storeId: store.id,
					amount,
					status: PayoutStatus.Processing,
					providerRef: row.id,
					createdAt: row.createdAt
				}
			});

			await recordPayoutRequested(tx, {
				storeId: store.id,
				payoutRequestId: row.id,
				amount
			});
		}

		// The store's columns already hold the pre-ledger values, and
		// `postJournal` folds each journal *into* them incrementally -- so
		// posting an opening balance on top would double every figure.
		// Rebuilding derives them from the journals alone, which is both
		// correct and idempotent: a re-run posts no new journals and rebuilds
		// to the same numbers.
		await rebuildStoreProjections(tx, store.id);
	});

	// 4. Prove the ledger reproduces what we started from.
	const replay = await replayStore(prisma as never, store.id);
	const rebuilt = {
		unrealizedRevenue: replay.projection.unrealizedRevenue,
		realizedRevenue: realizedRevenueOf(replay.projection),
		paidOut: replay.projection.paidOut,
		pendingPayouts: replay.projection.pendingPayouts
	};

	const expected = {
		unrealizedRevenue: unrealized,
		realizedRevenue: store.realizedRevenue,
		paidOut,
		pendingPayouts
	};

	const mismatched = (
		Object.keys(expected) as (keyof typeof expected)[]
	).filter(key => rebuilt[key] !== expected[key]);

	if (mismatched.length > 0) {
		throw new Error(
			`Backfill for store ${store.id} does not reproduce its balances. ` +
				`Mismatched: ${mismatched.join(', ')}. ` +
				`Expected ${JSON.stringify(expected, bigintReplacer)}, ` +
				`got ${JSON.stringify(rebuilt, bigintReplacer)}`
		);
	}

	return { skipped: false };
};

const bigintReplacer = (_key: string, value: unknown) =>
	typeof value === 'bigint' ? value.toString() : value;

async function backfillLedger() {
	const stores = await prisma.store.findMany({
		select: {
			id: true,
			name: true,
			unrealizedRevenue: true,
			realizedRevenue: true,
			paidOut: true
		}
	});

	rootLogger.info(
		{ storeCount: stores.length, dryRun: DRY_RUN },
		'backfill.start'
	);

	let done = 0;

	for (const store of stores) {
		await backfillStore(store);
		done++;
	}

	rootLogger.info({ backfilled: done, dryRun: DRY_RUN }, 'backfill.complete');
}

backfillLedger()
	.catch(err => {
		rootLogger.error({ err }, 'backfill.failed');
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
