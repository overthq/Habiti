import { afterAll, beforeAll, describe, expect, test } from 'bun:test';

import prisma from '../../config/prisma';
import {
	EntryDirection,
	LedgerReason,
	OrderStatus,
	PayoutStatus,
	TransactionStatus,
	TransactionType
} from '../../generated/prisma/client';
import { getCustomerCredit, recalculateStoreBalance } from './ledger';
import { updateOrderStatus } from './orders';
import {
	createPayout,
	markTransferFailed,
	markTransferSuccessful
} from './transactions';
import { transitionOrderToPending } from '../logic/payments';
import { runSerializable } from '../../utils/prisma';

// Runs against real Postgres, because the balance recalculation and the
// ledger's triggers only exist there. Skipped when no database is configured.

const hasDatabase = Boolean(process.env.DATABASE_URL);
const suite = hasDatabase ? describe : describe.skip;

const SUFFIX = `ledger-it-${Date.now()}`;
const STORE_ID = `store-${SUFFIX}`;
const USER_ID = `user-${SUFFIX}`;
const orderId = (n: number) => `order-${SUFFIX}-${n}`;

const c = {
	var: {
		prisma,
		logger: { warn: () => {} },
		services: { notifications: { queueNotification: () => {} } }
	}
} as never;

const storeBalance = async () => {
	const store = await prisma.store.findUniqueOrThrow({
		where: { id: STORE_ID },
		select: {
			unrealizedRevenue: true,
			realizedRevenue: true,
			paidOut: true,
			pendingPayouts: true
		}
	});

	return {
		...store,
		available: store.realizedRevenue - store.paidOut - store.pendingPayouts
	};
};

const setOrderStatus = (n: number, status: OrderStatus) =>
	runSerializable(prisma, async tx => {
		const order = await tx.order.findUniqueOrThrow({
			where: { id: orderId(n) }
		});

		return updateOrderStatus(tx, order, status);
	});

