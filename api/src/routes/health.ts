import { Router } from 'express';

import prismaClient from '../config/prisma';
import redisClient from '../config/redis';

const healthRouter: Router = Router();

healthRouter.get('/', async (_, res) => {
	try {
		// Check database connection
		await prismaClient.$queryRaw`SELECT 1`;

		// Check Redis connection
		await redisClient.ping();

		return res.json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			services: { database: 'up', redis: 'up' }
		});
	} catch (error) {
		return res.status(503).json({
			status: 'unhealthy',
			error: error.message
		});
	}
});

export default healthRouter;
