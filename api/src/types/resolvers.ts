import { PrismaClient, User } from '@prisma/client';

import type { RedisClient } from '../config/redis';
import Services from '../services';

export interface ResolverContext {
	prisma: PrismaClient;
	user: User; // This should be nullable, but I want to circumvent validating users everywhere.
	redisClient: RedisClient;
	storeId?: string;
	services: Services;
}

export type Resolver<K = any, R = any> = (
	parent: any,
	args: K,
	ctx: ResolverContext,
	info: any
) => R;
