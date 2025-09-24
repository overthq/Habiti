import { env } from './env';
import { RedisClient } from 'bun';

const clientURL = env.REDIS_TLS_URL || env.REDIS_URL;

if (!clientURL) {
	throw new Error('Either REDIS_URL or REDIS_TLS_URL must be supplied!');
}

const client = new RedisClient(clientURL, { tls: !!env.REDIS_TLS_URL });

client.onconnect = () => {
	console.log('Connected to Redis!');
};

client.onclose = error => {
	console.log(error);
};

export default client;
