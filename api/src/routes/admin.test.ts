import { describe, expect, test, mock } from 'bun:test';

import {
	authedRequest,
	createFakePrisma,
	createTestApp,
	signAccessToken
} from '../test/helpers';
import { AccessTokenRole } from '../core/logic/auth';

/**
 * The ledger migration moved every money column to `BigInt`, and routes that
 * return raw rows (`include: { store: true }`) hand those straight to
 * `c.json()`. Without a serializer that is a 500, not a wrong number, so it is
 * worth pinning: the wire contract stays numeric kobo.
 */
describe('GET /admin/orders', () => {
	const adminToken = () => signAccessToken({ role: AccessTokenRole.Admin });

	const orderRow = {
		id: 'order-1',
		total: 250000,
		storeId: 'store-1',
		store: {
			id: 'store-1',
			name: 'Test Store',
			realizedRevenue: 1500000n,
			unrealizedRevenue: 0n,
			paidOut: 500000n,
			pendingPayouts: 0n
		},
		user: { id: 'user-1', name: 'Test User' }
	};

	test('serializes BigInt money columns on the included store', async () => {
		const { app } = createTestApp({
			prisma: createFakePrisma({
				order: { findMany: mock(async () => [orderRow]) }
			})
		});

		const res = await app.fetch(
			authedRequest('/admin/orders', await adminToken())
		);

		expect(res.status).toBe(200);

		const body = await res.json();

		expect(body.orders[0].store).toMatchObject({
			realizedRevenue: 1500000,
			paidOut: 500000
		});
	});
});

describe('GET /admin/stores/:id/products', () => {
	const adminToken = () => signAccessToken({ role: AccessTokenRole.Admin });

	const productRow = {
		id: 'product-1',
		name: 'Test Product',
		unitPrice: 250000,
		quantity: 4,
		storeId: 'store-1',
		images: []
	};

	test('returns the products belonging to the store', async () => {
		const products = mock(async () => [productRow]);
		const findUnique = mock(() => ({ products }));

		const { app } = createTestApp({
			prisma: createFakePrisma({ store: { findUnique } })
		});

		const res = await app.fetch(
			authedRequest('/admin/stores/store-1/products', await adminToken())
		);

		expect(res.status).toBe(200);

		const body = await res.json();

		expect(body.products).toEqual([productRow]);
		expect(findUnique).toHaveBeenCalledWith({ where: { id: 'store-1' } });
	});
});

describe('DELETE /admin/stores/:id', () => {
	const adminToken = () => signAccessToken({ role: AccessTokenRole.Admin });

	const storeRow = { id: 'store-1', name: 'Test Store' };

	const deleteRequest = async (path: string, body?: unknown) =>
		authedRequest(path, await adminToken(), {
			method: 'DELETE',
			...(body ? { body: JSON.stringify(body) } : {})
		});

	test('deletes a store with no ledger history', async () => {
		const del = mock(async () => storeRow);

		const { app } = createTestApp({
			prisma: createFakePrisma({
				store: { findUnique: mock(async () => storeRow), delete: del },
				ledgerAccount: { count: mock(async () => 0) }
			})
		});

		const res = await app.fetch(await deleteRequest('/admin/stores/store-1'));

		expect(res.status).toBe(200);
		expect(del).toHaveBeenCalledWith({ where: { id: 'store-1' } });
	});

	test('refuses to delete a store that has ledger history', async () => {
		const del = mock(async () => storeRow);

		const { app } = createTestApp({
			prisma: createFakePrisma({
				store: { findUnique: mock(async () => storeRow), delete: del },
				ledgerAccount: { count: mock(async () => 2) }
			})
		});

		const res = await app.fetch(await deleteRequest('/admin/stores/store-1'));

		expect(res.status).toBeGreaterThanOrEqual(400);
		expect(del).not.toHaveBeenCalled();
	});

	test('404s for a store that does not exist', async () => {
		const { app } = createTestApp({
			prisma: createFakePrisma({
				store: { findUnique: mock(async () => null) }
			})
		});

		const res = await app.fetch(await deleteRequest('/admin/stores/nope'));

		expect(res.status).toBe(404);
	});
});

/**
 * This router matches in registration order, so a `/:id` route registered
 * before `/bulk` swallows it — the param handler then runs with `id: 'bulk'`.
 * Both resources have a DELETE on each path, so both need pinning.
 */
describe('GET /admin/users', () => {
	const adminToken = () => signAccessToken({ role: AccessTokenRole.Admin });

	const listUsers = async (query: string) => {
		const findMany = mock(async () => []);
		const { app } = createTestApp({
			prisma: createFakePrisma({ user: { findMany } })
		});

		const res = await app.fetch(
			authedRequest(`/admin/users${query}`, await adminToken())
		);
		expect(res.status).toBe(200);

		return (findMany.mock.calls[0] as any[])[0].where;
	};

	test('filters by isAnonymous', async () => {
		expect(await listUsers('?isAnonymous=false')).toEqual({
			isAnonymous: false
		});
		expect(await listUsers('?isAnonymous=true')).toEqual({
			isAnonymous: true
		});
	});

	test('does not filter on isAnonymous when omitted', async () => {
		expect(await listUsers('')).toEqual({});
	});
});

