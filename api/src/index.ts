import './config/sentry';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import * as Sentry from '@sentry/node';

import { authenticateProd } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

import routes from './routes';

import { getAppContext } from './utils/context';

import schema from './graphql/schema';

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
	const apolloServer = new ApolloServer({
		schema,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
		cache: 'bounded',
		csrfPrevention: false
	});

	await apolloServer.start();

	app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
	app.use(
		'/graphql',
		express.json(),
		authenticateProd,
		expressMiddleware(apolloServer, {
			context: async ({ req }) => getAppContext(req)
		})
	);

	app.use('/', routes);

	app.use(errorHandler);

	httpServer.listen({ port: Number(env.PORT) });

	await redisClient.connect();
	logger.info(`Server running on port ${env.PORT}`);
};

main();
