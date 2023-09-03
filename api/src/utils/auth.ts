import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis';

// Is the entropy enough to guarantee no collisions?
const generateCode = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

export const sendVerificationCode = async (phone: string) => {
	const code = generateCode();
	// We should probably add a prefix to the key.
	await redisClient.set(phone, code);
	await redisClient.expire(phone, 600);
	console.log(phone, code);
};

export const generateAccessToken = async (user: User) => {
	return jwt.sign(user, process.env.JWT_SECRET);
};
