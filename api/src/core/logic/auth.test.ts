import { describe, expect, test, mock } from 'bun:test';
import { createHash, randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

import { rotateRefreshToken } from './auth';
import { LogicError, LogicErrorCode } from './errors';
import { env } from '../../config/env';

/**
 * Behaviour tests for `rotateRefreshToken`. We give it a fake Prisma whose
 * `$transaction` proxies straight to the inner closure with a fake `tx`
 * client backed by tiny in-memory tables — exercising the contract
 * (lookups, writes, reuse-detection cascade) without touching Postgres.
 *
 * Concurrency is left to integration tests: modelling serializable-isolation
 * race conditions in a unit test is brittle and tests the mock more than
 * the code.
 */

interface RefreshRow {
	id: string;
	userId: string;
	hashedToken: string;
	expiresAt: Date;
	sessionId: string;
	revoked: boolean;
	user: { id: string; name: string; email: string };
}

interface SessionRow {
	id: string;
	userId: string;
	revoked: boolean;
	lastActiveAt: Date;
}

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

const makeJwt = (id: string, userId: string, sessionId: string) =>
	jwt.sign({ id, userId, sessionId }, env.JWT_SECRET, { expiresIn: '30d' });

const fakeContext = (tokens: RefreshRow[], sessions: SessionRow[]) => {
	const tx = {
		refreshToken: {
			findUnique: mock(
				async ({ where: { id } }: any) => tokens.find(t => t.id === id) ?? null
			),
			update: mock(async ({ where: { id }, data }: any) => {
				const row = tokens.find(t => t.id === id);
				if (!row) throw new Error(`refreshToken not found: ${id}`);
				Object.assign(row, data);
				return row;
			}),
			updateMany: mock(async ({ where, data }: any) => {
				let count = 0;
				for (const t of tokens) {
					if (where.sessionId && t.sessionId !== where.sessionId) continue;
					Object.assign(t, data);
					count++;
				}
				return { count };
			}),
			create: mock(async ({ data }: any) => {
				const row: RefreshRow = {
					...data,
					revoked: false,
					user: tokens[0]!.user
				};
				tokens.push(row);
				return row;
			})
		},
		session: {
			findUnique: mock(
				async ({ where: { id } }: any) =>
					sessions.find(s => s.id === id) ?? null
			),
			update: mock(async ({ where: { id }, data }: any) => {
				const row = sessions.find(s => s.id === id);
				if (!row) throw new Error(`session not found: ${id}`);
				Object.assign(row, data);
				return row;
			})
		}
	};

	const redis = {
		set: mock(async () => {}),
		expire: mock(async () => {})
	};

	return {
		var: {
			prisma: {
				$transaction: async (fn: any, _opts?: any) => fn(tx),
				storeManager: {
					findUnique: mock(async () => null)
				}
			},
			redis
		},
		_state: { tokens, sessions, tx, redis }
	} as any;
};

const aliveToken = (
	overrides: Partial<RefreshRow> = {}
): { row: RefreshRow; jwt: string } => {
	const id = overrides.id ?? randomUUID();
	const sessionId = overrides.sessionId ?? randomUUID();
	const userId = overrides.userId ?? randomUUID();
	const token = makeJwt(id, userId, sessionId);
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 30);
	const row: RefreshRow = {
		id,
		userId,
		hashedToken: sha256(token),
		expiresAt,
		sessionId,
		revoked: false,
		user: { id: userId, name: 'Test User', email: 'test@example.com' },
		...overrides
	};
	return { row, jwt: token };
};

const aliveSession = (overrides: Partial<SessionRow> = {}): SessionRow => ({
	id: overrides.id ?? randomUUID(),
	userId: overrides.userId ?? randomUUID(),
	revoked: false,
	lastActiveAt: new Date(),
	...overrides
});

