import { timingSafeEqual } from 'crypto';
import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';

const health = new Hono<AppEnv>();

health.get('/health/live', c => c.json({ status: 'ok' }));

const checkInternalToken = (provided: string | undefined): boolean => {
	if (!env.INTERNAL_TOKEN || !provided) return false;

	const a = Buffer.from(env.INTERNAL_TOKEN, 'utf8');
	const b = Buffer.from(provided, 'utf8');

	return a.length === b.length && timingSafeEqual(a, b);
};

health.get('/health/ready', async c => {
	const start = performance.now();

	const [dbResult, redisResult] = await Promise.allSettled([
		c.var.prisma.$queryRaw`SELECT 1`,
		c.var.redis.ping()
	]);

	const ok =
		dbResult.status === 'fulfilled' && redisResult.status === 'fulfilled';

	const isInternal = checkInternalToken(c.req.header('x-internal-token'));

	if (isInternal) {
		return c.json(
			{
				status: ok ? 'ready' : 'degraded',
				version: env.APP_VERSION,
				uptime_s: Math.round(process.uptime()),
				check_duration_ms: Math.round(performance.now() - start),
				services: {
					database: dbResult.status === 'fulfilled' ? 'up' : 'down',
					redis: redisResult.status === 'fulfilled' ? 'up' : 'down'
				}
			},
			ok ? 200 : 503
		);
	}

	return c.json({ status: ok ? 'ready' : 'degraded' }, ok ? 200 : 503);
});

// Backwards compatibility
health.get('/health', async c => {
	const [dbResult, redisResult] = await Promise.allSettled([
		c.var.prisma.$queryRaw`SELECT 1`,
		c.var.redis.ping()
	]);

	const ok =
		dbResult.status === 'fulfilled' && redisResult.status === 'fulfilled';

	const isInternal = checkInternalToken(c.req.header('x-internal-token'));

	if (isInternal) {
		return c.json(
			{
				status: ok ? 'healthy' : 'unhealthy',
				timestamp: new Date().toISOString(),
				services: {
					database: dbResult.status === 'fulfilled' ? 'up' : 'down',
					redis: redisResult.status === 'fulfilled' ? 'up' : 'down'
				}
			},
			ok ? 200 : 503
		);
	}

	return c.json({ status: ok ? 'healthy' : 'unhealthy' }, ok ? 200 : 503);
});

export default health;
