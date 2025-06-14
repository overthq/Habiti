import './config/sentry';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { expressjwt } from 'express-jwt';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import * as Sentry from '@sentry/node';

import { getAppContext } from './utils/context';
import redisClient from './config/redis';
import admin from './routes/admin';
import auth from './routes/auth';
import carts from './routes/carts';
import health from './routes/health';
import orders from './routes/orders';
import payments from './routes/payments';
import products from './routes/products';
import stores from './routes/stores';
import users from './routes/users';
import webhooks from './routes/webhooks';
import schema from './graphql/schema';

import './config/cloudinary';
import './config/env';

const main = async () => {
	const app = express();
	Sentry.setupExpressErrorHandler(app);

	app.use(express.json());
	app.use(compression());
	app.use(
		expressjwt({
			secret: process.env.JWT_SECRET as string,
			algorithms: ['HS256'],
			credentialsRequired: false
		})
	);

	const httpServer = createServer(app);
	const apolloServer = new ApolloServer({
		schema,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
		cache: 'bounded',
		csrfPrevention: false
	});

	await apolloServer.start();

	app.use(cors());
	app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
	app.use(
		'/graphql',
		express.json(),
		expressMiddleware(apolloServer, {
			context: async ({ req }) => getAppContext(req)
		})
	);

	app.use('/webhooks', webhooks);
	app.use('/payments', payments);
	app.use('/health', health);
	app.use('/users', users);
	app.use('/carts', carts);
	app.use('/stores', stores);
	app.use('/orders', orders);
	app.use('/products', products);
	app.use('/admin', admin);
	app.use('/auth', auth);

	const PORT = Number(process.env.PORT || 3000);
	httpServer.listen({ port: PORT });

	await redisClient.connect();
	console.log(`Server running on port ${PORT}`);
};

main();
