import { User } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import redisClient from '../config/redis';

const generateCode = () => {
	return Array.from(crypto.randomBytes(3))
		.map(byte => byte % 10)
		.join('');
};

export const sendVerificationCode = async (phone: string) => {
	const code = generateCode();
	// We should probably add a prefix to the key.
	await redisClient.set(phone, code);
	await redisClient.expire(phone, 600);
	console.log(phone, code);
};

export const generateAccessToken = async (
	user: User,
	role: 'admin' | 'user' = 'user'
) => {
	return jwt.sign(
		{ id: user.id, name: user.name, email: user.email, role },
		process.env.JWT_SECRET as string
	);
};

export const verifyAccessToken = async (token: string) => {
	return jwt.verify(token, process.env.JWT_SECRET as string);
};
