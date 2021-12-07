import redis from 'redis';

const prod = {
	url: process.env.REDIS_TLS_URL,
	tls: { rejectUnauthorized: false }
};

const dev = { url: process.env.REDIS_URL };

const client = redis.createClient(
	process.env.NODE_ENV === 'production' ? prod : dev
);

client.on('connect', () => {
	console.log('Connected to Redis!');
});

client.on('error', error => {
	console.log(error);
});

export default client;
