import { createClient, RedisClientType } from 'redis';
import { env } from './env';

const clientURL = env.REDIS_TLS_URL || env.REDIS_URL;

if (!clientURL) {
	throw new Error('Either REDIS_URL or REDIS_TLS_URL must be supplied!');
}

const client: RedisClientType = createClient({
	url: clientURL,
	socket: {
		tls: !!env.REDIS_TLS_URL,
		rejectUnauthorized: false
	}
});

client.on('connect', () => {
	console.log('Connected to Redis!');
});

client.on('error', error => {
	console.log(error);
});

export default client;
