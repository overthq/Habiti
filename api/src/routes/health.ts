import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';

const health = new Hono<AppEnv>();

health.get('/health', async c => {
	try {
		await c.var.prisma.$queryRaw`SELECT 1`;
		await c.var.redis.ping();

		return c.json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			services: { database: 'up', redis: 'up' }
		});
	} catch (error) {
		return c.json(
			{
				status: 'unhealthy',
				error: (error as Error).message
			},
			503
		);
	}
});

export default health;
