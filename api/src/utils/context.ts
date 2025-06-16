import { Request } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { RedisClientType } from 'redis';

import prismaClient from '../config/prisma';
import redisClient from '../config/redis';
import Services from '../services';

export interface AppContext {
	user: User;
	storeId?: string;
	prisma: PrismaClient;
	redisClient: RedisClientType;
	services: Services;
}

const services = new Services();

export const getAppContext = (req: Request): AppContext => ({
	user: req.auth as User,
	storeId: req.headers['x-market-store-id'] as string,
	prisma: prismaClient,
	redisClient: redisClient,
	services
});
