import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { Context } from 'hono';

import * as AuthData from '../data/auth';
import * as AdminAuthData from '../data/adminAuth';
import * as SessionData from '../data/sessions';
import * as AdminSessionData from '../data/adminSessions';
import { env } from '../../config/env';
import { LogicError, LogicErrorCode } from './errors';
import { runSerializable } from '../../utils/prisma';
import { timingSafeEqualString } from '../../utils/timingSafe';
import type { AppEnv } from '../../types/hono';

const sha256 = (input: string) =>
	crypto.createHash('sha256').update(input).digest('hex');

export const verifyPassword = async (password: string, hash: string) => {
	return argon2.verify(hash, password);
};

export const hashPassword = async (password: string) => {
	return argon2.hash(password);
};

export const cacheVerificationCode = async (
	c: Context<AppEnv>,
	email: string
): Promise<string> => {
	const isTestAccount =
		env.TEST_ACCOUNT_EMAIL && email === env.TEST_ACCOUNT_EMAIL;
	const code =
		isTestAccount && env.TEST_ACCOUNT_OTP
			? env.TEST_ACCOUNT_OTP
			: generateCode();

	const key = getEmailCacheKey(email);

	await c.var.redis.set(key, code);
	await c.var.redis.expire(key, 600);

	if (env.NODE_ENV !== 'production') {
		// Use devOtp so code is not redacted on dev.
		c.var.logger.info({ email, devOtp: code }, 'auth.dev_verification_code');
	}

	return code;
};

export const retrieveVerificationCode = async (
	c: Context<AppEnv>,
	email: string
) => {
	return c.var.redis.get(getEmailCacheKey(email));
};

export const deleteVerificationCode = async (
	c: Context<AppEnv>,
	email: string
) => {
	await c.var.redis.del(getEmailCacheKey(email));
};

export enum AccessTokenRole {
	User = 'user',
	Admin = 'admin'
}

type AccessTokenOwner = {
	id: string;
	name: string;
	email: string | null;
	isAnonymous?: boolean | undefined;
};

type GenerateAccessTokenPayload = {
	owner: AccessTokenOwner;
	role?: AccessTokenRole | undefined;
	sessionId?: string | undefined;
	storeId?: string | undefined;
};

export const generateAccessToken = async ({
	owner,
	role = AccessTokenRole.User,
	sessionId,
	storeId
}: GenerateAccessTokenPayload) => {
	const claims: Record<string, unknown> = {
		id: owner.id,
		name: owner.name,
		email: owner.email,
		role,
		typ: 'access',
		sessionId
	};

	if (storeId) claims.storeId = storeId;
	if (owner.isAnonymous) claims.anonymous = true;

	return jwt.sign(claims, env.JWT_SECRET, { expiresIn: '10m' });
};

interface SessionMetadata {
	userAgent?: string | undefined;
	ipAddress?: string | undefined;
}

export const generateRefreshToken = async (
	c: Context<AppEnv>,
	userId: string,
	sessionId?: string,
	metadata?: SessionMetadata
) => {
	let resolvedSessionId = sessionId;

	if (!resolvedSessionId) {
		const session = await SessionData.createSession(c.var.prisma, {
			userId,
			userAgent: metadata?.userAgent,
			ipAddress: metadata?.ipAddress
		});

		resolvedSessionId = session.id;
	}

	const id = crypto.randomUUID();
	const token = jwt.sign(
		{ id, userId, sessionId: resolvedSessionId, typ: 'refresh' },
		env.JWT_SECRET,
		{ expiresIn: '30d' }
	);
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 30);

	await AuthData.createRefreshToken(c.var.prisma, {
		id,
		userId,
		hashedToken,
		expiresAt,
		sessionId: resolvedSessionId
	});

	return { token, sessionId: resolvedSessionId };
};

export const revokeRefreshToken = async (c: Context<AppEnv>, token: string) => {
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
		await SessionData.revokeSession(c.var.prisma, decoded.sessionId);
		await SessionData.denySession(c.var.redis, decoded.sessionId);
	} else {
		await AuthData.revokeRefreshToken(c.var.prisma, decoded.id);
	}
};

