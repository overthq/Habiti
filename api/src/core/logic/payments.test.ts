import { describe, expect, test, mock } from 'bun:test';

import { approvePayment } from './payments';
import { TransactionStatus } from '../../generated/prisma/client';

/**
 * `approvePayment` wraps the lookup in `runSerializable`. We give it a fake
 * Prisma whose `$transaction` proxies straight to the inner closure with a
 * fake tx client — exercising the contract without touching Postgres.
 */

const fakeContext = (transactions: any[]) => {
	const tx = {
		transaction: {
			findUnique: mock(
				async ({ where: { id } }: any) =>
					transactions.find(t => t.id === id) ?? null
			)
		}
	};

	return {
		var: {
			prisma: {
				$transaction: async (fn: any) => fn(tx)
			},
			tracer: {
				startSpan: async (_name: string, fn: any) => fn({}),
				raw: {} as any
			}
		}
	} as any;
};

const validBody = (refs: { reference: string; amount: number }[]) => ({
	data: { transfers: refs }
});

describe('approvePayment', () => {
	test('returns rows when every transfer matches a Processing row', async () => {
		const c = fakeContext([
			{
				id: 'tx-1',
				status: TransactionStatus.Processing,
				amount: 1000
			},
			{
				id: 'tx-2',
				status: TransactionStatus.Processing,
				amount: 2000
			}
		]);

		const result = await approvePayment(
			c,
			validBody([
				{ reference: 'tx-1', amount: 1000 },
				{ reference: 'tx-2', amount: 2000 }
			])
		);

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(2);
	});

	test('returns null when any reference is missing', async () => {
		const c = fakeContext([
			{ id: 'tx-1', status: TransactionStatus.Processing, amount: 1000 }
		]);

		const result = await approvePayment(
			c,
			validBody([
				{ reference: 'tx-1', amount: 1000 },
				{ reference: 'tx-missing', amount: 500 }
			])
		);

		expect(result).toBeNull();
	});

	test('returns null when status is not Processing', async () => {
		const c = fakeContext([
			{ id: 'tx-1', status: TransactionStatus.Success, amount: 1000 }
		]);

		const result = await approvePayment(
			c,
			validBody([{ reference: 'tx-1', amount: 1000 }])
		);

		expect(result).toBeNull();
	});

	test('returns null when amount mismatches the stored row', async () => {
		const c = fakeContext([
			{ id: 'tx-1', status: TransactionStatus.Processing, amount: 1000 }
		]);

		const result = await approvePayment(
			c,
			validBody([{ reference: 'tx-1', amount: 9_999 }])
		);

		expect(result).toBeNull();
	});
});
