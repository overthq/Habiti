import './config/sentry';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import { createServer } from 'http';
import * as Sentry from '@sentry/bun';

import { errorHandler } from './middleware/errorHandler';

import routes from './routes';

import { env } from './config/env';
import redisClient from './config/redis';
import './config/cloudinary';
import { corsConfig } from './utils/cors';
import logsMiddleware from './middleware/logs';
import logger from './utils/logger';

const main = async () => {
	const app = express();
	Sentry.setupExpressErrorHandler(app);

	app.use(corsConfig);
	app.use(express.json());
	app.use(cookieParser());
	app.use(compression());
	app.use(logsMiddleware);

	const httpServer = createServer(app);

	app.use('/', routes);

	app.use(errorHandler);

	httpServer.listen({ port: Number(env.PORT) });

	await redisClient.connect();
	logger.info(`Server running on port ${env.PORT}`);
};

main();
