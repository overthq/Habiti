import './config/sentry';

import { Hono } from 'hono';

import { errorHandler } from './middleware/errorHandler';
import { contextMiddleware } from './middleware/context';
import routes from './routes';

import { env } from './config/env';
import redisClient from './config/redis';
import './config/cloudinary';
import { corsConfig } from './utils/cors';
import logsMiddleware from './middleware/logs';

const app = new Hono();

app.use('*', corsConfig);
app.use('*', logsMiddleware);
app.use('*', contextMiddleware);

app.route('/', routes);

app.onError(errorHandler);

const main = async () => {
	await redisClient.connect();
	console.log(`Server running on port ${env.PORT}`);
};

main();

export default {
	port: Number(env.PORT),
	fetch: app.fetch
};
