import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Admin, User } from '../../generated/prisma/client';
import * as AuthData from '../data/auth';
import * as AdminAuthData from '../data/adminAuth';
import * as SessionData from '../data/sessions';
import * as AdminSessionData from '../data/adminSessions';
import {
	registerBodySchema,
	authenticateBodySchema
} from '../validations/rest';
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

export const retrieveVerificationCode = async (email: string) => {
	return redisClient.get(getEmailCacheKey(email));
};

export const generateAccessToken = async (
	user: User | Admin,
	role: 'admin' | 'user' = 'user',
	sessionId?: string
) => {
	return jwt.sign(
		{ id: user.id, name: user.name, email: user.email, role, sessionId },
		env.JWT_SECRET,
		{ expiresIn: '10m' }
	);
};

interface SessionMetadata {
	userAgent?: string | undefined;
	ipAddress?: string | undefined;
}

export const generateRefreshToken = async (
	ctx: AppContext,
	userId: string,
	sessionId?: string,
	metadata?: SessionMetadata
) => {
	let resolvedSessionId = sessionId;

	if (!resolvedSessionId) {
		const session = await SessionData.createSession(ctx.prisma, {
			userId,
			userAgent: metadata?.userAgent,
			ipAddress: metadata?.ipAddress
		});
		resolvedSessionId = session.id;
	}

	const id = crypto.randomUUID();
	const token = jwt.sign(
		{ id, userId, sessionId: resolvedSessionId },
		env.JWT_SECRET,
		{ expiresIn: '30d' }
	);
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 30);

	await AuthData.createRefreshToken(ctx.prisma, {
		id,
		userId,
		hashedToken,
		expiresAt,
		sessionId: resolvedSessionId
	});

	return { token, sessionId: resolvedSessionId };
};

export const revokeRefreshToken = async (ctx: AppContext, token: string) => {
	let decoded: { id: string; sessionId?: string };
	try {
		decoded = jwt.verify(token, env.JWT_SECRET) as {
			id: string;
			sessionId?: string;
		};
	} catch {
		// Token invalid or expired, nothing to revoke or already invalid
		return;
	}

	if (decoded.sessionId) {
		await SessionData.revokeSession(ctx.prisma, decoded.sessionId);
	} else {
		await AuthData.revokeRefreshToken(ctx.prisma, decoded.id);
	}
};

export const rotateRefreshToken = async (ctx: AppContext, token: string) => {
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

	// Check if the session has been revoked
	if (storedToken.sessionId) {
		const session = await SessionData.getSessionById(
			ctx.prisma,
			storedToken.sessionId
		);
		if (session?.revoked) {
			throw new LogicError(LogicErrorCode.TokenReused);
		}
	}

	if (storedToken.revoked) {
		await SessionData.revokeSession(ctx.prisma, storedToken.sessionId);
		throw new LogicError(LogicErrorCode.TokenReused);
	}

	// Expiry check is handled by jwt.verify, but double check db record
	if (new Date() > storedToken.expiresAt) {
		throw new LogicError(LogicErrorCode.TokenExpired);
	}

	await AuthData.revokeRefreshToken(ctx.prisma, storedToken.id);

	const result = await generateRefreshToken(
		ctx,
		storedToken.userId,
		storedToken.sessionId
	);

	// Bump session activity
	if (storedToken.sessionId) {
		await SessionData.updateSessionActivity(ctx.prisma, storedToken.sessionId);
	}

	const newAccessToken = await generateAccessToken(
		storedToken.user,
		'user',
		storedToken.sessionId
	);

	return {
		accessToken: newAccessToken,
		refreshToken: result.token
	};
};

export const verifyAccessToken = async (token: string) => {
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

// Admin Refresh Token Functions

export const generateAdminRefreshToken = async (
	ctx: AppContext,
	adminId: string,
	sessionId?: string,
	metadata?: SessionMetadata
) => {
	let resolvedSessionId = sessionId;

	if (!resolvedSessionId) {
		const session = await AdminSessionData.createAdminSession(ctx.prisma, {
			adminId,
			userAgent: metadata?.userAgent,
			ipAddress: metadata?.ipAddress
		});
		resolvedSessionId = session.id;
	}

	const id = crypto.randomUUID();
	const token = jwt.sign(
		{ id, adminId, sessionId: resolvedSessionId, role: 'admin' },
		env.JWT_SECRET,
		{ expiresIn: '30d' }
	);
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 30);

	await AdminAuthData.createAdminRefreshToken(ctx.prisma, {
		id,
		adminId,
		hashedToken,
		expiresAt,
		sessionId: resolvedSessionId
	});

	return { token, sessionId: resolvedSessionId };
};

export const revokeAdminRefreshToken = async (
	ctx: AppContext,
	token: string
) => {
	let decoded: { id: string; sessionId?: string };
	try {
		decoded = jwt.verify(token, env.JWT_SECRET) as {
			id: string;
			sessionId?: string;
		};
	} catch {
		return;
	}

	if (decoded.sessionId) {
		await AdminSessionData.revokeAdminSession(ctx.prisma, decoded.sessionId);
	} else {
		await AdminAuthData.revokeAdminRefreshToken(ctx.prisma, decoded.id);
	}
};

type DecodedAdminToken = {
	id: string;
	adminId: string;
	sessionId?: string;
	role?: string;
};

const decodeAdminToken = (token: string) => {
	try {
		return jwt.verify(token, env.JWT_SECRET) as DecodedAdminToken;
	} catch {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}
};

export const rotateAdminRefreshToken = async (
	ctx: AppContext,
	token: string
) => {
	const decoded = decodeAdminToken(token);

	if (decoded.role !== 'admin') {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}

	const storedToken = await AdminAuthData.getAdminRefreshTokenById(
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

	// Check if the session has been revoked
	if (storedToken.sessionId) {
		const session = await AdminSessionData.getAdminSessionById(
			ctx.prisma,
			storedToken.sessionId
		);
		if (session?.revoked) {
			throw new LogicError(LogicErrorCode.TokenReused);
		}
	}

	if (storedToken.revoked) {
		await AdminSessionData.revokeAdminSession(
			ctx.prisma,
			storedToken.sessionId
		);
		throw new LogicError(LogicErrorCode.TokenReused);
	}

	if (new Date() > storedToken.expiresAt) {
		throw new LogicError(LogicErrorCode.TokenExpired);
	}

	await AdminAuthData.revokeAdminRefreshToken(ctx.prisma, storedToken.id);

	const result = await generateAdminRefreshToken(
		ctx,
		storedToken.adminId,
		storedToken.sessionId
	);

	// Bump session activity
	if (storedToken.sessionId) {
		await AdminSessionData.updateAdminSessionActivity(
			ctx.prisma,
			storedToken.sessionId
		);
	}

	const newAccessToken = await generateAccessToken(
		storedToken.admin,
		'admin',
		storedToken.sessionId
	);

	return {
		accessToken: newAccessToken,
		refreshToken: result.token
	};
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
