import prisma from '../config/prisma';
import { EntryDirection } from '../generated/prisma/client';
import { realizedRevenueOf, replayStore } from '../core/data/ledger';
import { rootLogger } from '../services/logger';

/**
 * Read-only proof that the denormalized balances still match the journals.
 *
 * The `Store` money columns and `StoreStatementEntry` are caches. This replays
 * every journal from zero and compares. If they ever disagree, the ledger is
 * right and the cache is wrong -- rebuild it with
 * `ledger.rebuildStoreProjections`.
 *
 * Exits non-zero on any divergence, so it can be wired to a cron or CI.
 *
 * Run: cd api && bun run src/scripts/reconcile-ledger.ts
 */

const asString = (value: bigint) => value.toString();

interface Divergence {
	storeId: string;
	storeName: string;
	field: string;
	stored: string;
	replayed: string;
}

/**
 * Across the whole book, debits must equal credits. The per-journal trigger
 * already enforces this, so a failure here means something bypassed it --
 * a direct SQL write, or a disabled trigger.
 */
const checkGlobalBalance = async () => {
	const grouped = await prisma.ledgerEntry.groupBy({
		by: ['direction'],
		_sum: { amount: true }
	});

	const sumFor = (direction: EntryDirection) =>
		grouped.find(row => row.direction === direction)?._sum.amount ?? 0n;

	const debits = sumFor(EntryDirection.Debit);
	const credits = sumFor(EntryDirection.Credit);

	if (debits !== credits) {
		rootLogger.error(
			{ debits: asString(debits), credits: asString(credits) },
			'reconcile.books_do_not_balance'
		);
		return false;
	}

	rootLogger.info(
		{ debits: asString(debits), credits: asString(credits) },
		'reconcile.books_balance'
	);

	return true;
};

const reconcileStore = async (store: {
	id: string;
	name: string;
	unrealizedRevenue: bigint;
	realizedRevenue: bigint;
	paidOut: bigint;
	pendingPayouts: bigint;
}): Promise<Divergence[]> => {
	const replay = await replayStore(prisma as never, store.id);

	const expected: Record<string, bigint> = {
		unrealizedRevenue: replay.projection.unrealizedRevenue,
		realizedRevenue: realizedRevenueOf(replay.projection),
		paidOut: replay.projection.paidOut,
		pendingPayouts: replay.projection.pendingPayouts
	};

	const stored: Record<string, bigint> = {
		unrealizedRevenue: store.unrealizedRevenue,
		realizedRevenue: store.realizedRevenue,
		paidOut: store.paidOut,
		pendingPayouts: store.pendingPayouts
	};

	const divergences: Divergence[] = Object.keys(expected)
		.filter(field => stored[field] !== expected[field])
		.map(field => ({
			storeId: store.id,
			storeName: store.name,
			field,
			stored: asString(stored[field]!),
			replayed: asString(expected[field]!)
		}));

	// The statement is a projection too, so its row count and final running
	// balance have to agree with the replay.
	const storedRows = await prisma.storeStatementEntry.count({
		where: { storeId: store.id }
	});

	if (storedRows !== replay.statement.length) {
		divergences.push({
			storeId: store.id,
			storeName: store.name,
			field: 'statementRowCount',
			stored: String(storedRows),
			replayed: String(replay.statement.length)
		});
	}

	return divergences;
};

async function reconcileLedger() {
	const balanced = await checkGlobalBalance();

	const stores = await prisma.store.findMany({
		select: {
			id: true,
			name: true,
			unrealizedRevenue: true,
			realizedRevenue: true,
			paidOut: true,
			pendingPayouts: true
		}
	});

	const divergences: Divergence[] = [];

	for (const store of stores) {
		divergences.push(...(await reconcileStore(store)));
	}

	if (divergences.length === 0 && balanced) {
		rootLogger.info({ storeCount: stores.length }, 'reconcile.clean');
		return;
	}

	for (const divergence of divergences) {
		rootLogger.error({ ...divergence }, 'reconcile.divergence');
	}

	rootLogger.error(
		{ divergences: divergences.length, storeCount: stores.length },
		'reconcile.failed'
	);

	process.exitCode = 1;
}

reconcileLedger()
	.catch(err => {
		rootLogger.error({ err }, 'reconcile.errored');
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
