import { describe, expect, test, mock } from 'bun:test';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { createFakePrisma, createTestApp } from '../test/helpers';

type AccessClaims = {
	id: string;
	role: string;
	typ: string;
	sessionId?: string;
	anonymous?: boolean;
};

const USER_ID = 'user-anon-1';
const SESSION_ID = 'session-1';

const anonymousPrisma = () => {
	const user = {
		create: mock(async ({ data }: any) => ({
			id: USER_ID,
			name: data.name,
			email: null,
			isAnonymous: data.isAnonymous
		}))
	};

	const session = {
		create: mock(async ({ data }: any) => ({ id: SESSION_ID, ...data }))
	};

	const refreshToken = {
		create: mock(async ({ data }: any) => data)
	};

	const prisma = createFakePrisma({ user, session, refreshToken });

	return { prisma, user, session, refreshToken };
};

const post = (path: string, init: RequestInit = {}) =>
	new Request(`http://test.local${path}`, { method: 'POST', ...init });

describe('POST /auth/anonymous', () => {
	test('creates a guest user and returns a token pair', async () => {
		const { prisma, user, session } = anonymousPrisma();
		const { app } = createTestApp({ prisma });

		const res = await app.request(post('/auth/anonymous'));

		expect(res.status).toBe(201);

		const body = (await res.json()) as {
			accessToken: string;
			refreshToken: string;
			userId: string;
		};

		expect(body.userId).toBe(USER_ID);

		expect(user.create).toHaveBeenCalledWith({
			data: { name: 'Guest', isAnonymous: true }
		});
		expect(session.create).toHaveBeenCalledTimes(1);
	});

	test('the access token carries the anonymous claim and its session', async () => {
		const { prisma } = anonymousPrisma();
		const { app } = createTestApp({ prisma });

		const res = await app.request(post('/auth/anonymous'));
		const { accessToken } = (await res.json()) as { accessToken: string };

		// Verify (not just decode) — the app must accept this token back.
		const claims = jwt.verify(accessToken, env.JWT_SECRET) as AccessClaims;

		expect(claims.id).toBe(USER_ID);
		expect(claims.role).toBe('user');
		expect(claims.typ).toBe('access');
		expect(claims.sessionId).toBe(SESSION_ID);
		expect(claims.anonymous).toBe(true);
	});

	test('the refresh token is stored hashed, never in the clear', async () => {
		const { prisma, refreshToken } = anonymousPrisma();
		const { app } = createTestApp({ prisma });

		const res = await app.request(post('/auth/anonymous'));
		const body = (await res.json()) as { refreshToken: string };

		expect(refreshToken.create).toHaveBeenCalledTimes(1);

		const stored = refreshToken.create.mock.calls[0]![0].data;

		expect(stored.hashedToken).not.toBe(body.refreshToken);
		expect(stored.hashedToken).toMatch(/^[a-f0-9]{64}$/);
		expect(stored.sessionId).toBe(SESSION_ID);
		expect(stored.userId).toBe(USER_ID);
	});

	test('the refresh token is also set as an httpOnly cookie', async () => {
		const { prisma } = anonymousPrisma();
		const { app } = createTestApp({ prisma });

		const res = await app.request(post('/auth/anonymous'));
		const cookie = res.headers.get('set-cookie');

		expect(cookie).toContain('refreshToken=');
		expect(cookie).toContain('HttpOnly');
		expect(cookie).toContain('SameSite=Strict');
	});

	test('session metadata from the request is recorded', async () => {
		const { prisma, session } = anonymousPrisma();
		const { app } = createTestApp({ prisma });

		await app.request(
			post('/auth/anonymous', {
				headers: {
					'user-agent': 'Habiti/1.0 (iPhone)',
					'x-forwarded-for': '203.0.113.7, 10.0.0.1'
				}
			})
		);

		expect(session.create).toHaveBeenCalledWith({
			data: {
				userId: USER_ID,
				userAgent: 'Habiti/1.0 (iPhone)',
				ipAddress: '203.0.113.7, 10.0.0.1'
			}
		});
	});

	test('the IP rate limiter caps guest creation', async () => {
		// The route is capped at 20/min per IP — without it, one client could
		// mint unbounded guest users.
		const { prisma, user } = anonymousPrisma();
		const { app } = createTestApp({ prisma });

		const request = () =>
			app.request(
				post('/auth/anonymous', {
					headers: { 'x-forwarded-for': '198.51.100.4' }
				})
			);

		const allowed = [];
		for (let i = 0; i < 20; i++) allowed.push(await request());

		expect(allowed.every(res => res.status === 201)).toBe(true);

		const blocked = await request();

		expect(blocked.status).toBe(429);
		// The 21st request never reached the handler.
		expect(user.create).toHaveBeenCalledTimes(20);
	});

	test('a different IP has its own budget', async () => {
		const { prisma } = anonymousPrisma();
		const { app } = createTestApp({ prisma });

		for (let i = 0; i < 20; i++) {
			await app.request(
				post('/auth/anonymous', {
					headers: { 'x-forwarded-for': '198.51.100.4' }
				})
			);
		}

		const other = await app.request(
			post('/auth/anonymous', {
				headers: { 'x-forwarded-for': '198.51.100.9' }
			})
		);

		expect(other.status).toBe(201);
	});
});
