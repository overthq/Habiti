import { describe, expect, mock, test } from 'bun:test';

import { removeStoreManager } from './stores';
import { createFakeRedis } from '../../test/helpers';
import * as SessionData from '../data/sessions';

/**
 * A `storeId` claim is a snapshot taken when the access token was minted, and
 * nothing shortens a JWT's 10-minute life. Removing a manager therefore has to
 * deny their sessions, or they keep the store for the rest of that window.
 */
describe('removeStoreManager', () => {
	const setup = () => {
		const redis = createFakeRedis();

		const prisma = {
			store: {
				findUnique: mock(async () => ({
					id: 'store-1',
					name: 'Test Store',
					managers: [{ managerId: 'owner' }, { managerId: 'removed-manager' }]
				}))
			},
			storeManager: { delete: mock(async () => ({})) },
			session: {
				findMany: mock(async () => [{ id: 'session-a' }, { id: 'session-b' }])
			}
		};

		const c = {
			var: {
				auth: { id: 'owner', name: 'Owner' },
				prisma,
				redis,
				services: { analytics: { track: mock(() => {}) } }
			}
		} as any;

		return { c, redis, prisma };
	};

	test('denies every session held by the removed manager', async () => {
		const { c, redis, prisma } = setup();

		await removeStoreManager(c, {
			storeId: 'store-1',
			userId: 'removed-manager'
		});

		expect(prisma.storeManager.delete).toHaveBeenCalled();

		// Only the removed manager's sessions -- not the caller's.
		expect(prisma.session.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { userId: 'removed-manager', revoked: false }
			})
		);

		expect(await SessionData.isSessionDenied(redis, 'session-a')).toBe(true);
		expect(await SessionData.isSessionDenied(redis, 'session-b')).toBe(true);
	});

	test('denies nothing when the removal is refused', async () => {
		const { c, redis, prisma } = setup();

		prisma.store.findUnique = mock(async () => ({
			id: 'store-1',
			name: 'Test Store',
			managers: [{ managerId: 'owner' }]
		})) as any;

		expect(
			removeStoreManager(c, { storeId: 'store-1', userId: 'owner' })
		).rejects.toThrow();

		expect(await SessionData.isSessionDenied(redis, 'session-a')).toBe(false);
	});
});
