import { beforeEach, describe, expect, mock, test } from 'bun:test';

import { OrderStatus } from '../../generated/prisma/client';
import { createFakeLedgerDb } from '../../test/fakeLedger';
import { LedgerReason } from '../../generated/prisma/client';
import { LogicErrorCode } from './errors';

const createBankTransferCharge = mock(async (_options: any) => ({
	status: true,
	message: 'Charge attempted',
	data: {}
}));

const verifyTransaction = mock(async (_reference: string) => ({
	status: true,
	message: 'Verification successful',
	data: {
		status: 'pending',
		reference: 'bt.testref',
		amount: 0,
		currency: 'NGN'
	}
}));

mock.module('../payments', () => ({
	createBankTransferCharge,
	verifyTransaction
}));

const { initiateBankTransfer, syncBankTransfer } =
	await import('./bankTransfers');
const { handleChargeSuccess, handlePaystackWebhookEvent } =
	await import('./payments');

const chargeResponse = (amount = 111_500) => ({
	status: true,
	message: 'Charge attempted',
	data: {
		reference: 'bt.testref',
		status: 'pending_bank_transfer',
		display_text: 'Please make a transfer to the account specified',
		account_name: 'TEST-MANAGED-ACCOUNT',
		account_number: '1260257501',
		bank: { slug: 'test-bank', name: 'Test Bank', id: 24 },
		account_expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
		amount
	}
});

interface TransferRow {
	[key: string]: any;
}

const matches = (row: TransferRow, where: TransferRow) =>
	Object.entries(where).every(([key, value]) => {
		if (value && typeof value === 'object' && Array.isArray(value.in)) {
			return value.in.includes(row[key]);
		}

		return row[key] === value;
	});

const bankTransferTable = (initial: TransferRow[] = []) => {
	const rows = initial.map(row => ({ ...row }));
	let sequence = rows.length;

	const api = {
		findUnique: mock(
			async ({ where }: any) => rows.find(row => matches(row, where)) ?? null
		),
		findFirst: mock(async ({ where, orderBy }: any) => {
			const found = rows.filter(row => matches(row, where));

			if (orderBy?.createdAt === 'desc') {
				found.sort((a, b) => b.createdAt - a.createdAt);
			}

			return found[0] ?? null;
		}),
		create: mock(async ({ data }: any) => {
			const row = {
				id: `bt-row-${++sequence}`,
				createdAt: new Date(),
				updatedAt: new Date(),
				...data
			};
			rows.push(row);
			return row;
		}),
		updateMany: mock(async ({ where, data }: any) => {
			const hits = rows.filter(row => matches(row, where));
			hits.forEach(row => Object.assign(row, data));
			return { count: hits.length };
		})
	};

	return { rows, api };
};

const orderRecord = (overrides: TransferRow = {}) => ({
	id: 'order-1',
	userId: 'user-1',
	storeId: 'store-1',
	status: OrderStatus.PaymentPending,
	total: 100_000,
	transactionFee: 1_500,
	serviceFee: 10_000,
	user: { name: 'Ada' },
	...overrides
});

const contextFor = (
	table: ReturnType<typeof bankTransferTable>,
	order = orderRecord()
) =>
	({
		var: {
			prisma: {
				order: { findUnique: mock(async () => order) },
				bankTransferPayment: table.api
			},
			auth: {
				id: 'user-1',
				name: 'Ada',
				email: 'ada@example.com',
				role: 'user'
			},
			logger: {
				warn: mock(() => {}),
				error: mock(() => {}),
				info: mock(() => {})
			},
			tracer: { startSpan: async (_name: string, fn: any) => fn({}) },
			services: {
				analytics: { track: mock(() => {}) },
				notifications: { queueNotification: mock(() => {}) }
			}
		}
	}) as any;

beforeEach(() => {
	createBankTransferCharge.mockReset();
	verifyTransaction.mockReset();
	createBankTransferCharge.mockImplementation(async () => chargeResponse());
	verifyTransaction.mockImplementation(async () => ({
		status: true,
		message: 'Verification successful',
		data: {
			status: 'pending',
			reference: 'bt.testref',
			amount: 111_500,
			currency: 'NGN',
			metadata: { orderId: 'order-1', bankTransfer: true }
		}
	}));
});

