import { createMiddleware } from 'hono/factory';

import prismaClient from '../config/prisma';
import redisClient from '../config/redis';
import Services from '../services';
import { tracer } from '../services/tracer';

import type { AppEnv } from '../types/hono';

const services = new Services();

export const contextMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	c.set('prisma', prismaClient);
	c.set('redis', redisClient);
	c.set('services', services);
	c.set('tracer', tracer);
	c.set('storeId', undefined);
	c.set('isAdmin', false);

	await next();
});
