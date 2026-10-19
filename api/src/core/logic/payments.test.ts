import { describe, expect, test, mock } from 'bun:test';

import {
	approvePayment,
	expirePaymentPendingOrders,
	handleChargeSuccess,
	handlePaystackWebhookEvent,
	transitionOrderToPending
} from './payments';
import { NotificationType } from '../notifications';
import type { ChargeEvent } from '../payments/validation';
import {
	LedgerReason,
	OrderStatus,
	PayoutStatus
} from '../../generated/prisma/client';
import { createPayout } from '../data/transactions';
import { createFakeLedgerDb } from '../../test/fakeLedger';

/**
 * `approvePayment` wraps the lookup in `runSerializable`. We give it a fake
 * Prisma whose `$transaction` proxies straight to the inner closure with a
 * fake tx client — exercising the contract without touching Postgres.
 */

const fakeContext = (payoutRequests: any[]) => {
	const tx = {
		payout: {
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
				startSpan: async (_name: string, fn: any) => fn()
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

const fakeOrderContext = (order: {
	total: number;
	status: OrderStatus;
	transactionFee?: number;
	serviceFee?: number;
	pushTokens?: { token: string; type: string }[];
}) => {
	const state = { status: order.status };

	const queueNotification = mock((_payload: any) => {});

	const { client, tables } = createFakeLedgerDb({
		id: 'store-1',
		name: 'Ada Stores',
		realizedRevenue: 0n,
		unrealizedRevenue: 0n,
		paidOut: 0n,
		pendingPayouts: 0n
	});

	Object.assign(client, {
		order: {
			findUnique: mock(async () => ({
				id: 'order-1',
				storeId: 'store-1',
				userId: 'user-1',
				total: order.total,
				transactionFee: order.transactionFee ?? 0,
				serviceFee: order.serviceFee ?? 0,
				status: state.status,
				user: { name: 'Ada' }
			})),
			update: mock(async ({ data }: any) => {
				state.status = data.status;
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
		},
		userPushToken: {
			findMany: mock(async () => order.pushTokens ?? [])
		}
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

	const payments = () =>
		tables.ledgerTransactions.filter(t => t.reason === LedgerReason.OrderPaid);

	return { c, queueNotification, tables, payments };
};

describe('transitionOrderToPending', () => {
	test('transitions the order once and notifies the store', async () => {
		const { c, queueNotification, tables, payments } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.PaymentPending
		});

		await transitionOrderToPending(c, 'order-1');

		expect(payments()).toHaveLength(1);
		expect(tables.stores.get('store-1')!.unrealizedRevenue).toBe(150_000n);
		expect(tables.stores.get('store-1')!.realizedRevenue).toBe(0n);
		expect(queueNotification).toHaveBeenCalledTimes(1);
		expect(queueNotification.mock.calls[0]?.[0]).toMatchObject({
			data: { amount: 150_000, customerName: 'Ada' }
		});
	});

	test('is idempotent across duplicate charge deliveries', async () => {
		const { c, queueNotification, tables, payments } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.PaymentPending
		});

		await transitionOrderToPending(c, 'order-1');
		await transitionOrderToPending(c, 'order-1');
		await transitionOrderToPending(c, 'order-1');

		expect(payments()).toHaveLength(1);
		expect(tables.stores.get('store-1')!.unrealizedRevenue).toBe(150_000n);
		expect(queueNotification).toHaveBeenCalledTimes(1);
	});

	test('does not transition an order that is no longer payment pending', async () => {
		const { c, queueNotification, payments } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.Cancelled
		});

		await transitionOrderToPending(c, 'order-1');

		expect(payments()).toHaveLength(0);
		expect(queueNotification).not.toHaveBeenCalled();
	});

	test('records the payment for an order that advanced without it', async () => {
		const { c, queueNotification, tables, payments } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.Pending
		});

		await transitionOrderToPending(c, 'order-1');

		expect(payments()).toHaveLength(1);
		expect(tables.stores.get('store-1')!.unrealizedRevenue).toBe(150_000n);
		// The store was told about this order when it first moved.
		expect(queueNotification).not.toHaveBeenCalled();
	});

	test('propagates a failure so the delivery can be retried', async () => {
		const { c, payments } = fakeOrderContext({
			total: 150_000,
			status: OrderStatus.PaymentPending
		});

		c.var.prisma.$transaction = mock(async () => {
			throw new Error('serialization failure');
		});

		await expect(transitionOrderToPending(c, 'order-1')).rejects.toThrow(
			'serialization failure'
		);

		expect(payments()).toHaveLength(0);
	});
});

