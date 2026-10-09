import { describe, expect, test } from 'bun:test';

import {
	adminUpdatePayoutTransaction,
	createPayout,
	markTransferFailed,
	markTransferSuccessful
} from './transactions';
import { PayoutStatus, TransactionStatus } from '../../generated/prisma/client';
import { createFakeLedgerDb } from '../../test/fakeLedger';

const seedPayout = async () => {
	const { client, tables } = createFakeLedgerDb({
		id: 'store-1',
		name: 'Ada Stores',
		realizedRevenue: 100_000n,
		unrealizedRevenue: 0n,
		paidOut: 0n,
		pendingPayouts: 0n
	});

	const payout = await createPayout(client as never, {
		storeId: 'store-1',
		amount: 40_000n
	});

	const transaction = tables.transactions.find(
		row => row.type === 'Payout'
	) as { id: string; status: string; balanceAfter: bigint };

	return { client, tables, payout, transaction };
};

describe('createPayout', () => {
	test('takes the amount out of the available balance straight away', async () => {
		const { tables, transaction } = await seedPayout();

		const store = tables.stores.get('store-1')!;

		expect(store.pendingPayouts).toBe(40_000n);
		expect(store.realizedRevenue - store.paidOut - store.pendingPayouts).toBe(
			60_000n
		);
		expect(transaction).toMatchObject({
			status: TransactionStatus.Processing,
			amount: 40_000n,
			balanceAfter: 60_000n
		});
	});

	test('refuses a payout larger than the available balance', async () => {
		const { client } = await seedPayout();

		await expect(
			createPayout(client as never, { storeId: 'store-1', amount: 60_001n })
		).rejects.toThrow('Insufficient Available balance');
	});
});

describe('adminUpdatePayoutTransaction', () => {
	test('settles a payout addressed by its transaction id', async () => {
		const { client, tables, payout, transaction } = await seedPayout();

		expect(transaction.id).not.toBe(payout.id);

		const updated = await adminUpdatePayoutTransaction(
			client as never,
			transaction.id,
			TransactionStatus.Success
		);

		expect(updated.id).toBe(payout.id);
		expect(updated.status).toBe(PayoutStatus.Settled);

		const store = tables.stores.get('store-1')!;
		expect(store.paidOut).toBe(40_000n);
		expect(store.pendingPayouts).toBe(0n);
		expect(tables.transactions[0]!.status).toBe(TransactionStatus.Success);
	});

	test('accepts the payout id, as the webhook reference is', async () => {
		const { client, payout } = await seedPayout();

		const updated = await adminUpdatePayoutTransaction(
			client as never,
			payout.id,
			TransactionStatus.Success
		);

		expect(updated.status).toBe(PayoutStatus.Settled);
	});

	test('fails a payout and makes the money withdrawable again', async () => {
		const { client, tables, transaction } = await seedPayout();

		const updated = await adminUpdatePayoutTransaction(
			client as never,
			transaction.id,
			TransactionStatus.Failure
		);

		expect(updated.status).toBe(PayoutStatus.Failed);

		const store = tables.stores.get('store-1')!;
		expect(store.paidOut).toBe(0n);
		expect(store.pendingPayouts).toBe(0n);
		expect(store.realizedRevenue).toBe(100_000n);
		expect(tables.transactions[0]!.status).toBe(TransactionStatus.Failure);
	});

	test('refuses an id that names no payout', async () => {
		const { client } = await seedPayout();

		await expect(
			adminUpdatePayoutTransaction(
				client as never,
				'not-an-id',
				TransactionStatus.Success
			)
		).rejects.toThrow('Payout not found');
	});
});

describe('markTransferFailed', () => {
	test('refuses to fail a settled payout', async () => {
		const { client, payout } = await seedPayout();

		await markTransferSuccessful(client as never, payout.id);

		await expect(
			markTransferFailed(client as never, payout.id, {
				failureReason: 'Marked failed by admin'
			})
		).rejects.toThrow('cannot transition from Settled to Failed');
	});

	test('returns the money when Paystack reverses a settled transfer', async () => {
		const { client, tables, payout } = await seedPayout();

		await markTransferSuccessful(client as never, payout.id);

		await markTransferFailed(client as never, payout.id, {
			failureReason: 'Paystack reported transfer reversal',
			allowSettled: true
		});

		const store = tables.stores.get('store-1')!;
		expect(store.paidOut).toBe(0n);
		expect(store.pendingPayouts).toBe(0n);
		expect(store.realizedRevenue).toBe(100_000n);
		expect(tables.payouts[0]!.status).toBe(PayoutStatus.Failed);
	});

	test('is a no-op for a payout that already failed', async () => {
		const { client, tables, payout } = await seedPayout();

		const fail = () =>
			markTransferFailed(client as never, payout.id, {
				failureReason: 'Paystack reported transfer failure'
			});

		await fail();
		await fail();

		expect(tables.stores.get('store-1')!.realizedRevenue).toBe(100_000n);
	});
});