describe('initiateBankTransfer', () => {
	test('stores the account Paystack returns and the amount the shopper must send', async () => {
		const table = bankTransferTable();
		const c = contextFor(table);

		const transfer = await initiateBankTransfer(c, 'order-1');

		expect(transfer).toMatchObject({
			accountName: 'TEST-MANAGED-ACCOUNT',
			accountNumber: '1260257501',
			bankName: 'Test Bank',
			amount: 111_500,
			currency: 'NGN',
			reference: 'bt.testref',
			status: 'Pending'
		});
		expect(table.rows).toHaveLength(1);
		expect(table.rows[0]).toMatchObject({
			orderId: 'order-1',
			reference: 'bt.testref',
			amount: 111_500,
			accountNumber: '1260257501'
		});
		expect(createBankTransferCharge.mock.calls[0]?.[0]).toMatchObject({
			email: 'ada@example.com',
			amount: '111500',
			metadata: { orderId: 'order-1', bankTransfer: true }
		});
		expect(createBankTransferCharge.mock.calls[0]?.[0].reference).toStartWith(
			'bt.'
		);

		const expiresAt = new Date(
			createBankTransferCharge.mock.calls[0]?.[0].accountExpiresAt
		).getTime();
		expect(expiresAt).toBeGreaterThan(Date.now() + 29 * 60 * 1000);
		expect(expiresAt).toBeLessThan(Date.now() + 31 * 60 * 1000);
	});

	test('reuses an open transfer instead of creating another account', async () => {
		const table = bankTransferTable();
		const c = contextFor(table);

		const first = await initiateBankTransfer(c, 'order-1');
		const second = await initiateBankTransfer(c, 'order-1');

		expect(second.reference).toBe(first.reference);
		expect(createBankTransferCharge).toHaveBeenCalledTimes(1);
		expect(table.rows).toHaveLength(1);
	});

	test('refuses a Paystack response that has no account to show', async () => {
		createBankTransferCharge.mockImplementation(async () => ({
			status: true,
			message: 'Charge attempted',
			data: { status: 'pending_bank_transfer', reference: 'bt.testref' }
		}));
		const table = bankTransferTable();

		await expect(
			initiateBankTransfer(contextFor(table), 'order-1')
		).rejects.toMatchObject({ code: LogicErrorCode.PaymentFailed });

		expect(table.rows).toHaveLength(0);
	});

	test('does not start a transfer for an order that is no longer payable', async () => {
		const table = bankTransferTable();
		const c = contextFor(table, orderRecord({ status: OrderStatus.Pending }));

		await expect(initiateBankTransfer(c, 'order-1')).rejects.toMatchObject({
			code: LogicErrorCode.OrderNotPayable
		});

		expect(createBankTransferCharge).not.toHaveBeenCalled();
	});
});

const paidOrderContext = (table: ReturnType<typeof bankTransferTable>) => {
	const state = { status: OrderStatus.PaymentPending };
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
				userId: 'user-1',
				storeId: 'store-1',
				total: 100_000,
				transactionFee: 0,
				serviceFee: 0,
				status: state.status,
				user: { name: 'Ada' }
			})),
			update: mock(async ({ data }: any) => {
				state.status = data.status;
			})
		},
		bankTransferPayment: table.api
	});
	Object.assign(client.storeManager, {
		findMany: mock(async () => [])
	});

	const c = {
		var: {
			prisma: client,
			auth: {
				id: 'user-1',
				name: 'Ada',
				email: 'ada@example.com',
				role: 'user'
			},
			logger: {
				warn: mock(() => {}),
				error: mock(() => {}),
				info: mock(() => {})
			},
			tracer: { startSpan: async (_name: string, fn: any) => fn({}) },
			services: {
				analytics: { track: mock(() => {}) },
				notifications: { queueNotification: mock(() => {}) }
			}
		}
	} as any;

	const payments = () =>
		tables.ledgerTransactions.filter(
			row => row.reason === LedgerReason.OrderPaid
		);

	return { c, table, payments, state };
};

