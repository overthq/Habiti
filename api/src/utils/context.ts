import { Request } from 'express';
import { PrismaClient } from '../generated/prisma/client';
import { RedisClient } from 'bun';

import prismaClient from '../config/prisma';
import redisClient from '../config/redis';
import Services from '../services';

enum ContextUserRole {
	Admin = 'admin',
	User = 'user'
}

export interface ContextUser {
	id: string;
	name: string;
	email: string;
	role: ContextUserRole;
}

export interface AppContext {
	user?: ContextUser;
	storeId?: string;
	prisma: PrismaClient;
	redisClient: RedisClient;
	services: Services;
	isAdmin: boolean;
}

const services = new Services();

export const getAppContext = (req: Request): AppContext => ({
	user: req.auth as ContextUser,
	storeId: req.headers['x-market-store-id'] as string,
	prisma: prismaClient,
	redisClient: redisClient,
	services,
	isAdmin: req.auth?.role === ContextUserRole.Admin
});
