import { createMiddleware } from 'hono/factory';

import type { AppEnv } from '../types/hono';
import prismaClient from '../config/prisma';
import redisClient from '../config/redis';
import Services from '../services';

const services = new Services();

export const contextMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	c.set('prisma', prismaClient);
	c.set('redis', redisClient);
	c.set('services', services);
	c.set('storeId', undefined);
	c.set('isAdmin', false);
	await next();
});
