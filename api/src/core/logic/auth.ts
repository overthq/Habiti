import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Admin, User } from '@prisma/client';
import {
	registerBodySchema,
	authenticateBodySchema
} from '../validations/auth';
import redisClient from '../../config/redis';
import { env } from '../../config/env';

export const validateRegisterBody = (body: any) => {
	const { success, data, error } = registerBodySchema.safeParse(body);

	if (!success) {
		throw new Error(error.message);
	}

	return data;
};

export const validateAuthenticateBody = (body: any) => {
	const { success, data, error } = authenticateBodySchema.safeParse(body);

	if (!success) {
		throw new Error(error.message);
	}

	return data;
};

export const verifyPassword = async (password: string, hash: string) => {
	return argon2.verify(hash, password);
};

export const hashPassword = async (password: string) => {
	return argon2.hash(password);
};

export const cacheVerificationCode = async (email: string) => {
	const code = generateCode();

	const key = getEmailCacheKey(email);

	await redisClient.set(key, code);
	await redisClient.expire(key, 600);

	if (env.NODE_ENV !== 'production') {
		console.log({ email, code });
	}

	return code;
};

export const retrieveVerificationCode = async (email: string) => {
	const cachedCode = await redisClient.get(getEmailCacheKey(email));

	return cachedCode;
};

export const generateAccessToken = async (
	user: User | Admin,
	role: 'admin' | 'user' = 'user'
) => {
	return jwt.sign(
		{ id: user.id, name: user.name, email: user.email, role },
		env.JWT_SECRET
	);
};

export const verifyAccessToken = async (token: string) => {
	return jwt.verify(token, env.JWT_SECRET);
};

// Utilities

const generateCode = () => {
	return Array.from(crypto.randomBytes(3))
		.map(byte => byte % 10)
		.join('');
};

const getEmailCacheKey = (email: string) => {
	return `email-${email}`;
};
