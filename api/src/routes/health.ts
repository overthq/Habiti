import { Router } from 'express';

import prismaClient from '../config/prisma';
import redisClient from '../config/redis';

const healthRouter: Router = Router();

healthRouter.get('/', async (_, res) => {
	try {
		await prismaClient.$queryRaw`SELECT 1`;

		await redisClient.ping();

		return res.status(200).json({
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
