import { redisClient } from '../config';

export const generateCode = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

export const sendVerificationCode = async (phone: string) => {
	const code = generateCode();
	await redisClient.set(phone, code);
	await redisClient.expire(phone, 600);
	console.log(phone, code);
};
