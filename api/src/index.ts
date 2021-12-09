import express from 'express';
import compression from 'compression';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import auth from './auth';
import schema from './schema';
import redisClient from './config/redis';

const main = async () => {
	const app = express();
	const prisma = new PrismaClient();

	app.use(express.json());
	app.use(compression());

	const httpServer = createServer(app);
	const apolloServer = new ApolloServer({
		schema,
		context: { prisma }
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app });

	app.use('/auth', auth);

	const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
	httpServer.listen({ port: PORT });

	console.log(`Server running on port ${PORT}`);
	await redisClient.connect();
};

main();
