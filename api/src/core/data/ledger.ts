import {
	AccountKind,
	AccountType,
	EntryDirection,
	LedgerReason,
	PayoutStatus,
	PrismaClient,
	TransactionStatus,
	TransactionType
} from '../../generated/prisma/client';
import type { TransactionClient } from '../../generated/prisma/internal/prismaNamespace';

/**
 * The only module permitted to write ledger rows or the projections derived
 * from them (`Store`'s money columns and `StoreStatementEntry`). Everything
 * here is either a pure fold over journals or a write that performs that fold
 * in the same database transaction as the insert.
 *
 * The journals themselves are immutable -- the migration installs triggers
 * that reject UPDATE and DELETE. Corrections are reversing journals.
 */

const ACCOUNT_TYPE_BY_KIND: Record<AccountKind, AccountType> = {
	[AccountKind.PlatformCash]: AccountType.Asset,
	[AccountKind.PlatformFeeRevenue]: AccountType.Revenue,
	[AccountKind.StorePending]: AccountType.Liability,
	[AccountKind.StoreAvailable]: AccountType.Liability,
	[AccountKind.StorePayoutInTransit]: AccountType.Liability,
	[AccountKind.CustomerCredit]: AccountType.Liability
};

type OwnerScope = 'store' | 'user' | 'platform';

const OWNER_SCOPE_BY_KIND: Record<AccountKind, OwnerScope> = {
	[AccountKind.PlatformCash]: 'platform',
	[AccountKind.PlatformFeeRevenue]: 'platform',
	[AccountKind.StorePending]: 'store',
	[AccountKind.StoreAvailable]: 'store',
	[AccountKind.StorePayoutInTransit]: 'store',
	[AccountKind.CustomerCredit]: 'user'
};

// --- Projection -----------------------------------------------------------

/**
 * A store's money position, as denormalized onto `Store`.
 *
 * Only four of these are independent. `realizedRevenue` is defined as the
 * identity `available + paidOut + pendingPayouts`, which is what keeps
 * `available = realizedRevenue - paidOut - pendingPayouts` -- the formula the
 * payout check and the dashboard both rely on -- true by construction rather
 * than by two code paths happening to agree.
 */
export interface StoreProjection {
	/** balance(StorePending) */
	unrealizedRevenue: bigint;
	/** balance(StoreAvailable) */
	available: bigint;
	/** balance(StorePayoutInTransit) */
	pendingPayouts: bigint;
	/** cumulative debits from StorePayoutInTransit with reason PayoutSettled */
	paidOut: bigint;
}

export const emptyProjection = (): StoreProjection => ({
	unrealizedRevenue: 0n,
	available: 0n,
	pendingPayouts: 0n,
	paidOut: 0n
});

export const realizedRevenueOf = (p: StoreProjection): bigint =>
	p.available + p.paidOut + p.pendingPayouts;

interface JournalEntryEffect {
	kind: AccountKind;
	direction: EntryDirection;
	amount: bigint;
	storeId: string | null;
	userId: string | null;
}

export interface JournalEffect {
	transactionId: string;
	sequence: bigint;
	reason: LedgerReason;
	description: string | null;
	orderId: string | null;
	payoutRequestId: string | null;
	createdAt: Date;
	entries: JournalEntryEffect[];
}

/**
 * Liability accounts increase on credit. All four store buckets are
 * liabilities -- money we are holding on someone else's behalf -- so a credit
 * raises the balance and a debit lowers it.
 */
const signedDelta = (entry: JournalEntryEffect): bigint =>
	entry.direction === EntryDirection.Credit ? entry.amount : -entry.amount;