const fakePayoutContext = async () => {
	const queueNotification = mock((_payload: any) => {});

	const { client, tables } = createFakeLedgerDb({
		id: 'store-1',
		name: 'Ada Stores',
		realizedRevenue: 100_000n,
		unrealizedRevenue: 0n,
		paidOut: 0n,
		pendingPayouts: 0n
	});

	Object.assign(client.storeManager, {
		findMany: mock(async () => [
			{ manager: { pushTokens: [{ token: 'ExponentPushToken[x]' }] } }
		])
	});

	const payout = await createPayout(client as never, {
		storeId: 'store-1',
		amount: 40_000n
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
			tracer: { startSpan: async (_name: string, fn: any) => fn() }
		}
	} as any;

	return { c, client, tables, payout, queueNotification };
};

describe('transfer.success', () => {
	test("notifies with the transaction's id, not the payout's", async () => {
		const { c, tables, payout, queueNotification } = await fakePayoutContext();

		await handlePaystackWebhookEvent(c, 'transfer.success', {
			reason: 'Payout',
			reference: payout.id
		});

		const transaction = tables.transactions.find(row => row.type === 'Payout')!;

		expect(queueNotification).toHaveBeenCalledTimes(1);
		expect(queueNotification.mock.calls[0]?.[0]).toMatchObject({
			data: { amount: 40_000, transactionId: transaction.id }
		});
		expect(transaction.id).not.toBe(payout.id);
	});
});

const ORDER_TOTAL = 150_000;
const TRANSACTION_FEE = 2_250;
const SERVICE_FEE = 10_000;
const EXPECTED_CHARGE = ORDER_TOTAL + TRANSACTION_FEE + SERVICE_FEE;

const pricedOrder = (status: OrderStatus = OrderStatus.PaymentPending) => ({
	total: ORDER_TOTAL,
	transactionFee: TRANSACTION_FEE,
	serviceFee: SERVICE_FEE,
	status,
	pushTokens: [{ token: 'ExponentPushToken[shopper]', type: 'Shopper' }]
});

const incoming = (overrides: Partial<ChargeEvent> = {}): ChargeEvent => ({
	orderId: 'order-1',
	amount: EXPECTED_CHARGE,
	currency: 'NGN',
	reference: 'ref_transfer',
	reason: null,
	instrument: 'transfer',
	card: null,
	...overrides
});

const storedCard: NonNullable<ChargeEvent['card']> = {
	email: 'ada@example.com',
	signature: 'SIG_card',
	authorizationCode: 'AUTH_card',
	bin: '408408',
	last4: '4081',
	expMonth: '12',
	expYear: '2030',
	bank: 'Test Bank',
	cardType: 'visa',
	countryCode: 'NG'
};

