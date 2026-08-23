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
	presentEntries,
	realizedRevenueOf,
	rebuildStoreProjections,
	replayStore,
	signedEntry
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

const backfillStore = async (store: StoreSnapshot) => {
	// Already migrated? Stop here.
	//
	// This is a one-time migration per store, and its expectations come from
	// the frozen legacy tables. Once the store is live on the ledger those
	// expectations go stale -- a payout that has since settled still reads as
	// Processing in the old table -- so re-deriving them would compare today's
	// correct state against yesterday's inputs and fail. Skipping is both
	// correct and what makes re-running the script safe.
	const existing = await prisma.ledgerTransaction.findUnique({
		where: { idempotencyKey: `opening:${store.id}:positions` },
		select: { id: true }
	});

	const alreadySeeded =
		existing ??
		(await prisma.ledgerTransaction.findUnique({
			where: { idempotencyKey: `opening:${store.id}:paid-out-seed` },
			select: { id: true }
		}));

	if (alreadySeeded) {
		rootLogger.debug(
			{ storeId: store.id, store: store.name },
			'backfill.already_seeded'
		);
		return { outcome: 'already-seeded' as const };
	}

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

	// A negative position means the store was paid out more than it earned --
	// the old refund path decremented `realizedRevenue` while `paidOut` only
	// ever rose, so the two could cross. The ledger states it faithfully, but
	// it is an operational problem someone has to look at, so name the stores.
	const negatives = Object.entries({ unrealized, availableGross, paidOut })
		.filter(([, value]) => value < 0n)
		.map(([field]) => field);

	if (negatives.length > 0) {
		overdrawn.push({
			storeId: store.id,
			storeName: store.name,
			fields: negatives.join(', '),
			unrealized: unrealized.toString(),
			availableGross: availableGross.toString(),
			paidOut: paidOut.toString()
		});

		rootLogger.warn(
			{
				storeId: store.id,
				store: store.name,
				fields: negatives.join(', '),
				unrealized: unrealized.toString(),
				availableGross: availableGross.toString(),
				paidOut: paidOut.toString()
			},
			'backfill.negative_position'
		);
	}

	if (DRY_RUN) {
		rootLogger.info(
			{
				store: store.name,
				unrealized: unrealized.toString(),
				availableGross: availableGross.toString(),
				paidOut: paidOut.toString(),
				pendingPayouts: pendingPayouts.toString(),
				inFlightCount: inFlight.length
			},
			'backfill.plan'
		);
		return { outcome: 'planned' as const };
	}

	// A store that has never taken money needs no opening balance. Its columns
	// are already zero and the rebuild below confirms it.
	const hasNothingToSeed =
		unrealized === 0n &&
		availableGross === 0n &&
		paidOut === 0n &&
		inFlight.length === 0;

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
		//    Any of these can be negative -- see `signedEntry`.
		const positionEntries = presentEntries([
			signedEntry(cash, unrealized + availableGross, EntryDirection.Debit),
			signedEntry(pending, unrealized, EntryDirection.Credit),
			signedEntry(available, availableGross, EntryDirection.Credit)
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
		if (paidOut !== 0n) {
			await postJournal(tx, {
				reason: LedgerReason.OpeningBalance,
				idempotencyKey: `opening:${store.id}:paid-out-seed`,
				description: 'Opening balance — historical payouts',
				entries: presentEntries([
					signedEntry(cash, paidOut, EntryDirection.Debit),
					signedEntry(inTransit, paidOut, EntryDirection.Credit)
				])
			});

			await postJournal(tx, {
				reason: LedgerReason.PayoutSettled,
				idempotencyKey: `opening:${store.id}:paid-out-settled`,
				description: 'Opening balance — historical payouts settled',
				entries: presentEntries([
					signedEntry(inTransit, paidOut, EntryDirection.Debit),
					signedEntry(cash, paidOut, EntryDirection.Credit)
				])
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

	return {
		outcome: hasNothingToSeed ? ('empty' as const) : ('seeded' as const)
	};
};

const bigintReplacer = (_key: string, value: unknown) =>
	typeof value === 'bigint' ? value.toString() : value;

interface OverdrawnStore {
	storeId: string;
	storeName: string;
	fields: string;
	unrealized: string;
	availableGross: string;
	paidOut: string;
}

/** Stores whose opening position is negative. Reported at the end. */
const overdrawn: OverdrawnStore[] = [];

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

	const counts = {
		seeded: 0,
		empty: 0,
		'already-seeded': 0,
		planned: 0
	};

	for (const store of stores) {
		const { outcome } = await backfillStore(store);
		counts[outcome]++;
	}

	if (overdrawn.length > 0) {
		rootLogger.warn(
			{ count: overdrawn.length, stores: overdrawn },
			'backfill.negative_positions_summary'
		);
	}

	rootLogger.info(
		{
			// `seeded` is the only number that represents work done. `empty` is
			// a store that has never handled money, and `alreadySeeded` is one
			// migrated by an earlier run -- both are expected on a re-run.
			seeded: counts.seeded,
			empty: counts.empty,
			alreadySeeded: counts['already-seeded'],
			overdrawn: overdrawn.length,
			dryRun: DRY_RUN
		},
		'backfill.complete'
	);
}

backfillLedger()
	.catch(err => {
		rootLogger.error({ err }, 'backfill.failed');
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
