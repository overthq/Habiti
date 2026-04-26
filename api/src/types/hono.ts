import type { PrismaClient } from '../generated/prisma/client';
import type { RedisClient } from 'bun';
import type Services from '../services';
import type { Logger } from '../services/logger';
import type { Tracer } from '../services/tracer';

export type AuthPayload = {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'user';
	sessionId?: string;
	storeId?: string;
};

export type AppVariables = {
	auth: AuthPayload | undefined;
	jwtPayload: AuthPayload;
	prisma: PrismaClient;
	redis: RedisClient;
	services: Services;
	storeId: string | undefined;
	isAdmin: boolean;
	logger: Logger;
	tracer: Tracer;
	requestId: string;
	traceId: string;
};

export type AppEnv = {
	Variables: AppVariables;
};
