import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { expressjwt } from 'express-jwt';
import compression from 'compression';
import { createServer } from 'http';

import auth from './auth';
import webhooks from './webhooks';
import payments from './payments';
import schema from './schema';
import redisClient from './config/redis';
import './config/cloudinary';

const main = async () => {
	const app = express();
	const prisma = new PrismaClient();

	app.use(express.json());
	app.use(compression());
	app.use(
		expressjwt({
			secret: process.env.JWT_SECRET,
			algorithms: ['HS256'],
			credentialsRequired: false
		})
	);
	app.use(
		graphqlUploadExpress({
			maxFileSize: 10485760,
			maxFiles: 10
		})
	);

	const httpServer = createServer(app);
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req }) => ({
			user: (req as any).auth || null,
			prisma,
			redisClient
		})
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app });

	app.use('/auth', auth);
	app.use('/webhooks', webhooks);
	app.use('/payments', payments);

	const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
	httpServer.listen({ port: PORT });

	await redisClient.connect();
	console.log(`Server running on port ${PORT}`);
};

main();