const applyJournal = (
	projection: StoreProjection,
	journal: JournalEffect,
	storeId: string
): StoreProjection => {
	const next: StoreProjection = { ...projection };

	for (const entry of journal.entries) {
		if (entry.storeId !== storeId) continue;

		switch (entry.kind) {
			case AccountKind.StorePending:
				next.unrealizedRevenue += signedDelta(entry);
				break;
			case AccountKind.StoreAvailable:
				next.available += signedDelta(entry);
				break;
			case AccountKind.StorePayoutInTransit:
				next.pendingPayouts += signedDelta(entry);
				// `paidOut` is a lifetime counter, not a position: it only moves
				// when a payout actually settles, never when one is reversed.
				//
				// Read from the signed delta rather than the direction, so a
				// mirrored settlement (which is how a negative opening balance
				// gets stated) decrements it instead of being ignored.
				if (journal.reason === LedgerReason.PayoutSettled) {
					next.paidOut -= signedDelta(entry);
				}
				break;
			default:
				break;
		}
	}

	return next;
};

// --- Statement projection -------------------------------------------------

const STATEMENT_TYPE_BY_REASON: Partial<Record<LedgerReason, TransactionType>> =
	{
		[LedgerReason.OrderCompleted]: TransactionType.Revenue,
		[LedgerReason.RefundIssued]: TransactionType.Refund,
		[LedgerReason.OrderCancelledBeforeCompletion]: TransactionType.Refund,
		[LedgerReason.PayoutRequested]: TransactionType.Payout,
		[LedgerReason.PayoutFailed]: TransactionType.Adjustment,
		[LedgerReason.SubscriptionFee]: TransactionType.SubscriptionFee,
		[LedgerReason.OpeningBalance]: TransactionType.Adjustment,
		[LedgerReason.ManualAdjustment]: TransactionType.Adjustment
	};

const STATEMENT_STATUS_BY_PAYOUT: Record<PayoutStatus, TransactionStatus> = {
	[PayoutStatus.Processing]: TransactionStatus.Processing,
	[PayoutStatus.Settled]: TransactionStatus.Success,
	[PayoutStatus.Failed]: TransactionStatus.Failure
};

interface StatementRow {
	transactionId: string;
	storeId: string;
	sequence: bigint;
	type: TransactionType;
	status: TransactionStatus;
	amount: bigint;
	balanceAfter: bigint;
	description: string | null;
	orderId: string | null;
	createdAt: Date;
}

/**
 * Merchants see a statement of things that moved their withdrawable balance.
 *
 * A journal earns a row only if it changed `available` -- which is why an
 * order cancelled before completion produces none (it moves money out of
 * `StorePending`, which the merchant could not have withdrawn anyway). That
 * matches what the pre-ledger code showed, so the dashboard is unaffected.
 */
const statementRowFor = (
	journal: JournalEffect,
	storeId: string,
	availableBefore: bigint,
	availableAfter: bigint,
	payoutStatus: PayoutStatus | null
): StatementRow | null => {
	if (journal.reason === LedgerReason.PayoutSettled) return null;

	const type = STATEMENT_TYPE_BY_REASON[journal.reason];
	if (!type) return null;

	const delta = availableAfter - availableBefore;
	if (delta === 0n) return null;

	const status =
		type === TransactionType.Payout && payoutStatus
			? STATEMENT_STATUS_BY_PAYOUT[payoutStatus]
			: TransactionStatus.Success;

	return {
		transactionId: journal.transactionId,
		storeId,
		sequence: journal.sequence,
		type,
		status,
		amount: delta < 0n ? -delta : delta,
		balanceAfter: availableAfter,
		description: journal.description,
		orderId: journal.orderId,
		createdAt: journal.createdAt
	};
};

/**
 * Replays a store's journals from zero. This is the "always reproducible from
 * the log" guarantee: the reconciliation script and the projection tests both
 * go through here, and its output is what the live columns are compared to.
 */
