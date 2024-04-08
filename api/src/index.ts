import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import express from 'express';
import { expressjwt } from 'express-jwt';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';

import prismaClient from './config/prisma';
import redisClient from './config/redis';
import { initSentry } from './config/sentry';
import payments from './payments';
import schema from './schema';
import Services from './services';
import { MarketRequest } from './types/misc';
import webhooks from './webhooks';

import './config/cloudinary';

const main = async () => {
	const app = express();

	initSentry(app);

	app.use(express.json());
	app.use(compression());
	app.use(
		expressjwt({
			secret: process.env.JWT_SECRET,
			algorithms: ['HS256'],
			credentialsRequired: false
		})
	);
	app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

	const httpServer = createServer(app);
	const services = new Services();
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req }: { req: MarketRequest }) => ({
			user: req.auth ?? null,
			storeId: req.headers['x-market-store-id'] || undefined,
			prisma: prismaClient,
			redisClient,
			services
		})
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app });

	app.use('/webhooks', webhooks);
	app.use('/payments', payments);

	const PORT = Number(process.env.PORT || 3000);
	httpServer.listen({ port: PORT });

	await redisClient.connect();
	console.log(`Server running on port ${PORT}`);
};

main();
