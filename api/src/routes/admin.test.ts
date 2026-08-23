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
			pendingPayouts: 0n,
			ledgerSequence: 12n
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
			paidOut: 500000,
			ledgerSequence: 12
		});
	});
});
