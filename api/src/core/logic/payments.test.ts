import { describe, expect, test, mock } from 'bun:test';

import {
	approvePayment,
	handlePaystackWebhookEvent,
	transitionOrderToPending
} from './payments';
import {
	LedgerReason,
	OrderStatus,
	PayoutStatus
} from '../../generated/prisma/client';
import { createPayoutRequest } from '../data/transactions';
import { recordPayoutRequested } from '../data/postings';
import { createFakeLedgerDb } from '../../test/fakeLedger';

/**
 * `approvePayment` wraps the lookup in `runSerializable`. We give it a fake
 * Prisma whose `$transaction` proxies straight to the inner closure with a
 * fake tx client — exercising the contract without touching Postgres.
 */

const fakeContext = (payoutRequests: any[]) => {
	const tx = {
		payoutRequest: {
			findUnique: mock(
				async ({ where: { id } }: any) =>
					payoutRequests.find(t => t.id === id) ?? null
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
				status: PayoutStatus.Processing,
				amount: 1000n
			},
			{
				id: 'tx-2',
				status: PayoutStatus.Processing,
				amount: 2000n
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
			{ id: 'tx-1', status: PayoutStatus.Processing, amount: 1000n }
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
			{ id: 'tx-1', status: PayoutStatus.Settled, amount: 1000n }
		]);

		const result = await approvePayment(
			c,
			validBody([{ reference: 'tx-1', amount: 1000 }])
		);

		expect(result).toBeNull();
	});

	test('returns null when amount mismatches the stored row', async () => {
		const c = fakeContext([
			{ id: 'tx-1', status: PayoutStatus.Processing, amount: 1000n }
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

	const queueNotification = mock((_payload: any) => {});

	// Real ledger storage behind a fake order table, so the assertions below
	// are about journals actually posted rather than a column write.
	const { client, tables } = createFakeLedgerDb({
		id: 'store-1',
		name: 'Ada Stores',
		realizedRevenue: 0n,
		unrealizedRevenue: 0n,
		paidOut: 0n,
		pendingPayouts: 0n,
		ledgerSequence: 0n
	});

	Object.assign(client, {
		order: {
			findUnique: mock(async () => ({
				id: 'order-1',
				storeId: 'store-1',
				total: order.total,
				serviceFee: 0,
				status: state.status,
				user: { name: 'Ada' }
			})),
			updateMany: mock(async ({ where }: any) => {
				if (state.status !== where.status) return { count: 0 };
				state.status = OrderStatus.Pending;
				return { count: 1 };
			})
		},
		storeManager: {
			findMany: mock(async () => [
				{ manager: { pushTokens: [{ token: 'ExponentPushToken[x]' }] } }
			]),
			findUnique: mock(async () => ({
				managerId: 'user-1',
				storeId: 'store-1'
			}))
		}
	});

	const c = {
		var: {
			prisma: client,
			logger: { warn: mock(() => {}), error: mock(() => {}) },
			services: { notifications: { queueNotification } }
		}
	} as any;

	const paidJournals = () =>
		tables.journals.filter(j => j.reason === LedgerReason.OrderPaid);

	return { c, queueNotification, tables, paidJournals };
};

describe('transitionOrderToPending', () => {
	test('transitions the order once and notifies the store', async () => {
		const { c, queueNotification, tables, paidJournals } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.PaymentPending
		});

		await transitionOrderToPending(c, 'order-1');

		expect(paidJournals()).toHaveLength(1);
		// The money is collected but the order is not complete, so it lands in
		// pending -- not in the balance the merchant can withdraw.
		expect(tables.stores.get('store-1')!.unrealizedRevenue).toBe(150_000n);
		expect(tables.stores.get('store-1')!.realizedRevenue).toBe(0n);
		expect(queueNotification).toHaveBeenCalledTimes(1);
		expect(queueNotification.mock.calls[0]?.[0]).toMatchObject({
			data: { amount: 150_000, customerName: 'Ada' }
		});
	});

	test('is idempotent across duplicate charge deliveries', async () => {
		const { c, queueNotification, tables, paidJournals } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.PaymentPending
		});

		await transitionOrderToPending(c, 'order-1');
		await transitionOrderToPending(c, 'order-1');
		await transitionOrderToPending(c, 'order-1');

		expect(paidJournals()).toHaveLength(1);
		expect(tables.stores.get('store-1')!.unrealizedRevenue).toBe(150_000n);
		expect(queueNotification).toHaveBeenCalledTimes(1);
	});

	test('does not transition an order that is no longer payment pending', async () => {
		const { c, queueNotification, paidJournals } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.Cancelled
		});

		await transitionOrderToPending(c, 'order-1');

		expect(paidJournals()).toHaveLength(0);
		expect(queueNotification).not.toHaveBeenCalled();
	});

	/**
	 * The gap a swallowed error used to leave: the order moved, the posting did
	 * not, and the status guard then refused to let a replay finish the job --
	 * revenue the store never got credited for, invisible to reconciliation
	 * because the ledger and the projection agreed about nothing.
	 */
	test('completes the posting for an order already moved to pending', async () => {
		const { c, queueNotification, tables, paidJournals } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.Pending
		});

		await transitionOrderToPending(c, 'order-1');

		expect(paidJournals()).toHaveLength(1);
		expect(tables.stores.get('store-1')!.unrealizedRevenue).toBe(150_000n);
		// The store was told about this order when it first moved.
		expect(queueNotification).not.toHaveBeenCalled();
	});

	test('propagates a posting failure so the delivery can be replayed', async () => {
		const { c, paidJournals } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.PaymentPending
		});

		c.var.prisma.$transaction = mock(async () => {
			throw new Error('serialization failure');
		});

		await expect(transitionOrderToPending(c, 'order-1')).rejects.toThrow(
			'serialization failure'
		);

		expect(paidJournals()).toHaveLength(0);
	});
});

