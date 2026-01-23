import { Request, Response } from 'express';

import { getAppContext } from '../utils/context';

export const checkHealth = async (req: Request, res: Response) => {
	const ctx = getAppContext(req);

	try {
		await ctx.prisma.$queryRaw`SELECT 1`;
		await ctx.redis.ping();

		return res.status(200).json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			services: { database: 'up', redis: 'up' }
		});
	} catch (error) {
		return res.status(503).json({
			status: 'unhealthy',
			error: (error as Error).message
		});
	}
};