describe('rotateRefreshToken', () => {
	test('happy path — returns new pair and revokes the prior token', async () => {
		const { row, jwt: token } = aliveToken();
		const session = aliveSession({ id: row.sessionId, userId: row.userId });
		const c = fakeContext([row], [session]);

		const result = await rotateRefreshToken(c, token);

		expect(result.accessToken).toBeTypeOf('string');
		expect(result.refreshToken).toBeTypeOf('string');
		expect(result.refreshToken).not.toBe(token);

		// Original token is now revoked, and a new (un-revoked) row exists.
		const original = c._state.tokens.find((t: RefreshRow) => t.id === row.id);
		expect(original?.revoked).toBe(true);

		const fresh = c._state.tokens.filter((t: RefreshRow) => !t.revoked);
		expect(fresh).toHaveLength(1);
		expect(fresh[0].sessionId).toBe(row.sessionId);
	});

	test('reuse detection — revoked token kills the entire session', async () => {
		// Two live tokens under the same session. We present the *first* one
		// after it's already been revoked (e.g. an attacker stole the
		// previously-rotated token). Per RFC 6819 the entire session is
		// terminated.
		const { row: row1, jwt: token1 } = aliveToken();
		const { row: row2 } = aliveToken({
			sessionId: row1.sessionId,
			userId: row1.userId
		});
		row1.revoked = true; // already rotated previously
		const session = aliveSession({ id: row1.sessionId, userId: row1.userId });
		const c = fakeContext([row1, row2], [session]);

		await expect(rotateRefreshToken(c, token1)).rejects.toBeInstanceOf(
			LogicError
		);

		try {
			await rotateRefreshToken(c, token1);
		} catch (err) {
			expect((err as LogicError).code).toBe(LogicErrorCode.TokenReused);
		}

		// Both the session AND every refresh token under it are revoked.
		expect(c._state.sessions[0].revoked).toBe(true);
		expect(c._state.tokens.every((t: RefreshRow) => t.revoked)).toBe(true);
	});

	test('reuse detection — revoked session blocks all rotations', async () => {
		const { row, jwt: token } = aliveToken();
		const session = aliveSession({
			id: row.sessionId,
			userId: row.userId,
			revoked: true
		});
		const c = fakeContext([row], [session]);

		try {
			await rotateRefreshToken(c, token);
			throw new Error('Expected rotation to throw');
		} catch (err) {
			expect(err).toBeInstanceOf(LogicError);
			expect((err as LogicError).code).toBe(LogicErrorCode.TokenReused);
		}

		// Token wasn't issued — original is still un-revoked because we
		// short-circuit before the revoke step. (Defense in depth: the
		// session-revoked check fires first.)
		expect(c._state.tokens[0].revoked).toBe(false);
	});

	test('expired DB row throws TokenExpired even when JWT is still valid', async () => {
		// Construct a row whose expiresAt is in the past, then sign a fresh
		// JWT for it (so jwt.verify succeeds). The DB-side expiry check is
		// the second line of defense.
		const past = new Date();
		past.setDate(past.getDate() - 1);
		const { row, jwt: token } = aliveToken({ expiresAt: past });
		const session = aliveSession({ id: row.sessionId, userId: row.userId });
		const c = fakeContext([row], [session]);

		try {
			await rotateRefreshToken(c, token);
			throw new Error('Expected rotation to throw');
		} catch (err) {
			expect(err).toBeInstanceOf(LogicError);
			expect((err as LogicError).code).toBe(LogicErrorCode.TokenExpired);
		}
	});

	test('hash mismatch — DB has a different hash for this id', async () => {
		// Simulates an attacker forging a valid JWT by reusing an `id` that
		// exists in our DB (e.g. they intercepted the refresh token row id
		// somehow). The stored hash check rejects regardless.
		const { row, jwt: token } = aliveToken();
		row.hashedToken = sha256('completely-different-token');
		const session = aliveSession({ id: row.sessionId, userId: row.userId });
		const c = fakeContext([row], [session]);

		try {
			await rotateRefreshToken(c, token);
			throw new Error('Expected rotation to throw');
		} catch (err) {
			expect(err).toBeInstanceOf(LogicError);
			expect((err as LogicError).code).toBe(LogicErrorCode.InvalidToken);
		}
	});

	test('unknown token id (not in DB) throws InvalidToken', async () => {
		const { jwt: token } = aliveToken();
		// Note: we DON'T put this token into the fake's table.
		const c = fakeContext([], []);

		try {
			await rotateRefreshToken(c, token);
			throw new Error('Expected rotation to throw');
		} catch (err) {
			expect(err).toBeInstanceOf(LogicError);
			expect((err as LogicError).code).toBe(LogicErrorCode.InvalidToken);
		}
	});

	test('garbage JWT throws InvalidToken before hitting Prisma', async () => {
		const c = fakeContext([], []);

		try {
			await rotateRefreshToken(c, 'not-a-jwt');
			throw new Error('Expected rotation to throw');
		} catch (err) {
			expect(err).toBeInstanceOf(LogicError);
			expect((err as LogicError).code).toBe(LogicErrorCode.InvalidToken);
		}
	});
});
