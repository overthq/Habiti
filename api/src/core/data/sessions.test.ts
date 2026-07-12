import { describe, expect, test } from 'bun:test';

import { denySession, isSessionDenied, clearSessionDeny } from './sessions';
import { createFakeRedis } from '../../test/helpers';

describe('session revocation deny list', () => {
	test('denySession sets the key with an 11-minute TTL', async () => {
		const r = createFakeRedis();
		await denySession(r, 'sess-abc');

		expect(r.store.get('auth:session:revoked:sess-abc')).toBe('1');
		expect(r.expirations.get('auth:session:revoked:sess-abc')).toBe(11 * 60);
	});

	test('isSessionDenied returns true for denied sessions', async () => {
		const r = createFakeRedis({ 'auth:session:revoked:sess-1': '1' });
		expect(await isSessionDenied(r, 'sess-1')).toBe(true);
	});

	test('isSessionDenied returns false for unknown sessions', async () => {
		const r = createFakeRedis();
		expect(await isSessionDenied(r, 'sess-nope')).toBe(false);
	});

	test('clearSessionDeny removes the key', async () => {
		const r = createFakeRedis({ 'auth:session:revoked:sess-1': '1' });
		await clearSessionDeny(r, 'sess-1');
		expect(r.store.has('auth:session:revoked:sess-1')).toBe(false);
	});
});
