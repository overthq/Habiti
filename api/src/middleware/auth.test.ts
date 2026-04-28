import { describe, expect, test, mock } from 'bun:test';
import { randomUUID } from 'crypto';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import jwt from 'jsonwebtoken';

import { authenticate } from './auth';
import { errorHandler } from './errorHandler';
import { env } from '../config/env';
import { denySession } from '../core/data/sessionRevocation';

import type { AppEnv } from '../types/hono';

/**
 * End-to-end-ish: build a minimal Hono app with the real `authenticate`
 * middleware and an in-memory fake `RedisClient`, then assert that the
 * deny-list bites *before* the protected handler runs.
 *
 * This is the test that actually proves logout takes effect immediately —
 * the rotation tests cover token state, this one covers the access-token
 * pathway.
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

const buildApp = (redis: any) => {
	const app = new Hono<AppEnv>();

	// Stand-in for the real `contextMiddleware` — the unit under test only
	// reads `c.var.redis`, so that's all we need to wire.
	const ctx = createMiddleware<AppEnv>(async (c, next) => {
		c.set('redis', redis);
		c.set('storeId', undefined);
		c.set('isAdmin', false);
		await next();
	});

	app.use('*', ctx);
	app.get('/protected', authenticate, c =>
		c.json({ ok: true, userId: c.var.auth?.id ?? null })
	);
	// Wire the real error handler so HTTPExceptions get JSON-shaped — same
	// envelope production sees, so tests can assert on `body.message`.
	app.onError(errorHandler);
	return app;
};

const signAccessToken = (sessionId: string, userId = randomUUID()) =>
	jwt.sign(
		{ id: userId, name: 'T', email: 't@example.com', role: 'user', sessionId },
		env.JWT_SECRET,
		{ algorithm: 'HS256', expiresIn: '10m' }
	);

const authedRequest = (token: string) =>
	new Request('http://t.local/protected', {
		headers: { authorization: `Bearer ${token}` }
	});

describe('authenticate + session deny-list', () => {
	test('valid token whose session is not denied → 200', async () => {
		const redis = fakeRedis();
		const app = buildApp(redis);
		const sessionId = randomUUID();
		const token = signAccessToken(sessionId);

		const res = await app.request(authedRequest(token));

		expect(res.status).toBe(200);
		expect(redis.get).toHaveBeenCalledWith(`auth:session:revoked:${sessionId}`);
	});

	test('after denySession is called, same token returns 401', async () => {
		const redis = fakeRedis();
		const app = buildApp(redis);
		const sessionId = randomUUID();
		const token = signAccessToken(sessionId);

		// First request: token still valid.
		const ok = await app.request(authedRequest(token));
		expect(ok.status).toBe(200);

		// Server-side revoke (the action a logout endpoint takes).
		await denySession(redis, sessionId);

		// Same access token, now rejected.
		const denied = await app.request(authedRequest(token));
		expect(denied.status).toBe(401);
		const body = (await denied.json()) as { message?: string };
		expect(body.message).toBe('Session revoked');
	});

	test('denying one session does not affect a different session', async () => {
		const redis = fakeRedis();
		const app = buildApp(redis);
		const sess1 = randomUUID();
		const sess2 = randomUUID();
		const token1 = signAccessToken(sess1);
		const token2 = signAccessToken(sess2);

		await denySession(redis, sess1);

		const res1 = await app.request(authedRequest(token1));
		const res2 = await app.request(authedRequest(token2));

		expect(res1.status).toBe(401);
		expect(res2.status).toBe(200);
	});

	test('missing authorization header → 401 (the deny-list never runs)', async () => {
		const redis = fakeRedis();
		const app = buildApp(redis);

		const res = await app.request(new Request('http://t.local/protected'));
		expect(res.status).toBe(401);
		expect(redis.get).not.toHaveBeenCalled();
	});

	test('token without sessionId claim is allowed (legacy compat)', async () => {
		// Some older tokens may have been issued without a sessionId. We
		// only consult the deny-list when one is present — not consulting
		// is preferable to spuriously rejecting.
		const redis = fakeRedis();
		const app = buildApp(redis);
		const tokenNoSession = jwt.sign(
			{ id: randomUUID(), name: 'T', email: 't@x', role: 'user' },
			env.JWT_SECRET,
			{ algorithm: 'HS256', expiresIn: '10m' }
		);

		const res = await app.request(authedRequest(tokenNoSession));
		expect(res.status).toBe(200);
		expect(redis.get).not.toHaveBeenCalled();
	});
});
