import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Admin, User } from '../../generated/prisma/client';
import * as AuthData from '../data/auth';
import {
	registerBodySchema,
	authenticateBodySchema
} from '../validations/auth';
import redisClient from '../../config/redis';
import { env } from '../../config/env';
import { AppContext } from '../../utils/context';
import { LogicError, LogicErrorCode } from './errors';

export const validateRegisterBody = (body: any) => {
	const { success, data, error } = registerBodySchema.safeParse(body);

	if (!success) {
		throw new LogicError(LogicErrorCode.ValidationFailed, error.message);
	}

	return data;
};

export const validateAuthenticateBody = (body: any) => {
	const { success, data, error } = authenticateBodySchema.safeParse(body);

	if (!success) {
		throw new LogicError(LogicErrorCode.ValidationFailed, error.message);
	}

	return data;
};

export const verifyPassword = async (password: string, hash: string) => {
	return argon2.verify(hash, password);
};

export const hashPassword = async (password: string) => {
	return argon2.hash(password);
};

export const cacheVerificationCode = async (email: string): Promise<string> => {
	const code = generateCode();
	const key = getEmailCacheKey(email);

	await redisClient.set(key, code);
	await redisClient.expire(key, 600);

	if (env.NODE_ENV !== 'production') {
		console.log({ email, code });
	}

	return code;
};

export const retrieveVerificationCode = async (
	email: string
): Promise<string | null> => {
	const cachedCode = await redisClient.get(getEmailCacheKey(email));
	return cachedCode;
};

export const generateAccessToken = async (
	user: User | Admin,
	role: 'admin' | 'user' = 'user'
): Promise<string> => {
	return jwt.sign(
		{ id: user.id, name: user.name, email: user.email, role },
		env.JWT_SECRET,
		{ expiresIn: '10m' }
	);
};

export const generateRefreshToken = async (
	ctx: AppContext,
	userId: string,
	sessionId?: string
): Promise<string> => {
	const id = crypto.randomUUID();
	const resolvedSessionId = sessionId ?? crypto.randomUUID();
	const token = jwt.sign(
		{ id, userId, sessionId: resolvedSessionId },
		env.JWT_SECRET,
		{ expiresIn: '30d' }
	);
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

	await AuthData.createRefreshToken(ctx.prisma, {
		id,
		userId,
		hashedToken,
		expiresAt,
		sessionId: resolvedSessionId
	});

	return token;
};

export const revokeRefreshToken = async (
	ctx: AppContext,
	token: string
): Promise<void> => {
	let decoded: { id: string };
	try {
		decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
	} catch {
		// Token invalid or expired, nothing to revoke or already invalid
		return;
	}

	await AuthData.revokeRefreshToken(ctx.prisma, decoded.id);
};

export const rotateRefreshToken = async (
	ctx: AppContext,
	token: string
): Promise<{ accessToken: string; refreshToken: string }> => {
	let decoded: { id: string; userId: string; sessionId?: string };
	try {
		decoded = jwt.verify(token, env.JWT_SECRET) as {
			id: string;
			userId: string;
			sessionId?: string;
		};
	} catch {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}

	const storedToken = await AuthData.getRefreshTokenById(
		ctx.prisma,
		decoded.id
	);

	if (!storedToken) {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}

	const hash = crypto.createHash('sha256').update(token).digest('hex');
	if (hash !== storedToken.hashedToken) {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}

	if (storedToken.revoked) {
		await AuthData.revokeSessionRefreshTokens(
			ctx.prisma,
			storedToken.sessionId
		);
		throw new LogicError(LogicErrorCode.TokenReused);
	}

	// Expiry check is handled by jwt.verify, but double check db record
	if (new Date() > storedToken.expiresAt) {
		throw new LogicError(LogicErrorCode.TokenExpired);
	}

	await AuthData.revokeRefreshToken(ctx.prisma, storedToken.id);

	const newRefreshToken = await generateRefreshToken(
		ctx,
		storedToken.userId,
		storedToken.sessionId
	);

	const newAccessToken = await generateAccessToken(storedToken.user);

	return {
		accessToken: newAccessToken,
		refreshToken: newRefreshToken
	};
};

export const verifyAccessToken = async (token: string): Promise<unknown> => {
	try {
		return jwt.verify(token, env.JWT_SECRET);
	} catch (e) {
		const name = (e as any)?.name;
		if (name === 'TokenExpiredError') {
			throw new LogicError(LogicErrorCode.TokenExpired);
		}
		throw new LogicError(LogicErrorCode.InvalidToken);
	}
};

// Utilities

const generateCode = () => {
	return Array.from(crypto.randomBytes(6))
		.map(byte => byte % 10)
		.join('');
};

const getEmailCacheKey = (email: string) => {
	return `email-${email}`;
};
