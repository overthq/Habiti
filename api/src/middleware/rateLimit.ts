import type { Context, MiddlewareHandler } from 'hono';
import type { Env, Input } from 'hono/types';
import type { RedisClient } from 'bun';
import {
	rateLimiter,
	type Store,
	type ClientRateLimitInfo,
	type HonoConfigType
} from 'hono-rate-limiter';
import { routePath } from 'hono/route';

import type { AppEnv } from '../types/hono';
import { metrics, MetricNames } from '../services/metrics';

interface BunRedisStore<
	E extends Env = Env,
	P extends string = string,
	I extends Input = Input
> extends Store<E, P, I> {
	_bind: (c: Context<AppEnv>) => void;
}

const createBunRedisStore = <
	E extends Env = Env,
	P extends string = string,
	I extends Input = Input
>(
	prefix: string
): BunRedisStore<E, P, I> => {
	let client: RedisClient | undefined;
	let windowSec = 60;

	const k = (key: string) => `rl:${prefix}:${key}`;

	return {
		init(options: HonoConfigType<E, P, I>) {
			windowSec = Math.max(1, Math.ceil(options.windowMs / 1000));
		},

		async increment(key: string): Promise<ClientRateLimitInfo> {
			if (!client) throw new Error('rateLimit store not bound to redis');
			const fullKey = k(key);
			const totalHits = await client.incr(fullKey);
			if (totalHits === 1) {
				await client.expire(fullKey, windowSec);
			}
			const ttl = await client.ttl(fullKey);
			const ttlSec = ttl > 0 ? ttl : windowSec;
			return {
				totalHits,
				resetTime: new Date(Date.now() + ttlSec * 1000)
			};
		},

		async decrement(key: string): Promise<void> {
			if (!client) return;
			await client.decr(k(key));
		},

		async resetKey(key: string): Promise<void> {
			if (!client) return;
			await client.del(k(key));
		},

		_bind(c: Context<AppEnv>) {
			client = c.var.redis;
		}
	};
};

interface RateLimitOpts {
	prefix: string;
	windowSec: number;
	limit: number;
	/** Generate the per-request identity (default: `x-forwarded-for` first hop). */
	keyGenerator?: (c: Context<AppEnv>) => string | Promise<string>;
}

const defaultKeyGenerator = (c: Context<AppEnv>): string => {
	const forwarded = c.req.header('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0]!.trim();
	return 'anon';
};

export const rateLimit = (opts: RateLimitOpts): MiddlewareHandler<AppEnv> => {
	const store = createBunRedisStore<AppEnv>(opts.prefix);
	const limiter = rateLimiter<AppEnv>({
		windowMs: opts.windowSec * 1000,
		limit: opts.limit,
		standardHeaders: 'draft-7',
		keyGenerator: opts.keyGenerator ?? defaultKeyGenerator,
		handler: c => {
			metrics.inc(MetricNames.RateLimitBlocked, { prefix: opts.prefix });

			c.var.logger?.warn(
				{ prefix: opts.prefix, route: routePath(c) ?? c.req.path },
				'rate_limit_blocked'
			);

			return c.json({ message: 'Too many requests' }, 429);
		},
		store
	});

	return async (c, next) => {
		store._bind(c);
		return limiter(c, next);
	};
};

export const composeRateLimits = (
	...middlewares: MiddlewareHandler<AppEnv>[]
): MiddlewareHandler<AppEnv> => {
	return async (c, next) => {
		let i = 0;

		const run = async (): Promise<void> => {
			if (i >= middlewares.length) return next();
			const mw = middlewares[i++]!;
			await mw(c, run);
		};

		return run();
	};
};
