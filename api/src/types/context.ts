import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { RedisClient } from '../config/redis';
import * as schema from '../db/schema';
import Services from '../services';

export interface User {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ResolverContext {
	db: NodePgDatabase<typeof schema>;
	user: User | null;
	redisClient: RedisClient;
	storeId?: string;
	services: Services;
}

export type Resolver<K = any, R = any> = (
	parent: any,
	args: K,
	ctx: ResolverContext,
	info: any
) => Promise<R>;

export interface Context {}