export const foldJournals = (
	journals: JournalEffect[],
	storeId: string,
	payoutStatuses: Map<string, PayoutStatus> = new Map()
): { projection: StoreProjection; statement: StatementRow[] } => {
	let projection = emptyProjection();
	const statement: StatementRow[] = [];

	for (const journal of journals) {
		const availableBefore = projection.available;
		projection = applyJournal(projection, journal, storeId);

		const payoutStatus = journal.payoutRequestId
			? (payoutStatuses.get(journal.payoutRequestId) ?? null)
			: null;

		const row = statementRowFor(
			journal,
			storeId,
			availableBefore,
			projection.available,
			payoutStatus
		);

		if (row) statement.push(row);
	}

	return { projection, statement };
};

// --- Writes ---------------------------------------------------------------

interface AccountRef {
	id: string;
	kind: AccountKind;
	storeId: string | null;
	userId: string | null;
}

interface GetAccountParams {
	kind: AccountKind;
	storeId?: string | null;
	userId?: string | null;
}

const UNIQUE_VIOLATION = 'P2002';

const isUniqueViolation = (error: unknown): boolean =>
	(error as { code?: string } | null)?.code === UNIQUE_VIOLATION;

/**
 * Resolves an account, creating it on first use.
 *
 * Prisma cannot express the ownership uniqueness (three partial indexes, see
 * the migration), so `upsert` is unavailable and we do find-then-create.
 * Two concurrent callers can both miss the find; the loser gets a unique
 * violation from the partial index and re-reads.
 */
export const getOrCreateAccount = async (
	tx: TransactionClient,
	params: GetAccountParams
): Promise<AccountRef> => {
	const { kind } = params;
	const scope = OWNER_SCOPE_BY_KIND[kind];

	const storeId = scope === 'store' ? (params.storeId ?? null) : null;
	const userId = scope === 'user' ? (params.userId ?? null) : null;

	if (scope === 'store' && !storeId) {
		throw new Error(`Account kind ${kind} requires a storeId`);
	}

	if (scope === 'user' && !userId) {
		throw new Error(`Account kind ${kind} requires a userId`);
	}

	const where = { kind, storeId, userId };

	const existing = await tx.ledgerAccount.findFirst({ where });

	if (existing) {
		return existing;
	}

	try {
		return await tx.ledgerAccount.create({
			data: { kind, type: ACCOUNT_TYPE_BY_KIND[kind], storeId, userId }
		});
	} catch (error) {
		if (isUniqueViolation(error)) {
			// As in `postJournal`: the transaction is already aborted, so the
			// loser of the race cannot re-read from in here. Retrying resolves
			// it, because the find above will then hit.
			throw new Error(
				`Concurrent creation of ${kind} account; retry the transaction`,
				{ cause: error }
			);
		}

		throw error;
	}
};

export interface PostJournalEntry {
	account: AccountRef;
	direction: EntryDirection;
	amount: bigint;
}

interface PostJournalParams {
	reason: LedgerReason;
	/** Deterministic key for the business event, e.g. `order:<id>:completed`. */
	idempotencyKey: string;
	description?: string | null;
	orderId?: string | null;
	payoutRequestId?: string | null;
	webhookEventId?: string | null;
	entries: PostJournalEntry[];
}

export interface PostJournalResult {
	transactionId: string;
	/** False when the idempotency key had already been used -- a no-op. */
	posted: boolean;
}

export const oppositeDirection = (direction: EntryDirection) =>
	direction === EntryDirection.Debit
		? EntryDirection.Credit
		: EntryDirection.Debit;

/**
 * Builds an entry from a *signed* amount.
 *
 * Stored amounts are always magnitudes, with `direction` carrying the sign --
 * but callers sometimes hold a signed figure, and a position is not guaranteed
 * to be positive. A store paid out more than it earned carries a negative
 * available balance; that is a real economic state (the store owes us) and the
 * ledger has to be able to state it.
 *
 * A negative amount in one direction is the same as a positive amount in the
 * other, so flipping both preserves the journal's arithmetic while keeping
 * every stored amount positive.
 *
 * Returns null for zero, which callers drop: an absent balance is a legitimate
 * journal, not a malformed one.
 */
