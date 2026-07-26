import { describe, expect, test, mock } from 'bun:test';

import { approvePayment, transitionOrderToPending } from './payments';
import { OrderStatus, TransactionStatus } from '../../generated/prisma/client';

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

/**
 * A charge can be delivered more than once (webhook retries, and the
 * verification poll in development), so the fake Prisma below models the
 * conditional update: `updateMany` only reports a row when the stored status
 * still matches the `where` clause.
 */

const fakeOrderContext = (order: { total: number; status: OrderStatus }) => {
	const state = { status: order.status };

	const storeUpdate = mock(async () => ({}));
	const queueNotification = mock((_payload: any) => {});

	const c = {
		var: {
			prisma: {
				order: {
					findUnique: mock(async () => ({
						id: 'order-1',
						storeId: 'store-1',
						total: order.total,
						status: state.status,
						user: { name: 'Ada' }
					})),
					updateMany: mock(async ({ where }: any) => {
						if (state.status !== where.status) return { count: 0 };
						state.status = OrderStatus.Pending;
						return { count: 1 };
					})
				},
				store: { update: storeUpdate },
				storeManager: {
					findMany: mock(async () => [
						{ manager: { pushTokens: [{ token: 'ExponentPushToken[x]' }] } }
					])
				}
			},
			logger: { warn: mock(() => {}), error: mock(() => {}) },
			services: { notifications: { queueNotification } }
		}
	} as any;

	return { c, storeUpdate, queueNotification };
};

describe('transitionOrderToPending', () => {
	test('transitions the order once and notifies the store', async () => {
		const { c, storeUpdate, queueNotification } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.PaymentPending
		});

		await transitionOrderToPending(c, 'order-1');

		expect(storeUpdate).toHaveBeenCalledTimes(1);
		expect(queueNotification).toHaveBeenCalledTimes(1);
		expect(queueNotification.mock.calls[0]?.[0]).toMatchObject({
			data: { amount: 150_000, customerName: 'Ada' }
		});
	});

	test('is idempotent across duplicate charge deliveries', async () => {
		const { c, storeUpdate, queueNotification } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.PaymentPending
		});

		await transitionOrderToPending(c, 'order-1');
		await transitionOrderToPending(c, 'order-1');
		await transitionOrderToPending(c, 'order-1');

		expect(storeUpdate).toHaveBeenCalledTimes(1);
		expect(queueNotification).toHaveBeenCalledTimes(1);
	});

	test('does not transition an order that is no longer payment pending', async () => {
		const { c, storeUpdate, queueNotification } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.Cancelled
		});

		await transitionOrderToPending(c, 'order-1');

		expect(storeUpdate).not.toHaveBeenCalled();
		expect(queueNotification).not.toHaveBeenCalled();
	});
});
