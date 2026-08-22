import { describe, expect, test, mock } from 'bun:test';

import {
	createFakePrisma,
	createTestApp,
	signAccessToken
} from '../test/helpers';

/**
 * `x-market-store-id` used to stand in for a missing `storeId` claim on an
 * authenticated request. Since several store handlers trust `c.var.storeId`
 * without re-checking management, that header let any signed-in user read and
 * write another store's data. Store context for an authenticated caller now
 * comes from the token claim alone.
 */
describe('store context for authenticated callers', () => {
	const attackerToken = () => signAccessToken({ userId: 'attacker' });

	const withHeader = async (path: string, models: Record<string, unknown>) => {
		const { app } = createTestApp({ prisma: createFakePrisma(models) });

		return app.fetch(
			new Request(`http://test.local${path}`, {
				headers: {
					authorization: `Bearer ${await attackerToken()}`,
					'x-market-store-id': 'victim-store'
				}
			})
		);
	};

	test('the header no longer grants another store’s order book', async () => {
		const findMany = mock(async () => [{ id: 'o1', storeId: 'victim-store' }]);

		const res = await withHeader('/stores/current/orders', {
			order: { findMany }
		});

		expect(res.status).toBe(400);
		expect(findMany).not.toHaveBeenCalled();
	});

	test('the header no longer grants another store’s manager list', async () => {
		const findMany = mock(async () => [{ id: 'm1', managerId: 'boss' }]);

		const res = await withHeader('/stores/current/managers', {
			storeManager: { findMany }
		});

		expect(res.status).toBe(400);
		expect(findMany).not.toHaveBeenCalled();
	});

	test('the header no longer grants writes into another store', async () => {
		const create = mock(async () => ({ id: 'c-new' }));
		const { app } = createTestApp({
			prisma: createFakePrisma({ storeProductCategory: { create } })
		});

		const res = await app.fetch(
			new Request('http://test.local/stores/current/categories', {
				method: 'POST',
				headers: {
					authorization: `Bearer ${await attackerToken()}`,
					'x-market-store-id': 'victim-store',
					'content-type': 'application/json'
				},
				body: JSON.stringify({ name: 'Injected' })
			})
		);

		expect(res.status).toBe(400);
		expect(create).not.toHaveBeenCalled();
	});

	test('a verified storeId claim still grants access', async () => {
		const findMany = mock(async () => [{ id: 'o1', storeId: 'my-store' }]);
		const { app } = createTestApp({
			prisma: createFakePrisma({ order: { findMany } })
		});

		const token = await signAccessToken({
			userId: 'manager',
			storeId: 'my-store'
		});

		const res = await app.fetch(
			new Request('http://test.local/stores/current/orders', {
				headers: { authorization: `Bearer ${token}` }
			})
		);

		expect(res.status).toBe(200);
		expect(findMany).toHaveBeenCalled();
	});
});