export const signedEntry = (
	account: AccountRef,
	amount: bigint,
	direction: EntryDirection
): PostJournalEntry | null => {
	if (amount === 0n) return null;

	return amount < 0n
		? { account, direction: oppositeDirection(direction), amount: -amount }
		: { account, direction, amount };
};

/** Drops the nulls `signedEntry` returns for zero amounts. */
export const presentEntries = (entries: (PostJournalEntry | null)[]) =>
	entries.filter((entry): entry is PostJournalEntry => entry !== null);

const assertBalanced = (entries: PostJournalEntry[], reason: LedgerReason) => {
	if (entries.length < 2) {
		throw new Error(
			`Journal (${reason}) needs at least two entries, got ${entries.length}`
		);
	}

	let debits = 0n;
	let credits = 0n;

	for (const entry of entries) {
		if (entry.amount <= 0n) {
			throw new Error(
				`Journal (${reason}) has a non-positive amount: ${entry.amount}. ` +
					'Direction carries the sign, never the amount.'
			);
		}

		if (entry.direction === EntryDirection.Debit) {
			debits += entry.amount;
		} else {
			credits += entry.amount;
		}
	}

	if (debits !== credits) {
		throw new Error(
			`Journal (${reason}) does not balance: debits ${debits}, credits ${credits}`
		);
	}
};

const projectionFromStore = (store: {
	unrealizedRevenue: bigint;
	realizedRevenue: bigint;
	paidOut: bigint;
	pendingPayouts: bigint;
}): StoreProjection => ({
	unrealizedRevenue: store.unrealizedRevenue,
	pendingPayouts: store.pendingPayouts,
	paidOut: store.paidOut,
	available: store.realizedRevenue - store.paidOut - store.pendingPayouts
});

const storeColumnsFrom = (projection: StoreProjection) => ({
	unrealizedRevenue: projection.unrealizedRevenue,
	pendingPayouts: projection.pendingPayouts,
	paidOut: projection.paidOut,
	realizedRevenue: realizedRevenueOf(projection)
});

/**
 * Inserts a journal and folds its effect into every projection it touches, in
 * one database transaction. This is the only function that writes `Store`'s
 * money columns or `StoreStatementEntry`; that exclusivity is what makes
 * `ledgerSequence` a meaningful watermark and drift detectable.
 *
 * Must be called inside a transaction -- `runSerializable` from
 * `utils/prisma.ts` is the usual entry point.
 */
export const postJournal = async (
	tx: TransactionClient,
	params: PostJournalParams
): Promise<PostJournalResult> => {
	assertBalanced(params.entries, params.reason);

	// Check before inserting rather than catching the unique violation.
	//
	// Postgres aborts the entire transaction on a failed statement, so a
	// `catch (P2002)` inside one cannot recover -- every subsequent query in
	// the same transaction fails with "current transaction is aborted". The
	// unique index is still the correctness backstop; this read just keeps the
	// common replay case from poisoning the transaction.
	const alreadyPosted = await tx.ledgerTransaction.findUnique({
		where: { idempotencyKey: params.idempotencyKey },
		select: { id: true }
	});

	if (alreadyPosted) {
		return { transactionId: alreadyPosted.id, posted: false };
	}

	let journal;

	try {
		journal = await tx.ledgerTransaction.create({
			data: {
				reason: params.reason,
				idempotencyKey: params.idempotencyKey,
				description: params.description ?? null,
				orderId: params.orderId ?? null,
				payoutRequestId: params.payoutRequestId ?? null,
				webhookEventId: params.webhookEventId ?? null
			}
		});
	} catch (error) {
		if (isUniqueViolation(error)) {
			// Two callers raced past the read above. The transaction is now
			// aborted and cannot be salvaged from in here -- surface it so the
			// caller retries, where the read will find the winner's journal.
			throw new Error(
				`Concurrent post for idempotency key ${params.idempotencyKey}; retry the transaction`,
				{ cause: error }
			);
		}

		throw error;
	}

	await tx.ledgerEntry.createMany({
		data: params.entries.map(entry => ({
			transactionId: journal.id,
			accountId: entry.account.id,
			direction: entry.direction,
			amount: entry.amount
		}))
	});

	const effect: JournalEffect = {
		transactionId: journal.id,
		sequence: journal.sequence,
		reason: journal.reason,
		description: journal.description,
		orderId: journal.orderId,
		payoutRequestId: journal.payoutRequestId,
		createdAt: journal.createdAt,
		entries: params.entries.map(entry => ({
			kind: entry.account.kind,
			direction: entry.direction,
			amount: entry.amount,
			storeId: entry.account.storeId,
			userId: entry.account.userId
		}))
	};

	const storeIds = [
		...new Set(
			params.entries
				.map(entry => entry.account.storeId)
				.filter((id): id is string => id !== null)
		)
	];

	for (const storeId of storeIds) {
		await applyToStoreProjection(tx, storeId, effect);
	}

	if (params.payoutRequestId) {
		await syncPayoutStatementStatus(tx, params.payoutRequestId);
	}

	return { transactionId: journal.id, posted: true };
};

