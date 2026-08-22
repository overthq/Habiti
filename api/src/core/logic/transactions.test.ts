import { describe, expect, test, mock } from 'bun:test';

import { createPayoutTransaction, getStoreBalance } from './transactions';
import { computeAvailableBalance } from '../data/transactions';
import { LogicErrorCode } from './errors';
import { LedgerReason } from '../../generated/prisma/client';
import { createFakeLedgerDb } from '../../test/fakeLedger';

/**
 * Regression cover for the double-payout overdraw.
 *
 * `Store.paidOut` only moves when Paystack confirms the transfer, so a payout
 * that has been initiated but not yet settled is invisible to the store
 * columns. Before the fix, a second request placed in that window re-read the
 * untouched columns, saw the full balance and was approved — paying out twice.
 *
 * The fake Prisma below models the two reads the check now depends on: the
 * locked store row (`$queryRaw ... FOR UPDATE`) and the sum of payouts still
 * in `Processing`.
 */

interface FakeStoreState {
	realizedRevenue: number;
	paidOut: number;
	pendingPayouts: number;
	/** Defaults to a store with one attached account, which is the payable case. */
	hasPayoutAccount?: boolean;
}

const fakeContext = (state: FakeStoreState) => {
	const { client, tables } = createFakeLedgerDb(
		{
			id: 'store-1',
			name: 'Ada Stores',
			// `realizedRevenue` is the identity available + paidOut + pendingPayouts,
			// so seeding it directly is the same as replaying journals to this point.
			realizedRevenue: BigInt(state.realizedRevenue),
			unrealizedRevenue: 0n,
			paidOut: BigInt(state.paidOut),
			pendingPayouts: BigInt(state.pendingPayouts),
			ledgerSequence: 0n
		},
		state.hasPayoutAccount === false ? undefined : { storeId: 'store-1' }
	);

	const c = {
		var: {
			auth: { id: 'user-1', name: 'Ada' },
			storeId: 'store-1',
			isAdmin: false,
			prisma: client,
			logger: { error: mock(() => {}), warn: mock(() => {}) },
			services: { analytics: { track: mock(() => {}) } }
		}
	} as any;

	return {
		c,
		queryRaw: client.$queryRaw,
		createPayout: client.payoutRequest.create,
		tables
	};
};

const expectLogicError = async (fn: () => Promise<unknown>, code: string) => {
	try {
		await fn();
	} catch (error) {
		expect((error as { code?: string }).code).toBe(code);
		return;
	}

	throw new Error(`expected a LogicError with code ${code}`);
};

describe('computeAvailableBalance', () => {
	test('subtracts in-flight payouts from the settled balance', () => {
		expect(
			computeAvailableBalance({
				realizedRevenue: 100_000,
				paidOut: 0,
				pendingPayouts: 100_000
			})
		).toBe(0);
	});

	test('matches realized minus paid out when nothing is in flight', () => {
		expect(
			computeAvailableBalance({
				realizedRevenue: 100_000,
				paidOut: 40_000,
				pendingPayouts: 0
			})
		).toBe(60_000);
	});
});

describe('createPayoutTransaction', () => {
	test('rejects a second payout that a Processing payout has already committed', async () => {
		// Request #1 for the full balance is still awaiting `transfer.success`,
		// so `paidOut` is untouched. The old check read 100k available here.
		const { c, createPayout } = fakeContext({
			realizedRevenue: 100_000,
			paidOut: 0,
			pendingPayouts: 100_000
		});

		await expectLogicError(
			() => createPayoutTransaction(c, { amount: 100_000 }),
			LogicErrorCode.InsufficientFunds
		);

		expect(createPayout).not.toHaveBeenCalled();
	});

	test('rejects a partial payout that exceeds the balance net of in-flight', async () => {
		const { c, createPayout } = fakeContext({
			realizedRevenue: 100_000,
			paidOut: 0,
			pendingPayouts: 70_000
		});

		await expectLogicError(
			() => createPayoutTransaction(c, { amount: 40_000 }),
			LogicErrorCode.InsufficientFunds
		);

		expect(createPayout).not.toHaveBeenCalled();
	});

	test('reads the store balance under a row lock', async () => {
		const { c, queryRaw } = fakeContext({
			realizedRevenue: 100_000,
			paidOut: 0,
			pendingPayouts: 100_000
		});

		await expectLogicError(
			() => createPayoutTransaction(c, { amount: 100_000 }),
			LogicErrorCode.InsufficientFunds
		);

		// The lock is what makes concurrent requests queue rather than race:
		// nothing in this path writes the store row, so without it there is no
		// conflict for Postgres to detect.
		const sql = (queryRaw.mock.calls[0]?.[0] as unknown as string[])?.join('');
		expect(sql).toContain('FOR UPDATE');
	});

	test('still rejects a payout larger than the balance with nothing in flight', async () => {
		const { c, createPayout } = fakeContext({
			realizedRevenue: 50_000,
			paidOut: 0,
			pendingPayouts: 0
		});

		await expectLogicError(
			() => createPayoutTransaction(c, { amount: 60_000 }),
			LogicErrorCode.InsufficientFunds
		);

		expect(createPayout).not.toHaveBeenCalled();
	});
});

describe('getStoreBalance', () => {
	test('reports available net of in-flight payouts', async () => {
		const { c } = fakeContext({
			realizedRevenue: 100_000,
			paidOut: 20_000,
			pendingPayouts: 30_000
		});

		const balance = await getStoreBalance(c, 'store-1');

		expect(balance.pendingPayouts).toBe(30_000);
		expect(balance.available).toBe(50_000);
	});

	test('agrees with what the payout check would allow', async () => {
		const { c } = fakeContext({
			realizedRevenue: 100_000,
			paidOut: 0,
			pendingPayouts: 100_000
		});

		const balance = await getStoreBalance(c, 'store-1');

		expect(balance.available).toBe(0);
	});
});
