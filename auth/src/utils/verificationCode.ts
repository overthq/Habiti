import { redisClient } from '../config';

export const generateCode = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

export const sendVerificationCode = (phone: string) => {
	const code = generateCode();
	redisClient.set(phone, code);
	redisClient.expire(phone, 600);
	console.log(phone, code);
};