export const rotateRefreshToken = async (
	c: Context<AppEnv>,
	token: string,
	storeId?: string
) => {
	let decoded: { id: string; userId: string; sessionId?: string; typ?: string };
	try {
		decoded = jwt.verify(token, env.JWT_SECRET) as {
			id: string;
			userId: string;
			sessionId?: string;
			typ?: string;
		};
	} catch {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}

	if (decoded.typ === 'access') {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}

	const hash = sha256(token);

	// Read-validate-revoke-issue runs inside a single serializable transaction:
	//   - Prevents two concurrent rotations from both succeeding (RFC 6819).
	//   - Atomic revoke + create — a DB hiccup mid-rotation no longer logs the
	//     user out spuriously with a half-applied state.
	//   - Reuse detection: presenting an already-revoked token kills the
	//     entire session, blasting every live refresh token bound to it.
	const rotation = await runSerializable(c.var.prisma, async tx => {
		const stored = await tx.refreshToken.findUnique({
			where: { id: decoded.id },
			include: { user: true }
		});

		if (!stored) {
			throw new LogicError(LogicErrorCode.InvalidToken);
		}

		if (!timingSafeEqualString(hash, stored.hashedToken)) {
			throw new LogicError(LogicErrorCode.InvalidToken);
		}

		if (stored.sessionId) {
			const session = await tx.session.findUnique({
				where: { id: stored.sessionId }
			});
			if (session?.revoked) {
				throw new LogicError(LogicErrorCode.TokenReused);
			}
		}

		if (stored.revoked) {
			// RFC 6819 — presenting a previously-rotated token is the canonical
			// signal that an attacker stole the cookie. Kill the session.
			await tx.session.update({
				where: { id: stored.sessionId },
				data: { revoked: true }
			});

			await tx.refreshToken.updateMany({
				where: { sessionId: stored.sessionId },
				data: { revoked: true }
			});

			throw new LogicError(LogicErrorCode.TokenReused);
		}

		if (new Date() > stored.expiresAt) {
			throw new LogicError(LogicErrorCode.TokenExpired);
		}

		// Mark the old token revoked first.
		await tx.refreshToken.update({
			where: { id: stored.id },
			data: { revoked: true }
		});

		// Issue the replacement under the same session.
		const newId = crypto.randomUUID();
		const newJwt = jwt.sign(
			{
				id: newId,
				userId: stored.userId,
				sessionId: stored.sessionId,
				typ: 'refresh'
			},
			env.JWT_SECRET,
			{ expiresIn: '30d' }
		);
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 30);

		await tx.refreshToken.create({
			data: {
				id: newId,
				userId: stored.userId,
				hashedToken: sha256(newJwt),
				expiresAt,
				sessionId: stored.sessionId
			}
		});

		await tx.session.update({
			where: { id: stored.sessionId },
			data: { lastActiveAt: new Date() }
		});

		return {
			userId: stored.userId,
			sessionId: stored.sessionId,
			newRefreshTokenJwt: newJwt,
			user: stored.user
		};
	}).catch(async (error: unknown) => {
		// Reuse detection revokes the session in the DB; deny-list it too so
		// access tokens already issued under it die now instead of living out
		// their 10-minute TTL.
		if (
			error instanceof LogicError &&
			error.code === LogicErrorCode.TokenReused &&
			decoded.sessionId
		) {
			await SessionData.denySession(c.var.redis, decoded.sessionId);
		}

		throw error;
	});

	const { userId, sessionId, newRefreshTokenJwt, user } = rotation;

	// Verify the user is still a manager. This happens strictly after
	// rotation and only if needed.

	let resolvedStoreId: string | undefined;

	if (storeId) {
		const storeManager = await c.var.prisma.storeManager.findUnique({
			where: {
				storeId_managerId: {
					managerId: userId,
					storeId
				}
			}
		});

		if (storeManager) {
			resolvedStoreId = storeId;
		}
	}

	const newAccessToken = await generateAccessToken({
		owner: user,
		role: AccessTokenRole.User,
		sessionId,
		storeId: resolvedStoreId
	});

	return {
		accessToken: newAccessToken,
		refreshToken: newRefreshTokenJwt
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

export const generateAdminRefreshToken = async (
	c: Context<AppEnv>,
	adminId: string,
	sessionId?: string,
	metadata?: SessionMetadata
) => {
	let resolvedSessionId = sessionId;

	if (!resolvedSessionId) {
		const session = await AdminSessionData.createAdminSession(c.var.prisma, {
			adminId,
			userAgent: metadata?.userAgent,
			ipAddress: metadata?.ipAddress
		});

		resolvedSessionId = session.id;
	}

	const id = crypto.randomUUID();
	const token = jwt.sign(
		{
			id,
			adminId,
			sessionId: resolvedSessionId,
			role: 'admin',
			typ: 'refresh'
		},
		env.JWT_SECRET,
		{ expiresIn: '30d' }
	);
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 30);

	await AdminAuthData.createAdminRefreshToken(c.var.prisma, {
		id,
		adminId,
		hashedToken,
		expiresAt,
		sessionId: resolvedSessionId
	});

	return { token, sessionId: resolvedSessionId };
};

