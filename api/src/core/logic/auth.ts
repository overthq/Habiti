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
import { err, ok, Result } from './result';
import { LogicErrorCode } from './errors';

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

export const cacheVerificationCode = async (
	email: string
): Promise<Result<string, LogicErrorCode>> => {
	try {
		const code = generateCode();
		const key = getEmailCacheKey(email);

		await redisClient.set(key, code);
		await redisClient.expire(key, 600);

		if (env.NODE_ENV !== 'production') {
			console.log({ email, code });
		}

		return ok(code);
	} catch (e) {
		console.error('[AuthLogic.cacheVerificationCode] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const retrieveVerificationCode = async (
	email: string
): Promise<Result<string | null, LogicErrorCode>> => {
	try {
		const cachedCode = await redisClient.get(getEmailCacheKey(email));
		return ok(cachedCode);
	} catch (e) {
		console.error('[AuthLogic.retrieveVerificationCode] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const generateAccessToken = async (
	user: User | Admin,
	role: 'admin' | 'user' = 'user'
): Promise<Result<string, LogicErrorCode>> => {
	try {
		return ok(
			jwt.sign(
				{ id: user.id, name: user.name, email: user.email, role },
				env.JWT_SECRET,
				{ expiresIn: '10m' }
			)
		);
	} catch (e) {
		console.error('[AuthLogic.generateAccessToken] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const generateRefreshToken = async (
	ctx: AppContext,
	userId: string,
	sessionId?: string
): Promise<Result<string, LogicErrorCode>> => {
	try {
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

		return ok(token);
	} catch (e) {
		console.error('[AuthLogic.generateRefreshToken] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const revokeRefreshToken = async (
	ctx: AppContext,
	token: string
): Promise<Result<void, LogicErrorCode>> => {
	try {
		let decoded: { id: string };
		try {
			decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
		} catch {
			// Token invalid or expired, nothing to revoke or already invalid
			return ok(undefined);
		}

		await AuthData.revokeRefreshToken(ctx.prisma, decoded.id);
		return ok(undefined);
	} catch (e) {
		console.error('[AuthLogic.revokeRefreshToken] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const rotateRefreshToken = async (
	ctx: AppContext,
	token: string
): Promise<
	Result<{ accessToken: string; refreshToken: string }, LogicErrorCode>
> => {
	try {
		let decoded: { id: string; userId: string; sessionId?: string };
		try {
			decoded = jwt.verify(token, env.JWT_SECRET) as {
				id: string;
				userId: string;
				sessionId?: string;
			};
		} catch {
			return err(LogicErrorCode.InvalidToken);
		}

		const storedToken = await AuthData.getRefreshTokenById(
			ctx.prisma,
			decoded.id
		);

		if (!storedToken) return err(LogicErrorCode.InvalidToken);

		const hash = crypto.createHash('sha256').update(token).digest('hex');
		if (hash !== storedToken.hashedToken)
			return err(LogicErrorCode.InvalidToken);

		if (storedToken.revoked) {
			await AuthData.revokeSessionRefreshTokens(
				ctx.prisma,
				storedToken.sessionId
			);
			return err(LogicErrorCode.TokenReused);
		}

		// Expiry check is handled by jwt.verify, but double check db record
		if (new Date() > storedToken.expiresAt) {
			return err(LogicErrorCode.TokenExpired);
		}

		await AuthData.revokeRefreshToken(ctx.prisma, storedToken.id);

		const newRefreshTokenResult = await generateRefreshToken(
			ctx,
			storedToken.userId,
			storedToken.sessionId
		);
		if (!newRefreshTokenResult.ok) {
			return err(newRefreshTokenResult.error);
		}

		const newAccessTokenResult = await generateAccessToken(storedToken.user);
		if (!newAccessTokenResult.ok) {
			return err(newAccessTokenResult.error);
		}

		return ok({
			accessToken: newAccessTokenResult.data,
			refreshToken: newRefreshTokenResult.data
		});
	} catch (e) {
		console.error('[AuthLogic.rotateRefreshToken] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const verifyAccessToken = async (
	token: string
): Promise<Result<unknown, LogicErrorCode>> => {
	try {
		return ok(jwt.verify(token, env.JWT_SECRET));
	} catch (e) {
		const name = (e as any)?.name;
		if (name === 'TokenExpiredError') {
			return err(LogicErrorCode.TokenExpired);
		}
		return err(LogicErrorCode.InvalidToken);
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
