import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { bodyLimit } from 'hono/body-limit';
import { timing } from 'hono/timing';

import { resolveDependencies, type AppDependencies } from './dependencies';
import { errorHandler } from './middleware/errorHandler';
import { createContextMiddleware } from './middleware/context';
import logsMiddleware from './middleware/logs';
import { inflightMiddleware } from './middleware/inflight';
import routes from './routes';

import { corsConfig } from './utils/cors';

import type { AppEnv } from './types/hono';

export type CreateAppOptions = Partial<AppDependencies>;

export const createApp = (options: CreateAppOptions = {}) => {
	const app = new Hono<AppEnv>();

	app.use('*', corsConfig);

	app.use(
		'*',
		secureHeaders({
			strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
			xFrameOptions: 'DENY',
			xContentTypeOptions: 'nosniff',
			referrerPolicy: 'no-referrer',
			crossOriginResourcePolicy: 'same-site'
		})
	);

	app.use('*', async (c, next) => {
		if (c.req.path.startsWith('/uploads')) return next();
		return bodyLimit({
			maxSize: 256 * 1024,
			onError: ctx => ctx.json({ message: 'Payload too large' }, 413)
		})(c, next);
	});

	app.use('*', timing());
	app.use('*', logsMiddleware);
	app.use('*', createContextMiddleware(resolveDependencies(options)));
	app.use('*', inflightMiddleware);

	app.route('/', routes);

	app.onError(errorHandler);

	return app;
};

export type App = ReturnType<typeof createApp>;
