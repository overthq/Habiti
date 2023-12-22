import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { expressjwt } from 'express-jwt';
import compression from 'compression';
import { createServer } from 'http';

import webhooks from './webhooks';
import payments from './payments';
import schema from './schema';
import redisClient from './config/redis';
import prismaClient from './config/prisma';
import './config/cloudinary';

const main = async () => {
	const app = express();

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
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req }) => ({
			user: (req as any).auth ?? null,
			storeId: req.headers['x-market-store-id'] || undefined,
			prisma: prismaClient,
			redisClient
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
