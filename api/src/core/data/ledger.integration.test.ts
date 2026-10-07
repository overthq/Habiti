import { afterAll, beforeAll, describe, expect, test } from 'bun:test';

import prisma from '../../config/prisma';
import {
	AccountKind,
	EntryDirection,
	LedgerReason,
	PayoutStatus
} from '../../generated/prisma/client';
import {
	getAccountBalance,
	getCustomerCreditBalance,
	getOrCreateAccount,
	postJournal,
	realizedRevenueOf,
	rebuildStoreProjections,
	replayStore
} from './ledger';
import {
	recordOrderCompleted,
	recordOrderPaid,
	recordPayoutRequested,
	recordPayoutSettled,
	recordRefund
} from './postings';
import { runSerializable } from '../../utils/prisma';

/**
 * Ledger behaviour against real Postgres.
 *
 * The pure fold is covered in `ledger.test.ts`. What can only be verified here
 * is the half that lives in the database: the immutability triggers, the
 * deferred balance constraint, and -- most importantly -- that replaying the
 * journals reproduces the denormalized columns exactly.
 *
 * Skipped when there is no database configured, so `bun test` still runs
 * everywhere.
 */

const hasDatabase = Boolean(process.env.DATABASE_URL);
const suite = hasDatabase ? describe : describe.skip;

const SUFFIX = `ledger-it-${Date.now()}`;
const STORE_ID = `store-${SUFFIX}`;
const USER_ID = `user-${SUFFIX}`;

const storeColumns = async () => {
	const store = await prisma.store.findUniqueOrThrow({
		where: { id: STORE_ID },
		select: {
			unrealizedRevenue: true,
			realizedRevenue: true,
			paidOut: true,
			pendingPayouts: true,
			ledgerSequence: true
		}
	});

	return store;
};

const availableOf = (s: {
	realizedRevenue: bigint;
	paidOut: bigint;
	pendingPayouts: bigint;
}) => s.realizedRevenue - s.paidOut - s.pendingPayouts;

/**
 * Prisma returns a thenable, not a native Promise, which bun's `.rejects`
 * matcher will not accept. Await it and inspect the error directly.
 */
const expectRejection = async (
	run: () => Promise<unknown>,
	pattern: RegExp
) => {
	try {
		await run();
	} catch (error) {
		expect(String((error as Error).message)).toMatch(pattern);
		return;
	}

	throw new Error(`expected a rejection matching ${pattern}`);
};