// Prisma returns a thenable rather than a Promise, which bun's `.rejects`
// will not accept.
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

		await prisma.order.createMany({
			data: [
				{ n: 1, total: 100_000, status: OrderStatus.PaymentPending },
				{ n: 2, total: 25_000, status: OrderStatus.PaymentPending },
				// Advanced without its payment ever being recorded.
				{ n: 3, total: 10_000, status: OrderStatus.ReadyForPickup }
			].map(({ n, total, status }) => ({
				id: orderId(n),
				serialNumber: n,
				userId: USER_ID,
				storeId: STORE_ID,
				total,
				serviceFee: 1_000,
				status
			}))
		});
	});

	afterAll(async () => {
		// Ledger rows are immutable by trigger, so removing test data takes a
		// deliberate override.
		await prisma.$executeRawUnsafe(
			'ALTER TABLE "LedgerEntry" DISABLE TRIGGER "LedgerEntry_immutable"'
		);
		await prisma.$executeRawUnsafe(
			'ALTER TABLE "LedgerTransaction" DISABLE TRIGGER "LedgerTransaction_immutable"'
		);

		// The triggers must come back on even if the cleanup fails.
		try {
			// Whole ledger transactions, including the platform's side of each.
			const ledgerTransactions = await prisma.ledgerTransaction.findMany({
				where: {
					OR: [
						{ orderId: { contains: SUFFIX } },
						{ entries: { some: { account: { storeId: STORE_ID } } } }
					]
				},
				select: { id: true }
			});
			const ids = ledgerTransactions.map(t => t.id);

			await prisma.transaction.deleteMany({ where: { storeId: STORE_ID } });
			await prisma.ledgerEntry.deleteMany({
				where: { transactionId: { in: ids } }
			});
			await prisma.ledgerTransaction.deleteMany({
				where: { id: { in: ids } }
			});
			await prisma.ledgerAccount.deleteMany({
				where: { OR: [{ storeId: STORE_ID }, { userId: USER_ID }] }
			});
			await prisma.payout.deleteMany({ where: { storeId: STORE_ID } });
			await prisma.order.deleteMany({ where: { storeId: STORE_ID } });
		} finally {
			await prisma.$executeRawUnsafe(
				'ALTER TABLE "LedgerEntry" ENABLE TRIGGER "LedgerEntry_immutable"'
			);
			await prisma.$executeRawUnsafe(
				'ALTER TABLE "LedgerTransaction" ENABLE TRIGGER "LedgerTransaction_immutable"'
			);
		}

		await prisma.store.deleteMany({ where: { id: STORE_ID } });
		await prisma.user.deleteMany({ where: { id: USER_ID } });
	});

	test('a payment moves the order to Pending and is unrealized revenue', async () => {
		await transitionOrderToPending(c, orderId(1));
		await transitionOrderToPending(c, orderId(2));

		const order = await prisma.order.findUniqueOrThrow({
			where: { id: orderId(1) }
		});

		expect(order.status).toBe(OrderStatus.Pending);
		expect(await storeBalance()).toMatchObject({
			unrealizedRevenue: 125_000n,
			available: 0n
		});
	});

	test('the same payment delivered twice is recorded once', async () => {
		const before = await prisma.ledgerTransaction.count({
			where: { orderId: orderId(1) }
		});

		await transitionOrderToPending(c, orderId(1));

		expect(
			await prisma.ledgerTransaction.count({ where: { orderId: orderId(1) } })
		).toBe(before);
		expect((await storeBalance()).unrealizedRevenue).toBe(125_000n);
	});

	test('completing an order makes its money available', async () => {
		await setOrderStatus(1, OrderStatus.ReadyForPickup);
		await setOrderStatus(1, OrderStatus.Completed);

		expect(await storeBalance()).toMatchObject({
			unrealizedRevenue: 25_000n,
			realizedRevenue: 100_000n,
			available: 100_000n
		});

		const transactions = await prisma.transaction.findMany({
			where: { storeId: STORE_ID }
		});

		expect(transactions).toHaveLength(1);
		expect(transactions[0]).toMatchObject({
			type: TransactionType.Revenue,
			status: TransactionStatus.Success,
			amount: 100_000n,
			balanceAfter: 100_000n,
			orderId: orderId(1)
		});
	});

	test('cancelling a paid order refunds the customer, not the merchant balance', async () => {
		await setOrderStatus(2, OrderStatus.Cancelled);

		expect(await getCustomerCredit(prisma, USER_ID)).toBe(25_000n);
		expect(await storeBalance()).toMatchObject({
			unrealizedRevenue: 0n,
			available: 100_000n
		});
		expect(
			await prisma.transaction.count({ where: { storeId: STORE_ID } })
		).toBe(1);
	});

	test('an order cannot complete without its payment, and stays where it was', async () => {
		await expectRejection(
			() => setOrderStatus(3, OrderStatus.Completed),
			/Insufficient Unrealized balance/
		);

		const order = await prisma.order.findUniqueOrThrow({
			where: { id: orderId(3) }
		});

		expect(order.status).toBe(OrderStatus.ReadyForPickup);
		expect((await storeBalance()).unrealizedRevenue).toBe(0n);
	});

	test('replaying the charge records the missing payment, and the order can complete', async () => {
		await transitionOrderToPending(c, orderId(3));

		const order = await prisma.order.findUniqueOrThrow({
			where: { id: orderId(3) }
		});

		expect(order.status).toBe(OrderStatus.ReadyForPickup);
		expect((await storeBalance()).unrealizedRevenue).toBe(10_000n);

		await setOrderStatus(3, OrderStatus.Completed);

		expect(await storeBalance()).toMatchObject({
			unrealizedRevenue: 0n,
			available: 110_000n
		});
	});

	test('a payout leaves the available balance when requested and is paid out when settled', async () => {
		const payout = await runSerializable(prisma, tx =>
			createPayout(tx, { storeId: STORE_ID, amount: 40_000n })
		);

		expect(await storeBalance()).toMatchObject({
			pendingPayouts: 40_000n,
			paidOut: 0n,
			available: 70_000n
		});

		await markTransferSuccessful(prisma, payout.id);

		expect(await storeBalance()).toMatchObject({
			pendingPayouts: 0n,
			paidOut: 40_000n,
			realizedRevenue: 110_000n,
			available: 70_000n
		});

		const transaction = await prisma.transaction.findFirstOrThrow({
			where: { payoutId: payout.id, type: TransactionType.Payout }
		});

		expect(transaction).toMatchObject({
			status: TransactionStatus.Success,
			amount: 40_000n,
			balanceAfter: 70_000n
		});
	});

	test('a payout larger than the available balance is refused', async () => {
		await expectRejection(
			() =>
				runSerializable(prisma, tx =>
					createPayout(tx, { storeId: STORE_ID, amount: 70_001n })
				),
			/Insufficient Available balance/
		);

		expect(
			await prisma.payout.count({
				where: { storeId: STORE_ID, status: PayoutStatus.Processing }
			})
		).toBe(0);
	});

	test('a failed payout returns the money', async () => {
		const payout = await runSerializable(prisma, tx =>
			createPayout(tx, { storeId: STORE_ID, amount: 30_000n })
		);

		await markTransferFailed(prisma, payout.id, {
			failureReason: 'Paystack reported transfer failure'
		});

		expect(await storeBalance()).toMatchObject({
			pendingPayouts: 0n,
			paidOut: 40_000n,
			available: 70_000n
		});
	});

	test('a settled payout that Paystack reverses is no longer paid out', async () => {
		const payout = await prisma.payout.findFirstOrThrow({
			where: { storeId: STORE_ID, status: PayoutStatus.Settled }
		});

		await markTransferFailed(prisma, payout.id, {
			failureReason: 'Paystack reported transfer reversal',
			allowSettled: true
		});

		expect(await storeBalance()).toMatchObject({
			pendingPayouts: 0n,
			paidOut: 0n,
			realizedRevenue: 110_000n,
			available: 110_000n
		});
	});

	test('recalculating repairs store columns that have drifted', async () => {
		const truth = await storeBalance();

		await prisma.store.update({
			where: { id: STORE_ID },
			data: { realizedRevenue: 1n, unrealizedRevenue: -5n, paidOut: 99n }
		});

		await prisma.$transaction(tx => recalculateStoreBalance(tx, STORE_ID));

		expect(await storeBalance()).toEqual(truth);
	});

	test('ledger rows cannot be updated or deleted', async () => {
		const ledgerTransaction = await prisma.ledgerTransaction.findFirstOrThrow({
			where: { orderId: orderId(1) }
		});

		await expectRejection(
			() =>
				prisma.ledgerTransaction.update({
					where: { id: ledgerTransaction.id },
					data: { description: 'tampered' }
				}),
			/immutable/i
		);

		await expectRejection(
			() =>
				prisma.ledgerTransaction.delete({
					where: { id: ledgerTransaction.id }
				}),
			/immutable/i
		);

		const entry = await prisma.ledgerEntry.findFirstOrThrow({
			where: { transactionId: ledgerTransaction.id }
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

	test('a one-sided ledger transaction is rejected at commit', async () => {
		const account = await prisma.ledgerAccount.findFirstOrThrow({
			where: { storeId: STORE_ID }
		});

		await expectRejection(
			() =>
				prisma.$transaction(tx =>
					tx.ledgerTransaction.create({
						data: {
							idempotencyKey: `one-sided:${SUFFIX}`,
							reason: LedgerReason.ManualAdjustment,
							orderId: orderId(1),
							entries: {
								create: [
									{
										accountId: account.id,
										direction: EntryDirection.Credit,
										amount: 500n
									}
								]
							}
						}
					})
				),
			/needs at least two/
		);

		expect(
			await prisma.ledgerTransaction.findUnique({
				where: { idempotencyKey: `one-sided:${SUFFIX}` }
			})
		).toBeNull();
	});

	test('the ledger balances overall', async () => {
		const sums = await prisma.ledgerEntry.groupBy({
			by: ['direction'],
			_sum: { amount: true }
		});

		const sumFor = (direction: EntryDirection) =>
			sums.find(row => row.direction === direction)?._sum.amount ?? 0n;

		expect(sumFor(EntryDirection.Debit)).toBe(sumFor(EntryDirection.Credit));
	});
});