describe('charge.success', () => {
	test('pays an order from a translated transfer charge', async () => {
		const { c, queueNotification, tables, payments } =
			fakeOrderContext(pricedOrder());

		await handleChargeSuccess(c, incoming());

		expect(payments()).toHaveLength(2);
		expect(tables.stores.get('store-1')!.unrealizedRevenue).toBe(
			BigInt(ORDER_TOTAL)
		);
		expect(queueNotification).toHaveBeenCalledTimes(1);
		expect(c.var.prisma.order.update).toHaveBeenCalledTimes(1);
	});

	test('pays an order when the webhook metadata is a JSON string', async () => {
		const { c, payments } = fakeOrderContext(pricedOrder());

		await handlePaystackWebhookEvent(c, 'charge.success', {
			amount: EXPECTED_CHARGE,
			reference: 'ref_transfer',
			currency: 'NGN',
			channel: 'bank_transfer',
			metadata: JSON.stringify({ orderId: 'order-1' }),
			authorization: { card_type: 'transfer', channel: 'bank_transfer' }
		});

		expect(payments()).toHaveLength(2);
	});

	test('does not mark the order paid when the amount mismatches', async () => {
		const { c, queueNotification, payments } = fakeOrderContext(pricedOrder());

		await handleChargeSuccess(c, incoming({ amount: ORDER_TOTAL }));

		expect(payments()).toHaveLength(0);
		expect(queueNotification).not.toHaveBeenCalled();
		expect(c.var.prisma.order.update).not.toHaveBeenCalled();
		expect(c.var.logger.error).toHaveBeenCalledWith(
			expect.objectContaining({
				orderId: 'order-1',
				paidAmount: ORDER_TOTAL,
				expectedAmount: EXPECTED_CHARGE,
				reference: 'ref_transfer',
				handling: 'left_unpaid'
			}),
			'payment.charge_amount_mismatch'
		);
	});

	test('does not mark the order paid when the amount is missing', async () => {
		const { c, payments } = fakeOrderContext(pricedOrder());

		await handleChargeSuccess(c, incoming({ amount: null }));

		expect(payments()).toHaveLength(0);
		expect(c.var.logger.error).toHaveBeenCalledWith(
			expect.objectContaining({ orderId: 'order-1', handling: 'left_unpaid' }),
			'payment.charge_amount_missing'
		);
	});

	test('does not mark the order paid when the currency is not NGN', async () => {
		const { c, payments } = fakeOrderContext(pricedOrder());

		await handleChargeSuccess(c, incoming({ currency: 'USD' }));

		expect(payments()).toHaveLength(0);
		expect(c.var.logger.error).toHaveBeenCalledWith(
			expect.objectContaining({ currency: 'USD', handling: 'left_unpaid' }),
			'payment.charge_amount_mismatch'
		);
	});

	test('does not apply a matching charge to an order that is already closed', async () => {
		const { c, payments } = fakeOrderContext(
			pricedOrder(OrderStatus.Cancelled)
		);

		await handleChargeSuccess(c, incoming());

		expect(payments()).toHaveLength(0);
		expect(c.var.logger.error).toHaveBeenCalledWith(
			expect.objectContaining({
				orderId: 'order-1',
				reference: 'ref_transfer'
			}),
			'payment.charge_for_closed_order'
		);
	});

	test('stores a card when a matching card charge pays the order', async () => {
		const { c, queueNotification, payments } = fakeOrderContext(pricedOrder());
		const upsert = mock(async () => ({ id: 'card-1' }));
		c.var.prisma.user = { findUnique: mock(async () => ({ id: 'user-1' })) };
		c.var.prisma.card = { upsert };

		await handleChargeSuccess(
			c,
			incoming({
				instrument: 'card',
				reference: 'ref_card',
				card: storedCard
			})
		);

		expect(payments()).toHaveLength(2);
		expect(upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				create: expect.objectContaining({
					authorizationCode: 'AUTH_card',
					signature: 'SIG_card'
				})
			})
		);
		expect(queueNotification).toHaveBeenCalledTimes(1);
		expect(queueNotification.mock.calls[0]?.[0].type).toBe(
			NotificationType.NewOrder
		);
	});

	test('still stores the card when a card charge amount mismatches', async () => {
		const { c, queueNotification, payments } = fakeOrderContext(pricedOrder());
		const upsert = mock(async () => ({ id: 'card-1' }));
		c.var.prisma.user = { findUnique: mock(async () => ({ id: 'user-1' })) };
		c.var.prisma.card = { upsert };

		await handleChargeSuccess(
			c,
			incoming({ instrument: 'card', amount: 1, card: storedCard })
		);

		expect(payments()).toHaveLength(0);
		expect(queueNotification).not.toHaveBeenCalled();
		expect(upsert).toHaveBeenCalledTimes(1);
	});

	test('ignores a dedicated-account charge with no order', async () => {
		const { c, payments } = fakeOrderContext(pricedOrder());

		await handleChargeSuccess(
			c,
			incoming({
				orderId: null,
				instrument: 'dedicated_account',
				reference: 'dva_ref'
			})
		);

		expect(payments()).toHaveLength(0);
		expect(c.var.logger.warn).toHaveBeenCalledWith(
			expect.objectContaining({ reference: 'dva_ref' }),
			'payment.unsolicited_transfer_ignored'
		);
	});
});