const pendingRow = (overrides: TransferRow = {}): TransferRow => ({
	id: 'bt-row-1',
	orderId: 'order-1',
	reference: 'bt.testref',
	amount: 100_000,
	currency: 'NGN',
	accountName: 'TEST-MANAGED-ACCOUNT',
	accountNumber: '1260257501',
	bankName: 'Test Bank',
	bankSlug: 'test-bank',
	expiresAt: new Date(Date.now() + 30 * 60 * 1000),
	status: 'Pending',
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides
});

const successPayload = (amount = 100_000) => ({
	reference: 'bt.testref',
	amount,
	currency: 'NGN',
	metadata: { orderId: 'order-1', bankTransfer: true },
	customer: { email: 'ada@example.com' },
	authorization: { card_type: 'transfer' }
});

describe('bank transfer completion', () => {
	test('a matching charge.success pays the order once', async () => {
		const table = bankTransferTable([pendingRow()]);
		const { c, payments } = paidOrderContext(table);

		await handleChargeSuccess(c, successPayload() as any);
		await handleChargeSuccess(c, successPayload() as any);

		expect(table.rows[0]?.status).toBe('Succeeded');
		expect(payments()).toHaveLength(1);
	});

	test('a different amount does not pay the order', async () => {
		const table = bankTransferTable([pendingRow()]);
		const { c, payments, state } = paidOrderContext(table);

		await handleChargeSuccess(c, successPayload(50_000) as any);

		expect(table.rows[0]?.status).toBe('Rejected');
		expect(payments()).toHaveLength(0);
		expect(state.status).toBe(OrderStatus.PaymentPending);
	});

	test('a tagged charge with no stored transfer does not pay the order', async () => {
		const table = bankTransferTable();
		const { c, payments } = paidOrderContext(table);

		await handleChargeSuccess(c, successPayload() as any);

		expect(payments()).toHaveLength(0);
	});

	test('bank.transfer.rejected leaves the order unpaid', async () => {
		const table = bankTransferTable([pendingRow()]);
		const { c, payments } = paidOrderContext(table);

		await handlePaystackWebhookEvent(c, 'bank.transfer.rejected', {
			reference: 'bt.testref',
			amount: 50_000
		});

		expect(table.rows[0]?.status).toBe('Rejected');
		expect(payments()).toHaveLength(0);
	});

	test('a matching charge after the local expiry still pays', async () => {
		const table = bankTransferTable([
			pendingRow({
				status: 'Expired',
				expiresAt: new Date(Date.now() - 60_000)
			})
		]);
		const { c, payments } = paidOrderContext(table);

		await handleChargeSuccess(c, successPayload() as any);

		expect(table.rows[0]?.status).toBe('Succeeded');
		expect(payments()).toHaveLength(1);
	});

	test('polling a successful transfer pays when the amount matches', async () => {
		const table = bankTransferTable([pendingRow()]);
		const { c, payments } = paidOrderContext(table);
		verifyTransaction.mockImplementation(async () => ({
			status: true,
			message: 'Verification successful',
			data: {
				status: 'success',
				reference: 'bt.testref',
				amount: 100_000,
				currency: 'NGN',
				metadata: { orderId: 'order-1', bankTransfer: true }
			}
		}));

		const transfer = await syncBankTransfer(c, 'order-1');

		expect(transfer.status).toBe('Succeeded');
		expect(payments()).toHaveLength(1);
	});

	test('polling past expiry without a payment expires the account', async () => {
		const table = bankTransferTable([
			pendingRow({ expiresAt: new Date(Date.now() - 60_000) })
		]);
		const { c, payments } = paidOrderContext(table);

		const transfer = await syncBankTransfer(c, 'order-1');

		expect(transfer.status).toBe('Expired');
		expect(payments()).toHaveLength(0);
	});

	test('polling a successful transfer with the wrong amount rejects it', async () => {
		const table = bankTransferTable([pendingRow()]);
		const { c, payments } = paidOrderContext(table);
		verifyTransaction.mockImplementation(async () => ({
			status: true,
			message: 'Verification successful',
			data: {
				status: 'success',
				reference: 'bt.testref',
				amount: 1,
				currency: 'NGN',
				metadata: { orderId: 'order-1', bankTransfer: true }
			}
		}));

		const transfer = await syncBankTransfer(c, 'order-1');

		expect(transfer.status).toBe('Rejected');
		expect(payments()).toHaveLength(0);
	});
});
