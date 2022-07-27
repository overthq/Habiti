import { PrismaClient, User } from '@prisma/client';
import type { RedisClient } from '../config/redis';

export interface ResolverContext {
	prisma: PrismaClient;
	user: User | null;
	redisClient: RedisClient;
}

export type Resolver<K = any, R = any> = (
	parent: any,
	args: K,
	ctx: ResolverContext,
	info: any
) => R;
