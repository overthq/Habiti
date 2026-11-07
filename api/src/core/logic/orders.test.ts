import { describe, expect, mock, test } from 'bun:test';

import { cancelUnpaidOrder, updateOrderStatus } from './orders';
import { LogicErrorCode } from './errors';
import { OrderStatus } from '../../generated/prisma/client';

const fakeContext = (
	order: Record<string, unknown> | null,
	vars: { authId: string; storeId?: string; isAdmin?: boolean }
) => {
	const tx = {
		order: {
			findUnique: mock(async () => order),
			update: mock(async ({ data }: any) => ({
				...order,
				...data,
				user: { pushTokens: [] }
			}))
		},
		product: { update: mock(async () => ({})) }
	};

	const c = {
		var: {
			auth: { id: vars.authId, name: 'Caller' },
			storeId: vars.storeId,
			isAdmin: vars.isAdmin ?? false,
			prisma: { $transaction: async (fn: any) => fn(tx) },
			tracer: { startSpan: async (_name: string, fn: any) => fn() },
			services: {
				analytics: { track: mock(() => {}) },
				notifications: { queueNotification: mock(() => {}) }
			}
		}
	} as any;

	return { c, tx };
};

const order = (status: OrderStatus) => ({
	id: 'order-1',
	userId: 'shopper',
	storeId: 'store-a',
	total: 5000,
	status,
	products: [{ productId: 'product-1', quantity: 2 }]
});

describe('updateOrderStatus', () => {
	test("rejects a merchant changing another store's order", async () => {
		const { c, tx } = fakeContext(order(OrderStatus.Pending), {
			authId: 'merchant-b',
			storeId: 'store-b'
		});

		await expect(
			updateOrderStatus(c, {
				orderId: 'order-1',
				status: OrderStatus.Cancelled
			})
		).rejects.toMatchObject({ code: LogicErrorCode.Forbidden });

		expect(tx.order.update).not.toHaveBeenCalled();
		expect(tx.product.update).not.toHaveBeenCalled();
	});

	test("lets the order's own store advance it", async () => {
		const { c, tx } = fakeContext(order(OrderStatus.Pending), {
			authId: 'merchant-a',
			storeId: 'store-a'
		});

		await updateOrderStatus(c, {
			orderId: 'order-1',
			status: OrderStatus.ReadyForPickup
		});

		expect(tx.order.update).toHaveBeenCalled();
	});

	test('lets an admin change any order', async () => {
		const { c, tx } = fakeContext(order(OrderStatus.Pending), {
			authId: 'admin',
			isAdmin: true
		});

		await updateOrderStatus(c, {
			orderId: 'order-1',
			status: OrderStatus.ReadyForPickup
		});

		expect(tx.order.update).toHaveBeenCalled();
	});
});

describe('cancelUnpaidOrder', () => {
	test('cancels an unpaid order and restocks its products', async () => {
		const { c, tx } = fakeContext(order(OrderStatus.PaymentPending), {
			authId: 'shopper'
		});

		const result = await cancelUnpaidOrder(c, 'order-1');

		expect(result.status).toBe(OrderStatus.Cancelled);
		expect(tx.product.update).toHaveBeenCalledWith({
			where: { id: 'product-1' },
			data: { quantity: { increment: 2 } }
		});
	});

	test('refuses once the order has been paid', async () => {
		const { c, tx } = fakeContext(order(OrderStatus.Pending), {
			authId: 'shopper'
		});

		await expect(cancelUnpaidOrder(c, 'order-1')).rejects.toMatchObject({
			code: LogicErrorCode.OrderInvalidStatusTransition
		});

		expect(tx.order.update).not.toHaveBeenCalled();
	});

	test("refuses someone else's order", async () => {
		const { c, tx } = fakeContext(order(OrderStatus.PaymentPending), {
			authId: 'someone-else'
		});

		await expect(cancelUnpaidOrder(c, 'order-1')).rejects.toMatchObject({
			code: LogicErrorCode.Forbidden
		});

		expect(tx.order.update).not.toHaveBeenCalled();
	});
});
