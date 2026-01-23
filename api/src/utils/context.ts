import { Request } from 'express';
import { RedisClient } from 'bun';
import { PrismaClient } from '../generated/prisma/client';

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

export interface BaseAppContext {
	prisma: PrismaClient;
	redis: RedisClient;
	services: Services;
	isAdmin: boolean;
}

export type AppContext<T extends 'user' | 'store' | undefined = undefined> =
	BaseAppContext & {
		user: T extends 'user' | 'store' ? ContextUser : ContextUser | undefined;
		storeId: T extends 'store' ? string : string | undefined;
	};

const services = new Services();

export const getAppContext = (req: Request): AppContext => ({
	user: req.auth as ContextUser,
	storeId: req.headers['x-market-store-id'] as string,
	prisma: prismaClient,
	redis: redisClient,
	services,
	isAdmin: req.auth?.role === ContextUserRole.Admin
});
