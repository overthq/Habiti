import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';

const health = new Hono<AppEnv>();

health.get('/health/live', c => c.json({ status: 'ok' }));

/**
 * Readiness: process is up *and* its dependencies are reachable. Used by
 * load balancers to decide whether to route traffic. Returns 503 with a
 * per-dependency status if anything is down.
 */
health.get('/health/ready', async c => {
	const start = performance.now();

	const [dbResult, redisResult] = await Promise.allSettled([
		c.var.prisma.$queryRaw`SELECT 1`,
		c.var.redis.ping()
	]);

	const services = {
		database: dbResult.status === 'fulfilled' ? 'up' : 'down',
		redis: redisResult.status === 'fulfilled' ? 'up' : 'down'
	};

	const ok =
		dbResult.status === 'fulfilled' && redisResult.status === 'fulfilled';

	return c.json(
		{
			status: ok ? 'ready' : 'degraded',
			version: env.APP_VERSION,
			uptime_s: Math.round(process.uptime()),
			check_duration_ms: Math.round(performance.now() - start),
			services
		},
		ok ? 200 : 503
	);
});

// Backwards compatibility — alias `/health` to `/health/ready` so existing
// uptime monitors keep working.
health.get('/health', async c => {
	const [dbResult, redisResult] = await Promise.allSettled([
		c.var.prisma.$queryRaw`SELECT 1`,
		c.var.redis.ping()
	]);

	const ok =
		dbResult.status === 'fulfilled' && redisResult.status === 'fulfilled';

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
});

export default health;
