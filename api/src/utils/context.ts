import { Request } from 'express';
import { PrismaClient, User } from '../generated/prisma/client';
import { RedisClient } from 'bun';

import prismaClient from '../config/prisma';
import redisClient from '../config/redis';
import Services from '../services';
import { verifyAccessToken } from '../core/logic/auth';

export interface AppContext {
	user: User;
	storeId?: string;
	prisma: PrismaClient;
	redisClient: RedisClient;
	services: Services;
	isAdmin: () => Promise<boolean>;
}

const services = new Services();

export const getAppContext = (req: Request): AppContext => ({
	user: req.auth as User,
	storeId: req.headers['x-market-store-id'] as string,
	prisma: prismaClient,
	redisClient: redisClient,
	services,
	isAdmin: () => checkAdminStatus(req)
});

// FIXME: Find a way to do this without async so we can have the value
// be a boolean on the context.

const checkAdminStatus = async (req: Request) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) return false;

	const parsedToken = await verifyAccessToken(token);

	return (parsedToken as any).role === 'admin' || false;
};
