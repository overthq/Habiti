import redis from 'redis';

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on('error', error => {
	throw new Error(error);
});

export default redisClient;