describe('GET /admin/stores', () => {
	const adminToken = () => signAccessToken({ role: AccessTokenRole.Admin });

	const listStores = async (query: string) => {
		const findMany = mock(async () => []);
		const { app } = createTestApp({
			prisma: createFakePrisma({ store: { findMany } })
		});

		const res = await app.fetch(
			authedRequest(`/admin/stores${query}`, await adminToken())
		);
		expect(res.status).toBe(200);

		return (findMany.mock.calls[0] as any[])[0].where;
	};

	test('filters by unlisted', async () => {
		expect(await listStores('?unlisted=false')).toEqual({ unlisted: false });
		expect(await listStores('?unlisted=true')).toEqual({ unlisted: true });
	});

	test('combines unlisted with search', async () => {
		expect(await listStores('?unlisted=false&search=shoe')).toEqual({
			name: { contains: 'shoe', mode: 'insensitive' },
			unlisted: false
		});
	});

	test('does not filter on unlisted when omitted', async () => {
		expect(await listStores('')).toEqual({});
	});
});

describe('/admin/stores/:id/payout-accounts', () => {
	const accountRow = {
		id: 'account-1',
		storeId: 'store-1',
		accountNumber: '0123456789',
		accountName: 'Ada Obi',
		bankCode: '058',
		bankName: 'Guaranty Trust Bank',
		recipientRef: 'RCP_1',
		label: null,
		isDefault: true,
		status: 'Active',
		createdAt: new Date()
	};

	test('lists the active accounts of the store in the path', async () => {
		const findMany = mock(async () => [accountRow]);
		const { app } = createTestApp({
			prisma: createFakePrisma({ storePayoutAccount: { findMany } })
		});

		const res = await app.fetch(
			authedRequest(
				'/admin/stores/store-1/payout-accounts',
				await signAccessToken({ role: AccessTokenRole.Admin })
			)
		);

		expect(res.status).toBe(200);

		const body = await res.json();
		expect(body.payoutAccounts).toHaveLength(1);
		// The provider's recipient code is internal and never leaves the API.
		expect(body.payoutAccounts[0].recipientRef).toBeUndefined();
		expect((findMany.mock.calls[0] as any[])[0].where).toMatchObject({
			storeId: 'store-1',
			status: 'Active'
		});
	});

	test('is closed to non-admin tokens', async () => {
		const findMany = mock(async () => [accountRow]);
		const { app } = createTestApp({
			prisma: createFakePrisma({ storePayoutAccount: { findMany } })
		});

		const res = await app.fetch(
			authedRequest(
				'/admin/stores/store-1/payout-accounts',
				await signAccessToken({ storeId: 'store-1' }),
				{
					method: 'POST',
					body: JSON.stringify({
						bankAccountNumber: '0123456789',
						bankCode: '058'
					})
				}
			)
		);

		expect(res.status).toBe(403);
		expect(findMany).not.toHaveBeenCalled();
	});
});

describe('bulk routes are not shadowed by the :id routes', () => {
	const adminToken = () => signAccessToken({ role: AccessTokenRole.Admin });

	const ids = [
		'3f8b1f1e-1c9e-4b6b-9c1e-2f3a4b5c6d7e',
		'6a1c2d3e-4f5b-4c7d-8e9f-0a1b2c3d4e5f'
	];

	const bulkDeleteRequest = async (path: string) =>
		authedRequest(path, await adminToken(), {
			method: 'DELETE',
			body: JSON.stringify({ ids })
		});

	test('DELETE /admin/stores/bulk reaches the bulk handler', async () => {
		const deleteMany = mock(async () => ({ count: 2 }));
		const findUnique = mock(async () => null);

		const { app } = createTestApp({
			prisma: createFakePrisma({
				$transaction: mock(async (fn: any) => fn({ store: { deleteMany } })),
				store: { deleteMany, findUnique }
			})
		});

		const res = await app.fetch(await bulkDeleteRequest('/admin/stores/bulk'));

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ count: 2 });
		expect(deleteMany).toHaveBeenCalledWith({ where: { id: { in: ids } } });
		expect(findUnique).not.toHaveBeenCalled();
	});

	test('DELETE /admin/products/bulk reaches the bulk handler', async () => {
		const deleteMany = mock(async () => ({ count: 2 }));
		const findUnique = mock(async () => null);

		const { app } = createTestApp({
			prisma: createFakePrisma({
				$transaction: mock(async (fn: any) => fn({ product: { deleteMany } })),
				product: { deleteMany, findUnique }
			})
		});

		const res = await app.fetch(
			await bulkDeleteRequest('/admin/products/bulk')
		);

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ count: 2 });
		expect(findUnique).not.toHaveBeenCalled();
	});
});