const applyToStoreProjection = async (
	tx: TransactionClient,
	storeId: string,
	journal: JournalEffect
) => {
	const store = await tx.store.findUnique({
		where: { id: storeId },
		select: {
			unrealizedRevenue: true,
			realizedRevenue: true,
			paidOut: true,
			pendingPayouts: true
		}
	});

	if (!store) {
		throw new Error(`Cannot project journal onto missing store ${storeId}`);
	}

	const before = projectionFromStore(store);
	const after = applyJournal(before, journal, storeId);

	await tx.store.update({
		where: { id: storeId },
		data: { ...storeColumnsFrom(after), ledgerSequence: journal.sequence }
	});

	const row = statementRowFor(
		journal,
		storeId,
		before.available,
		after.available,
		null
	);

	if (row) {
		await tx.storeStatementEntry.create({
			data: {
				storeId: row.storeId,
				transactionId: row.transactionId,
				sequence: row.sequence,
				type: row.type,
				status: row.status,
				amount: row.amount,
				balanceAfter: row.balanceAfter,
				description: row.description,
				orderId: row.orderId,
				createdAt: row.createdAt
			}
		});
	}
};

/**
 * A payout shows up in the statement once, when it is requested. Settlement
 * and failure arrive later and only change that row's status -- so the
 * merchant sees one payout line whose state advances, not three.
 */
const syncPayoutStatementStatus = async (
	tx: TransactionClient,
	payoutRequestId: string
) => {
	const request = await tx.payoutRequest.findUnique({
		where: { id: payoutRequestId },
		select: { status: true }
	});

	if (!request) return;

	const requested = await tx.ledgerTransaction.findFirst({
		where: { payoutRequestId, reason: LedgerReason.PayoutRequested },
		select: { id: true }
	});

	if (!requested) return;

	await tx.storeStatementEntry.updateMany({
		where: { transactionId: requested.id },
		data: { status: STATEMENT_STATUS_BY_PAYOUT[request.status] }
	});
};

// --- Replay and reconciliation --------------------------------------------

/**
 * Every journal that touched a store's accounts, in ledger order, reduced to
 * what the projection fold needs.
 */
const readStoreJournals = async (
	tx: TransactionClient,
	storeId: string
): Promise<JournalEffect[]> => {
	const journals = await tx.ledgerTransaction.findMany({
		where: { entries: { some: { account: { storeId } } } },
		orderBy: { sequence: 'asc' },
		include: {
			entries: {
				include: {
					account: {
						select: { kind: true, storeId: true, userId: true }
					}
				}
			}
		}
	});

	return journals.map(journal => ({
		transactionId: journal.id,
		sequence: journal.sequence,
		reason: journal.reason,
		description: journal.description,
		orderId: journal.orderId,
		payoutRequestId: journal.payoutRequestId,
		createdAt: journal.createdAt,
		entries: journal.entries.map(entry => ({
			kind: entry.account.kind,
			direction: entry.direction,
			amount: entry.amount,
			storeId: entry.account.storeId,
			userId: entry.account.userId
		}))
	}));
};

