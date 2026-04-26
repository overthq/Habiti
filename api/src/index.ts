import './config/sentry';

import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { bodyLimit } from 'hono/body-limit';

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

app.use(
	'*',
	secureHeaders({
		strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
		xFrameOptions: 'DENY',
		xContentTypeOptions: 'nosniff',
		referrerPolicy: 'no-referrer',
		crossOriginResourcePolicy: 'same-site'
		// No CSP — API only serves JSON. Default config also strips X-Powered-By.
	})
);

app.use('*', async (c, next) => {
	if (c.req.path.startsWith('/uploads')) return next();
	return bodyLimit({
		maxSize: 256 * 1024,
		onError: ctx => ctx.json({ message: 'Payload too large' }, 413)
	})(c, next);
});

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
