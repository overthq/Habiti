import { describe, expect, test, mock } from 'bun:test';

import {
	denySession,
	isSessionDenied,
	clearSessionDeny
} from './sessionRevocation';

/**
 * Pure interaction tests with a fake Bun `RedisClient`: assert the right
 * key shape, that `set` is paired with `expire`, and that `isSessionDenied`
 * returns true iff the key is present.
 */

const fakeRedis = (initial: Record<string, string> = {}) => {
	const store = new Map<string, string>(Object.entries(initial));
	const expirations = new Map<string, number>();
	return {
		store,
		expirations,
		set: mock(async (k: string, v: string) => {
			store.set(k, v);
			return 'OK' as const;
		}),
		expire: mock(async (k: string, sec: number) => {
			expirations.set(k, sec);
			return 1;
		}),
		get: mock(async (k: string) => store.get(k) ?? null),
		del: mock(async (k: string) => {
			const had = store.delete(k);
			return had ? 1 : 0;
		})
	} as any;
};

describe('sessionRevocation', () => {
	test('denySession sets the key with an 11-minute TTL', async () => {
		const r = fakeRedis();
		await denySession(r, 'sess-abc');

		expect(r.store.get('auth:session:revoked:sess-abc')).toBe('1');
		expect(r.expirations.get('auth:session:revoked:sess-abc')).toBe(11 * 60);
	});

	test('isSessionDenied returns true for denied sessions', async () => {
		const r = fakeRedis({ 'auth:session:revoked:sess-1': '1' });
		expect(await isSessionDenied(r, 'sess-1')).toBe(true);
	});

	test('isSessionDenied returns false for unknown sessions', async () => {
		const r = fakeRedis();
		expect(await isSessionDenied(r, 'sess-nope')).toBe(false);
	});

	test('clearSessionDeny removes the key', async () => {
		const r = fakeRedis({ 'auth:session:revoked:sess-1': '1' });
		await clearSessionDeny(r, 'sess-1');
		expect(r.store.has('auth:session:revoked:sess-1')).toBe(false);
	});
});