interface ReplayResult {
	projection: StoreProjection;
	statement: StatementRow[];
	ledgerSequence: bigint;
}

/**
 * Recomputes a store's entire position from the journals, touching nothing.
 *
 * This is the guarantee the whole design rests on: the denormalized columns on
 * `Store` are a cache, and this function is the authority they are checked
 * against. `reconcile-ledger.ts` and the projection tests both call it.
 */
export const replayStore = async (
	tx: TransactionClient,
	storeId: string
): Promise<ReplayResult> => {
	const journals = await readStoreJournals(tx, storeId);

	const payoutIds = [
		...new Set(
			journals
				.map(journal => journal.payoutRequestId)
				.filter((id): id is string => id !== null)
		)
	];

	const payouts = payoutIds.length
		? await tx.payoutRequest.findMany({
				where: { id: { in: payoutIds } },
				select: { id: true, status: true }
			})
		: [];

	const statuses = new Map(payouts.map(p => [p.id, p.status]));
	const { projection, statement } = foldJournals(journals, storeId, statuses);

	return {
		projection,
		statement,
		ledgerSequence:
			journals.length > 0 ? journals[journals.length - 1]!.sequence : 0n
	};
};

/**
 * Rewrites a store's projections from the journals. Use when a replay has
 * shown drift, or after a backfill. Journals are untouched -- only the cache
 * is rebuilt.
 */
export const rebuildStoreProjections = async (
	tx: TransactionClient,
	storeId: string
): Promise<ReplayResult> => {
	const result = await replayStore(tx, storeId);

	await tx.storeStatementEntry.deleteMany({ where: { storeId } });

	if (result.statement.length > 0) {
		await tx.storeStatementEntry.createMany({
			data: result.statement.map(row => ({
				storeId: row.storeId,
				transactionId: row.transactionId,
				sequence: row.sequence,
				type: row.type,
				status: row.status,
				amount: row.amount,
				balanceAfter: row.balanceAfter,
				description: row.description,
				orderId: row.orderId,
				createdAt: row.createdAt
			}))
		});
	}

	await tx.store.update({
		where: { id: storeId },
		data: {
			...storeColumnsFrom(result.projection),
			ledgerSequence: result.ledgerSequence
		}
	});

	return result;
};

/**
 * Natural balance of an account: debit-positive for assets and expenses,
 * credit-positive for liabilities and revenue.
 */
export const getAccountBalance = async (
	tx: TransactionClient,
	accountId: string
): Promise<bigint> => {
	const account = await tx.ledgerAccount.findUnique({
		where: { id: accountId },
		select: { type: true }
	});

	if (!account) {
		throw new Error(`No such ledger account: ${accountId}`);
	}

	const grouped = await tx.ledgerEntry.groupBy({
		by: ['direction'],
		where: { accountId },
		_sum: { amount: true }
	});

	const sumFor = (direction: EntryDirection) =>
		grouped.find(row => row.direction === direction)?._sum.amount ?? 0n;

	const debits = sumFor(EntryDirection.Debit);
	const credits = sumFor(EntryDirection.Credit);

	const debitPositive =
		account.type === AccountType.Asset || account.type === AccountType.Expense;

	return debitPositive ? debits - credits : credits - debits;
};

/**
 * What a customer is owed. Refunds accrue here; an admin cash-out draws it
 * down. Returns 0 for a customer who has never been refunded.
 */
export const getCustomerCreditBalance = async (
	prisma: PrismaClient | TransactionClient,
	userId: string
): Promise<bigint> => {
	const account = await prisma.ledgerAccount.findFirst({
		where: { kind: AccountKind.CustomerCredit, userId },
		select: { id: true }
	});

	if (!account) return 0n;

	return getAccountBalance(prisma as TransactionClient, account.id);
};