describe('bank.transfer.rejected', () => {
	const rejected = (metadata: unknown) => ({
		amount: 100,
		reference: 'ref_rejected',
		currency: 'NGN',
		channel: 'bank_transfer',
		gateway_response: 'Incorrect amount',
		metadata,
		authorization: { card_type: 'transfer', channel: 'bank_transfer' }
	});

	test('notifies the shopper and leaves the order unpaid', async () => {
		const { c, queueNotification, payments } = fakeOrderContext(pricedOrder());

		await handlePaystackWebhookEvent(
			c,
			'bank.transfer.rejected',
			rejected(JSON.stringify({ orderId: 'order-1' }))
		);

		expect(payments()).toHaveLength(0);
		expect(c.var.prisma.order.update).not.toHaveBeenCalled();
		expect(queueNotification).toHaveBeenCalledTimes(1);
		expect(queueNotification.mock.calls[0]?.[0]).toMatchObject({
			type: NotificationType.PaymentRejected,
			data: { orderId: 'order-1' },
			recipientTokens: ['ExponentPushToken[shopper]']
		});
		expect(c.var.logger.error).toHaveBeenCalledWith(
			expect.objectContaining({
				orderId: 'order-1',
				reference: 'ref_rejected',
				reason: 'Incorrect amount'
			}),
			'payment.transfer_rejected'
		);
	});

	test('records a rejection that cannot be tied to an order', async () => {
		const { c, queueNotification } = fakeOrderContext(pricedOrder());

		await handlePaystackWebhookEvent(c, 'bank.transfer.rejected', rejected(''));

		expect(queueNotification).not.toHaveBeenCalled();
		expect(c.var.logger.error).toHaveBeenCalledWith(
			expect.objectContaining({ orderId: null, reference: 'ref_rejected' }),
			'payment.transfer_rejected'
		);
	});

	test('does not notify for a dedicated virtual account rejection', async () => {
		const { c, queueNotification } = fakeOrderContext(pricedOrder());

		await handlePaystackWebhookEvent(c, 'bank.transfer.rejected', {
			...rejected({ orderId: 'order-1' }),
			channel: 'dedicated_nuban',
			authorization: { card_type: 'transfer', channel: 'dedicated_nuban' }
		});

		expect(queueNotification).not.toHaveBeenCalled();
		expect(c.var.logger.warn).toHaveBeenCalledWith(
			expect.objectContaining({ reference: 'ref_rejected' }),
			'payment.transfer_rejected_ignored'
		);
	});

	test('a later matching charge can still pay the order', async () => {
		const { c, queueNotification, payments } = fakeOrderContext(pricedOrder());

		await handlePaystackWebhookEvent(
			c,
			'bank.transfer.rejected',
			rejected({ orderId: 'order-1' })
		);
		await handleChargeSuccess(c, incoming());

		expect(payments()).toHaveLength(2);
		expect(queueNotification).toHaveBeenCalledTimes(2);
		expect(queueNotification.mock.calls[1]?.[0].type).toBe(
			NotificationType.NewOrder
		);
	});
});