suite('ledger against postgres', () => {
	beforeAll(async () => {
		await prisma.store.create({
			data: { id: STORE_ID, name: `Test Store ${SUFFIX}` }
		});
		await prisma.user.create({
			data: { id: USER_ID, name: `Test User ${SUFFIX}` }
		});

		// Journals reference orders by foreign key, so these have to be real.
		await prisma.order.createMany({
			data: [
				{
					id: `order-${SUFFIX}-1`,
					serialNumber: 1,
					userId: USER_ID,
					storeId: STORE_ID,
					total: 100_000
				},
				{
					id: `order-${SUFFIX}-2`,
					serialNumber: 2,
					userId: USER_ID,
					storeId: STORE_ID,
					total: 25_000
				}
			]
		});
	});

	afterAll(async () => {
		// Ledger rows are immutable by trigger, so tearing down test data takes
		// a deliberate override. That friction is the feature.
		await prisma.$executeRawUnsafe(
			'ALTER TABLE "LedgerEntry" DISABLE TRIGGER "LedgerEntry_immutable"'
		);
		await prisma.$executeRawUnsafe(
			'ALTER TABLE "LedgerTransaction" DISABLE TRIGGER "LedgerTransaction_immutable"'
		);

		// Delete by journal, not by account. Every journal has a platform-side
		// half sitting in a shared account -- removing only the store's half
		// would leave the books globally unbalanced.
		const journals = await prisma.ledgerTransaction.findMany({
			where: { idempotencyKey: { contains: SUFFIX } },
			select: { id: true }
		});
		const journalIds = journals.map(j => j.id);

		await prisma.storeStatementEntry.deleteMany({
			where: { storeId: STORE_ID }
		});
		await prisma.ledgerEntry.deleteMany({
			where: { transactionId: { in: journalIds } }
		});
		await prisma.ledgerTransaction.deleteMany({
			where: { id: { in: journalIds } }
		});
		await prisma.ledgerAccount.deleteMany({
			where: { OR: [{ storeId: STORE_ID }, { userId: USER_ID }] }
		});
		await prisma.payoutRequest.deleteMany({ where: { storeId: STORE_ID } });
		await prisma.order.deleteMany({ where: { storeId: STORE_ID } });

		await prisma.$executeRawUnsafe(
			'ALTER TABLE "LedgerEntry" ENABLE TRIGGER "LedgerEntry_immutable"'
		);
		await prisma.$executeRawUnsafe(
			'ALTER TABLE "LedgerTransaction" ENABLE TRIGGER "LedgerTransaction_immutable"'
		);

		await prisma.store.deleteMany({ where: { id: STORE_ID } });
		await prisma.user.deleteMany({ where: { id: USER_ID } });
	});

	test('a full order-to-payout cycle moves money through the right buckets', async () => {
		const orderId = `order-${SUFFIX}-1`;

		await runSerializable(prisma, tx =>
			recordOrderPaid(tx, {
				storeId: STORE_ID,
				orderId,
				total: 100_000n,
				serviceFee: 1_000n
			})
		);

		let columns = await storeColumns();
		expect(columns.unrealizedRevenue).toBe(100_000n);
		expect(availableOf(columns)).toBe(0n);

		await runSerializable(prisma, tx =>
			recordOrderCompleted(tx, {
				storeId: STORE_ID,
				orderId,
				total: 100_000n
			})
		);

		columns = await storeColumns();
		expect(columns.unrealizedRevenue).toBe(0n);
		expect(columns.realizedRevenue).toBe(100_000n);
		expect(availableOf(columns)).toBe(100_000n);

		const payout = await prisma.payoutRequest.create({
			data: {
				id: `payout-${SUFFIX}`,
				storeId: STORE_ID,
				amount: 40_000n,
				status: PayoutStatus.Processing
			}
		});

		await runSerializable(prisma, tx =>
			recordPayoutRequested(tx, {
				storeId: STORE_ID,
				payoutRequestId: payout.id,
				amount: 40_000n
			})
		);

		columns = await storeColumns();
		expect(columns.pendingPayouts).toBe(40_000n);
		expect(columns.paidOut).toBe(0n);
		// The requested money is gone from the withdrawable balance straight
		// away, so a second request cannot spend it again.
		expect(availableOf(columns)).toBe(60_000n);

		await prisma.payoutRequest.update({
			where: { id: payout.id },
			data: { status: PayoutStatus.Settled }
		});

		await runSerializable(prisma, tx =>
			recordPayoutSettled(tx, {
				storeId: STORE_ID,
				payoutRequestId: payout.id,
				amount: 40_000n
			})
		);

		columns = await storeColumns();
		expect(columns.pendingPayouts).toBe(0n);
		expect(columns.paidOut).toBe(40_000n);
		expect(columns.realizedRevenue).toBe(100_000n);
		expect(availableOf(columns)).toBe(60_000n);
	});

	test('a refund lands in the customer credit account', async () => {
		const orderId = `order-${SUFFIX}-2`;

		await runSerializable(prisma, async tx => {
			await recordOrderPaid(tx, {
				storeId: STORE_ID,
				orderId,
				total: 25_000n,
				serviceFee: 0n
			});
			await recordOrderCompleted(tx, {
				storeId: STORE_ID,
				orderId,
				total: 25_000n
			});
		});

		const before = await storeColumns();

		await runSerializable(prisma, tx =>
			recordRefund(tx, {
				storeId: STORE_ID,
				userId: USER_ID,
				orderId,
				total: 25_000n,
				wasRealized: true
			})
		);

		const after = await storeColumns();

		// The store loses it and the customer gains it -- the same 25,000,
		// never created or destroyed.
		expect(availableOf(before) - availableOf(after)).toBe(25_000n);
		expect(after.realizedRevenue).toBe(before.realizedRevenue - 25_000n);
		expect(await getCustomerCreditBalance(prisma, USER_ID)).toBe(25_000n);
	});

	test('replaying the journals reproduces the stored columns', async () => {
		const columns = await storeColumns();
		const replay = await replayStore(prisma as never, STORE_ID);

		expect(replay.projection.unrealizedRevenue).toBe(columns.unrealizedRevenue);
		expect(realizedRevenueOf(replay.projection)).toBe(columns.realizedRevenue);
		expect(replay.projection.paidOut).toBe(columns.paidOut);
		expect(replay.projection.pendingPayouts).toBe(columns.pendingPayouts);
		expect(replay.projection.available).toBe(availableOf(columns));
	});

	test('a corrupted projection is repaired from the log', async () => {
		const truth = await storeColumns();

		// Simulate drift of the kind the old two-writer design produced.
		await prisma.store.update({
			where: { id: STORE_ID },
			data: {
				realizedRevenue: 999_999_999n,
				unrealizedRevenue: 42n,
				paidOut: 7n,
				pendingPayouts: 3n
			}
		});

		await runSerializable(prisma, tx => rebuildStoreProjections(tx, STORE_ID));

		const repaired = await storeColumns();

		expect(repaired.realizedRevenue).toBe(truth.realizedRevenue);
		expect(repaired.unrealizedRevenue).toBe(truth.unrealizedRevenue);
		expect(repaired.paidOut).toBe(truth.paidOut);
		expect(repaired.pendingPayouts).toBe(truth.pendingPayouts);
	});

	test('reposting the same idempotency key changes nothing', async () => {
		const before = await storeColumns();
		const journalsBefore = await prisma.ledgerTransaction.count();

		const result = await runSerializable(prisma, tx =>
			recordOrderPaid(tx, {
				storeId: STORE_ID,
				orderId: `order-${SUFFIX}-1`,
				total: 100_000n,
				serviceFee: 1_000n
			})
		);

		expect(result.posted).toBe(false);
		expect(await prisma.ledgerTransaction.count()).toBe(journalsBefore);
		expect(await storeColumns()).toEqual(before);
	});

	test('journals cannot be updated or deleted', async () => {
		const journal = await prisma.ledgerTransaction.findFirstOrThrow({
			where: { idempotencyKey: { contains: SUFFIX } }
		});

		await expectRejection(
			() =>
				prisma.ledgerTransaction.update({
					where: { id: journal.id },
					data: { description: 'tampered' }
				}),
			/immutable/i
		);

		await expectRejection(
			() => prisma.ledgerTransaction.delete({ where: { id: journal.id } }),
			/immutable/i
		);
	});

	test('entries cannot be updated', async () => {
		const entry = await prisma.ledgerEntry.findFirstOrThrow({
			where: { account: { storeId: STORE_ID } }
		});

		await expectRejection(
			() =>
				prisma.ledgerEntry.update({
					where: { id: entry.id },
					data: { amount: 1n }
				}),
			/immutable/i
		);
	});

	test('an unbalanced journal is rejected at commit', async () => {
		await expectRejection(
			() =>
				runSerializable(prisma, async tx => {
					const cash = await getOrCreateAccount(tx, {
						kind: AccountKind.PlatformCash
					});
					const available = await getOrCreateAccount(tx, {
						kind: AccountKind.StoreAvailable,
						storeId: STORE_ID
					});

					const journal = await tx.ledgerTransaction.create({
						data: {
							reason: LedgerReason.ManualAdjustment,
							idempotencyKey: `unbalanced-${SUFFIX}`
						}
					});

					// Bypasses `postJournal`'s own check on purpose: the point
					// is that the database refuses this even when application
					// code does not.
					await tx.ledgerEntry.createMany({
						data: [
							{
								transactionId: journal.id,
								accountId: cash.id,
								direction: EntryDirection.Debit,
								amount: 500n
							},
							{
								transactionId: journal.id,
								accountId: available.id,
								direction: EntryDirection.Credit,
								amount: 400n
							}
						]
					});
				}),
			/does not balance/i
		);

		const survivor = await prisma.ledgerTransaction.findUnique({
			where: { idempotencyKey: `unbalanced-${SUFFIX}` }
		});

		expect(survivor).toBeNull();
	});

	test('a negative amount violates the check constraint', async () => {
		await expectRejection(
			() =>
				runSerializable(prisma, async tx => {
					const cash = await getOrCreateAccount(tx, {
						kind: AccountKind.PlatformCash
					});

					const journal = await tx.ledgerTransaction.create({
						data: {
							reason: LedgerReason.ManualAdjustment,
							idempotencyKey: `negative-${SUFFIX}`
						}
					});

					await tx.ledgerEntry.create({
						data: {
							transactionId: journal.id,
							accountId: cash.id,
							direction: EntryDirection.Debit,
							amount: -100n
						}
					});
				}),
			/LedgerEntry_amount_positive|constraint/i
		);
	});

	test('the books balance across every account', async () => {
		const grouped = await prisma.ledgerEntry.groupBy({
			by: ['direction'],
			_sum: { amount: true }
		});

		const sumFor = (direction: EntryDirection) =>
			grouped.find(row => row.direction === direction)?._sum.amount ?? 0n;

		expect(sumFor(EntryDirection.Debit)).toBe(sumFor(EntryDirection.Credit));
	});

	test('store account balances agree with the projection', async () => {
		const columns = await storeColumns();

		const available = await getOrCreateAccountBalance(
			AccountKind.StoreAvailable
		);
		const pending = await getOrCreateAccountBalance(AccountKind.StorePending);

		expect(available).toBe(availableOf(columns));
		expect(pending).toBe(columns.unrealizedRevenue);
	});
});

const getOrCreateAccountBalance = async (kind: AccountKind) => {
	const account = await prisma.ledgerAccount.findFirstOrThrow({
		where: { kind, storeId: STORE_ID }
	});

	return getAccountBalance(prisma as never, account.id);
};