/**
 * The payout-confirmed push deep-links into the dashboard's transaction
 * screen, which resolves ids against the *statement* -- so the notification
 * has to carry the statement row's id. Sending `PayoutRequest.id`, which is
 * the Paystack transfer reference, gave the merchant a link to nothing.
 */
const fakePayoutContext = async () => {
	const queueNotification = mock((_payload: any) => {});

	const { client, tables } = createFakeLedgerDb({
		id: 'store-1',
		name: 'Ada Stores',
		realizedRevenue: 100_000n,
		unrealizedRevenue: 0n,
		paidOut: 0n,
		pendingPayouts: 0n,
		ledgerSequence: 0n
	});

	Object.assign(client.storeManager, {
		findMany: mock(async () => [
			{ manager: { pushTokens: [{ token: 'ExponentPushToken[x]' }] } }
		])
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

	const c = {
		var: {
			prisma: client,
			logger: {
				warn: mock(() => {}),
				error: mock(() => {}),
				info: mock(() => {})
			},
			services: { notifications: { queueNotification } },
			tracer: { startSpan: async (_name: string, fn: any) => fn({}) }
		}
	} as any;

	return { c, client, tables, request, queueNotification };
};

describe('transfer.success', () => {
	test('notifies with the statement row id, not the payout request id', async () => {
		const { c, tables, request, queueNotification } = await fakePayoutContext();

		await handlePaystackWebhookEvent(c, 'transfer.success', {
			reason: 'Payout',
			reference: request.id
		});

		const statementEntry = tables.statement.find(row => row.type === 'Payout')!;

		expect(queueNotification).toHaveBeenCalledTimes(1);
		expect(queueNotification.mock.calls[0]?.[0]).toMatchObject({
			data: { amount: 40_000, transactionId: statementEntry.id }
		});
		expect(statementEntry.id).not.toBe(request.id);
	});
});