export const revokeAdminRefreshToken = async (
	c: Context<AppEnv>,
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
		await AdminSessionData.revokeAdminSession(c.var.prisma, decoded.sessionId);
		await SessionData.denySession(c.var.redis, decoded.sessionId);
	} else {
		await AdminAuthData.revokeAdminRefreshToken(c.var.prisma, decoded.id);
	}
};

type DecodedAdminToken = {
	id: string;
	adminId: string;
	sessionId?: string;
	role?: string;
	typ?: string;
};

const decodeAdminToken = (token: string) => {
	try {
		return jwt.verify(token, env.JWT_SECRET) as DecodedAdminToken;
	} catch {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}
};

export const rotateAdminRefreshToken = async (
	c: Context<AppEnv>,
	token: string
) => {
	const decoded = decodeAdminToken(token);

	if (decoded.role !== 'admin' || decoded.typ === 'access') {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}

	const hash = sha256(token);

	const result = await runSerializable(c.var.prisma, async tx => {
		const stored = await tx.adminRefreshToken.findUnique({
			where: { id: decoded.id }
		});

		if (!stored) {
			throw new LogicError(LogicErrorCode.InvalidToken);
		}

		if (!timingSafeEqualString(hash, stored.hashedToken)) {
			throw new LogicError(LogicErrorCode.InvalidToken);
		}

		if (stored.sessionId) {
			const session = await tx.adminSession.findUnique({
				where: { id: stored.sessionId }
			});

			if (session?.revoked) {
				throw new LogicError(LogicErrorCode.TokenReused);
			}
		}

		if (stored.revoked) {
			await tx.adminSession.update({
				where: { id: stored.sessionId },
				data: { revoked: true }
			});

			await tx.adminRefreshToken.updateMany({
				where: { sessionId: stored.sessionId },
				data: { revoked: true }
			});

			throw new LogicError(LogicErrorCode.TokenReused);
		}

		if (new Date() > stored.expiresAt) {
			throw new LogicError(LogicErrorCode.TokenExpired);
		}

		await tx.adminRefreshToken.update({
			where: { id: stored.id },
			data: { revoked: true }
		});

		const newId = crypto.randomUUID();
		const newJwt = jwt.sign(
			{
				id: newId,
				adminId: stored.adminId,
				sessionId: stored.sessionId,
				role: 'admin',
				typ: 'refresh'
			},
			env.JWT_SECRET,
			{ expiresIn: '30d' }
		);
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 30);

		await tx.adminRefreshToken.create({
			data: {
				id: newId,
				adminId: stored.adminId,
				hashedToken: sha256(newJwt),
				expiresAt,
				sessionId: stored.sessionId
			}
		});

		await tx.adminSession.update({
			where: { id: stored.sessionId },
			data: { lastActiveAt: new Date() }
		});

		return {
			adminId: stored.adminId,
			sessionId: stored.sessionId,
			refreshToken: newJwt
		};
	}).catch(async (error: unknown) => {
		if (
			error instanceof LogicError &&
			error.code === LogicErrorCode.TokenReused &&
			decoded.sessionId
		) {
			await SessionData.denySession(c.var.redis, decoded.sessionId);
		}

		throw error;
	});

	const admin = await c.var.prisma.admin.findUnique({
		where: { id: result.adminId }
	});

	if (!admin) {
		throw new LogicError(LogicErrorCode.AdminNotFound);
	}

	const newAccessToken = await generateAccessToken({
		owner: admin,
		role: AccessTokenRole.Admin,
		sessionId: result.sessionId
	});

	return {
		accessToken: newAccessToken,
		refreshToken: result.refreshToken
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
