import { RedisClient } from 'bun';

import { env } from './env';
import { rootLogger } from '../services/logger';

const clientURL = env.REDIS_TLS_URL || env.REDIS_URL;

if (!clientURL) {
	throw new Error('Either REDIS_URL or REDIS_TLS_URL must be supplied!');
}

const redisClient = new RedisClient(clientURL, { tls: !!env.REDIS_TLS_URL });

redisClient.onconnect = () => {
	rootLogger.info({ tls: !!env.REDIS_TLS_URL }, 'redis.connected');
};

redisClient.onclose = error => {
	rootLogger.error({ err: error }, 'redis.closed');
};

export default redisClient;
