import { Response } from 'express';
import prismaClient from '../config/prisma';
import redisClient from '../config/redis';

export const checkHealth = async (_, res: Response) => {
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
};
