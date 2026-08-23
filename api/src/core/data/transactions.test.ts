import { describe, expect, test } from 'bun:test';

import {
	adminUpdatePayoutTransaction,
	createPayoutRequest,
	resolvePayoutRequestId
} from './transactions';
import { recordPayoutRequested } from './postings';
import { PayoutStatus, TransactionStatus } from '../../generated/prisma/client';
import { createFakeLedgerDb } from '../../test/fakeLedger';

/**
 * Payouts are addressed by two different ids, and which one a caller holds
 * depends on where they got it.
 *
 * `PayoutRequest.id` is the Paystack transfer reference, so it is what the
 * settlement webhook carries. But everything a *person* looks at comes from
 * the statement, whose rows have ids of their own -- the admin panel lists
 * payouts through `getTransactionsByStoreId` and hands back the id of the row
 * that was clicked. Sending that to the settlement path used to fail with
 * "Payout request not found", which made the admin override dead on arrival.
 */

const seedPayout = async () => {
	const { client, tables } = createFakeLedgerDb({
		id: 'store-1',
		name: 'Ada Stores',
		realizedRevenue: 100_000n,
		unrealizedRevenue: 0n,
		paidOut: 0n,
		pendingPayouts: 0n,
		ledgerSequence: 0n
	});

	const request = await createPayoutRequest(client as never, {
		storeId: 'store-1',
		amount: 40_000n
	});

	await recordPayoutRequested(client as never, {
		storeId: 'store-1',
		payoutRequestId: request.id,
		amount: request.amount
	});

	const statementEntry = tables.statement.find(
		row => row.type === 'Payout'
	) as { id: string };

	return { client, tables, request, statementEntry };
};

describe('resolvePayoutRequestId', () => {
	test('resolves the statement row id the admin panel actually holds', async () => {
		const { client, request, statementEntry } = await seedPayout();

		expect(statementEntry.id).not.toBe(request.id);
		expect(
			await resolvePayoutRequestId(client as never, statementEntry.id)
		).toBe(request.id);
	});

	test('accepts a payout request id, as the webhook reference is', async () => {
		const { client, request } = await seedPayout();

		expect(await resolvePayoutRequestId(client as never, request.id)).toBe(
			request.id
		);
	});

	test('resolves nothing for an id that is neither', async () => {
		const { client } = await seedPayout();

		expect(
			await resolvePayoutRequestId(client as never, 'not-an-id')
		).toBeNull();
	});
});

describe('adminUpdatePayoutTransaction', () => {
	test('settles a payout addressed by its statement row id', async () => {
		const { client, tables, request, statementEntry } = await seedPayout();

		const updated = await adminUpdatePayoutTransaction(
			client as never,
			statementEntry.id,
			TransactionStatus.Success
		);

		expect(updated.id).toBe(request.id);
		expect(updated.status).toBe(PayoutStatus.Settled);

		const store = tables.stores.get('store-1')!;
		expect(store.paidOut).toBe(40_000n);
		expect(store.pendingPayouts).toBe(0n);
	});

	test('reverses a payout addressed by its statement row id', async () => {
		const { client, tables, statementEntry } = await seedPayout();

		const updated = await adminUpdatePayoutTransaction(
			client as never,
			statementEntry.id,
			TransactionStatus.Failure
		);

		expect(updated.status).toBe(PayoutStatus.Failed);

		const store = tables.stores.get('store-1')!;
		expect(store.paidOut).toBe(0n);
		expect(store.pendingPayouts).toBe(0n);
		// The money is withdrawable again.
		expect(store.realizedRevenue).toBe(100_000n);
	});

	test('refuses an id that names no payout', async () => {
		const { client } = await seedPayout();

		await expect(
			adminUpdatePayoutTransaction(
				client as never,
				'not-an-id',
				TransactionStatus.Success
			)
		).rejects.toThrow('Payout request not found');
	});
});
