import type { RedisClient } from 'bun';

import prismaClient from './config/prisma';
import redisClient from './config/redis';
import Services from './services';
import { tracer } from './services/tracer';

import type { PrismaClient } from './generated/prisma/client';
import type { Tracer } from './services/tracer';

export type AppDependencies = {
	prisma: PrismaClient;
	redis: RedisClient;
	services: Services;
	tracer: Tracer;
};

let servicesSingleton: Services | undefined;

export const getServices = (): Services => {
	servicesSingleton ??= new Services(redisClient);

	return servicesSingleton;
};

export const peekServices = (): Services | undefined => servicesSingleton;

export const resolveDependencies = (
	overrides: Partial<AppDependencies> = {}
): AppDependencies => ({
	prisma: overrides.prisma ?? prismaClient,
	redis: overrides.redis ?? redisClient,
	services: overrides.services ?? getServices(),
	tracer: overrides.tracer ?? tracer
});
