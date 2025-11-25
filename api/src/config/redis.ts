import { RedisClient } from 'bun';

import logger from '../utils/logger';
import { env } from './env';

const clientURL = env.REDIS_TLS_URL || env.REDIS_URL;

if (!clientURL) {
	throw new Error('Either REDIS_URL or REDIS_TLS_URL must be supplied!');
}

const redisClient = new RedisClient(clientURL, { tls: !!env.REDIS_TLS_URL });

redisClient.onconnect = () => {
	logger.info('Connected to Redis!');
};

redisClient.onclose = error => {
	logger.error('Redis connection closed', error);
};

export default redisClient;
