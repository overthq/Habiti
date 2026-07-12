import { mock } from 'bun:test';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

import { createApp, type CreateAppOptions } from '../app';
import { env } from '../config/env';
import * as AuthLogic from '../core/logic/auth';
import { tracer } from '../services/tracer';

import type { RedisClient } from 'bun';
import type { PrismaClient } from '../generated/prisma/client';
import type Services from '../services';

export type FakeRedis = RedisClient & {
	store: Map<string, string>;
	expirations: Map<string, number>;
};

export const createFakeRedis = (
	initial: Record<string, string> = {}
): FakeRedis => {
	const store = new Map<string, string>(Object.entries(initial));
	const expirations = new Map<string, number>();

	const bump = (key: string, by: number) => {
		const next = Number(store.get(key) ?? 0) + by;
		store.set(key, String(next));

		return next;
	};

	return {
		store,
		expirations,
		get: mock(async (key: string) => store.get(key) ?? null),
		set: mock(async (key: string, value: string) => {
			store.set(key, String(value));

			return 'OK' as const;
		}),
		del: mock(async (key: string) => (store.delete(key) ? 1 : 0)),
		expire: mock(async (key: string, seconds: number) => {
			expirations.set(key, seconds);

			return 1;
		}),
		ttl: mock(async (key: string) => expirations.get(key) ?? -1),
		incr: mock(async (key: string) => bump(key, 1)),
		decr: mock(async (key: string) => bump(key, -1)),
		ping: mock(async () => 'PONG' as const),
		close: mock(() => {})
	} as unknown as FakeRedis;
};

export const createFakePrisma = (
	models: Record<string, unknown> = {}
): PrismaClient =>
	new Proxy(models, {
		get(target, prop: string) {
			if (prop in target) return target[prop];

			throw new Error(
				`fake prisma: unexpected access to \`${String(prop)}\`. ` +
					`Stub it via createTestApp({ prisma: createFakePrisma({ ${String(prop)}: … }) }).`
			);
		}
	}) as unknown as PrismaClient;

export const createFakeServices = () =>
	({
		notifications: {
			enqueue: mock(async () => {}),
			flush: mock(async () => {})
		},
		email: {
			send: mock(async () => {}),
			sendVerificationCode: mock(async () => {})
		},
		analytics: {
			track: mock(() => {}),
			identify: mock(() => {}),
			flush: mock(async () => {}),
			shutdown: mock(async () => {})
		}
	}) as unknown as Services;

export const createTestApp = (options: CreateAppOptions = {}) => {
	const redis = (options.redis as FakeRedis | undefined) ?? createFakeRedis();
	const prisma = options.prisma ?? createFakePrisma();
	const services = options.services ?? createFakeServices();

	const app = createApp({
		prisma,
		redis,
		services,
		tracer: options.tracer ?? tracer
	});

	return { app, redis, prisma, services };
};

type AccessTokenOverrides = {
	userId?: string;
	name?: string;
	email?: string | null;
	sessionId?: string;
	role?: AuthLogic.AccessTokenRole;
	storeId?: string;
	isAnonymous?: boolean;
};

export const signAccessToken = ({
	userId = randomUUID(),
	name = 'Test User',
	email = 'test@example.com',
	sessionId,
	role,
	storeId,
	isAnonymous
}: AccessTokenOverrides = {}) =>
	AuthLogic.generateAccessToken({
		owner: { id: userId, name, email, isAnonymous },
		role,
		sessionId,
		storeId
	});

export const signRawToken = (
	claims: Record<string, unknown>,
	expiresIn: jwt.SignOptions['expiresIn'] = '10m'
) => jwt.sign(claims, env.JWT_SECRET, { algorithm: 'HS256', expiresIn });

export const authedRequest = (path: string, token: string) =>
	new Request(`http://test.local${path}`, {
		headers: { authorization: `Bearer ${token}` }
	});

export const anonymousRequest = (path: string) =>
	new Request(`http://test.local${path}`);
