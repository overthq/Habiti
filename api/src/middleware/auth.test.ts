import { describe, expect, test } from 'bun:test';
import { randomUUID } from 'crypto';

import { authenticate } from './auth';
import { denySession } from '../core/data/sessions';
import {
	anonymousRequest,
	authedRequest,
	createTestApp,
	signAccessToken,
	signRawToken
} from '../test/helpers';

const buildApp = () => {
	const { app, redis } = createTestApp();

	app.get('/protected', authenticate, c =>
		c.json({ ok: true, userId: c.var.auth?.id ?? null })
	);

	return { app, redis };
};

describe('authenticate + session deny-list', () => {
	test('valid token whose session is not denied → 200', async () => {
		const { app, redis } = buildApp();
		const sessionId = randomUUID();
		const token = await signAccessToken({ sessionId });

		const res = await app.request(authedRequest('/protected', token));

		expect(res.status).toBe(200);
		expect(redis.get).toHaveBeenCalledWith(`auth:session:revoked:${sessionId}`);
	});

	test('after denySession is called, same token returns 401', async () => {
		const { app, redis } = buildApp();
		const sessionId = randomUUID();
		const token = await signAccessToken({ sessionId });

		// First request: token still valid.
		const ok = await app.request(authedRequest('/protected', token));
		expect(ok.status).toBe(200);

		// Server-side revoke (the action a logout endpoint takes).
		await denySession(redis, sessionId);

		// Same access token, now rejected.
		const denied = await app.request(authedRequest('/protected', token));
		expect(denied.status).toBe(401);

		const body = (await denied.json()) as { message?: string };
		expect(body.message).toBe('Session revoked');
	});

	test('denying one session does not affect a different session', async () => {
		const { app, redis } = buildApp();
		const sess1 = randomUUID();
		const sess2 = randomUUID();
		const token1 = await signAccessToken({ sessionId: sess1 });
		const token2 = await signAccessToken({ sessionId: sess2 });

		await denySession(redis, sess1);

		const res1 = await app.request(authedRequest('/protected', token1));
		const res2 = await app.request(authedRequest('/protected', token2));

		expect(res1.status).toBe(401);
		expect(res2.status).toBe(200);
	});

	test('missing authorization header → 401 (the deny-list never runs)', async () => {
		const { app, redis } = buildApp();

		const res = await app.request(anonymousRequest('/protected'));

		expect(res.status).toBe(401);
		expect(redis.get).not.toHaveBeenCalled();
	});

	test('token without sessionId claim is allowed (legacy compat)', async () => {
		const { app, redis } = buildApp();
		const tokenNoSession = await signAccessToken();

		const res = await app.request(authedRequest('/protected', tokenNoSession));

		expect(res.status).toBe(200);
		expect(redis.get).not.toHaveBeenCalled();
	});

	test('refresh token presented as a bearer token → 401', async () => {
		const { app } = buildApp();
		const refreshToken = signRawToken(
			{
				id: randomUUID(),
				userId: randomUUID(),
				sessionId: randomUUID(),
				typ: 'refresh'
			},
			'30d'
		);

		const res = await app.request(authedRequest('/protected', refreshToken));

		expect(res.status).toBe(401);
	});

	test('admin refresh token presented as a bearer token → 401', async () => {
		const { app } = buildApp();
		const adminRefreshToken = signRawToken(
			{
				id: randomUUID(),
				adminId: randomUUID(),
				sessionId: randomUUID(),
				role: 'admin',
				typ: 'refresh'
			},
			'30d'
		);

		const res = await app.request(
			authedRequest('/protected', adminRefreshToken)
		);

		expect(res.status).toBe(401);
	});
});
