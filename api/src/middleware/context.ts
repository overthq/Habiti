import { createMiddleware } from 'hono/factory';

import type { AppDependencies } from '../dependencies';
import type { AppEnv } from '../types/hono';

export const createContextMiddleware = (deps: AppDependencies) =>
	createMiddleware<AppEnv>(async (c, next) => {
		c.set('prisma', deps.prisma);
		c.set('redis', deps.redis);
		c.set('services', deps.services);
		c.set('tracer', deps.tracer);
		c.set('storeId', undefined);
		c.set('isAdmin', false);

		await next();
	});