describe('expirePaymentPendingOrders', () => {
	const NOW = new Date('2026-01-01T00:45:00.000Z');
	const EXPIRY_MS = 35 * 60 * 1000;
	const CUTOFF = new Date(NOW.getTime() - EXPIRY_MS);

	const build = () => {
		const quantities = new Map([
			['p1', 4],
			['p2', 1]
		]);
		const status = new Map<string, OrderStatus>([
			['stale', OrderStatus.PaymentPending],
			['boundary', OrderStatus.PaymentPending],
			['fresh', OrderStatus.PaymentPending],
			['racing', OrderStatus.Pending]
		]);

		const orders = [
			{
				id: 'stale',
				userId: 'user-1',
				storeId: 'store-1',
				total: 10_000,
				status: OrderStatus.PaymentPending,
				createdAt: new Date('2026-01-01T00:00:00.000Z'),
				products: [
					{ productId: 'p1', quantity: 2 },
					{ productId: 'p2', quantity: 1 }
				],
				user: {
					pushTokens: [
						{ token: 'ExponentPushToken[shopper]', type: 'Shopper' },
						{ token: 'ExponentPushToken[merchant]', type: 'Merchant' }
					]
				}
			},
			{
				id: 'boundary',
				userId: 'user-1',
				storeId: 'store-1',
				total: 5_000,
				status: OrderStatus.PaymentPending,
				createdAt: CUTOFF,
				products: [{ productId: 'p1', quantity: 9 }],
				user: { pushTokens: [] }
			},
			{
				id: 'fresh',
				userId: 'user-1',
				storeId: 'store-1',
				total: 5_000,
				status: OrderStatus.PaymentPending,
				createdAt: new Date('2026-01-01T00:40:00.000Z'),
				products: [{ productId: 'p2', quantity: 4 }],
				user: { pushTokens: [] }
			},
			{
				id: 'racing',
				userId: 'user-1',
				storeId: 'store-1',
				total: 5_000,
				status: OrderStatus.PaymentPending,
				createdAt: new Date('2026-01-01T00:00:00.000Z'),
				products: [{ productId: 'p1', quantity: 5 }],
				user: { pushTokens: [] }
			}
		];

		const client = {
			order: {
				findMany: mock(async ({ where }: any) =>
					orders
						.filter(order => {
							// `racing` is still PaymentPending in the query snapshot
							// and Pending once the row is locked, so a missing
							// re-read would release its stock.
							const visible =
								order.id === 'racing'
									? OrderStatus.PaymentPending
									: status.get(order.id);
							if (visible !== where.status) return false;
							if (
								where.createdAt?.lt &&
								!(order.createdAt < where.createdAt.lt)
							) {
								return false;
							}
							return true;
						})
						.map(order => ({
							...order,
							status:
								order.id === 'racing'
									? OrderStatus.PaymentPending
									: status.get(order.id)
						}))
				),
				findUnique: mock(async ({ where }: any) => {
					const order = orders.find(row => row.id === where.id);
					if (!order) return null;
					return { ...order, status: status.get(order.id) };
				}),
				update: mock(async ({ where, data }: any) => {
					status.set(where.id, data.status);
					return { id: where.id, status: data.status };
				})
			},
			product: {
				update: mock(async ({ where, data }: any) => {
					const next =
						(quantities.get(where.id) ?? 0) + data.quantity.increment;
					quantities.set(where.id, next);
					return { id: where.id, quantity: next };
				})
			},
			$transaction: async (fn: any) => fn(client)
		};

		return { client, quantities, status };
	};

	test('cancels stale unpaid orders and releases their stock', async () => {
		const { client, quantities, status } = build();
		const info = mock(() => {});

		const expired = await expirePaymentPendingOrders(client as any, {
			now: NOW,
			expiryMs: EXPIRY_MS,
			logger: { info, warn: mock(() => {}), error: mock(() => {}) } as any
		});

		expect(expired).toEqual([
			{
				id: 'stale',
				userId: 'user-1',
				storeId: 'store-1',
				total: 10_000,
				pushTokens: ['ExponentPushToken[shopper]']
			}
		]);
		expect(status.get('stale')).toBe(OrderStatus.Cancelled);
		expect(status.get('boundary')).toBe(OrderStatus.PaymentPending);
		expect(status.get('fresh')).toBe(OrderStatus.PaymentPending);
		expect(status.get('racing')).toBe(OrderStatus.Pending);
		expect(quantities.get('p1')).toBe(6);
		expect(quantities.get('p2')).toBe(2);
		expect(info).toHaveBeenCalledWith(
			expect.objectContaining({ orderId: 'stale' }),
			'payment_pending.expired'
		);

		const again = await expirePaymentPendingOrders(client as any, {
			now: NOW,
			expiryMs: EXPIRY_MS,
			logger: { info, warn: mock(() => {}), error: mock(() => {}) } as any
		});

		expect(again).toEqual([]);
		expect(quantities.get('p1')).toBe(6);
		expect(quantities.get('p2')).toBe(2);
	});
});
