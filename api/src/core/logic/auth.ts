import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Admin, User } from '@prisma/client';
import * as AuthData from '../data/auth';
import {
	registerBodySchema,
	authenticateBodySchema
} from '../validations/auth';
import redisClient from '../../config/redis';
import { env } from '../../config/env';
import { AppContext } from '../../utils/context';

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
		env.JWT_SECRET,
		{ expiresIn: '10m' }
	);
};

export const generateRefreshToken = async (ctx: AppContext, userId: string) => {
	const id = crypto.randomUUID();
	const token = jwt.sign({ id, userId }, env.JWT_SECRET, { expiresIn: '30d' });
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

	await AuthData.createRefreshToken(ctx.prisma, {
		id,
		userId,
		hashedToken,
		expiresAt
	});

	return token;
};

export const revokeRefreshToken = async (ctx: AppContext, token: string) => {
	try {
		const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
		await AuthData.revokeRefreshToken(ctx.prisma, decoded.id);
	} catch (error) {
		// Token invalid or expired, nothing to revoke or already invalid
	}
};

export const rotateRefreshToken = async (ctx: AppContext, token: string) => {
	console.log({ token });

	let decoded: { id: string; userId: string };
	try {
		decoded = jwt.verify(token, env.JWT_SECRET) as {
			id: string;
			userId: string;
		};
	} catch (error) {
		throw new Error('Invalid token');
	}

	const storedToken = await AuthData.getRefreshTokenById(
		ctx.prisma,
		decoded.id
	);

	if (!storedToken) throw new Error('Invalid token');

	const hash = crypto.createHash('sha256').update(token).digest('hex');
	if (hash !== storedToken.hashedToken) throw new Error('Invalid token');

	if (storedToken.revoked) {
		await AuthData.revokeUserRefreshTokens(ctx.prisma, storedToken.userId);
		throw new Error('Token reused');
	}

	// Expiry check is handled by jwt.verify, but double check db record
	if (new Date() > storedToken.expiresAt) {
		throw new Error('Token expired');
	}

	await AuthData.revokeRefreshToken(ctx.prisma, storedToken.id);

	const newRefreshToken = await generateRefreshToken(ctx, storedToken.userId);
	const newAccessToken = await generateAccessToken(storedToken.user);

	return { accessToken: newAccessToken, refreshToken: newRefreshToken };
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
