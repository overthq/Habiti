import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { Context } from 'hono';

import * as AuthData from '../data/auth';
import * as AdminAuthData from '../data/adminAuth';
import * as SessionData from '../data/sessions';
import * as AdminSessionData from '../data/adminSessions';
import { denySession } from '../data/sessionRevocation';
import { env } from '../../config/env';
import { LogicError, LogicErrorCode } from './errors';
import { runSerializable } from '../../utils/prisma';
import type { Admin, User } from '../../generated/prisma/client';
import type { AppEnv } from '../../types/hono';

const sha256 = (input: string) =>
	crypto.createHash('sha256').update(input).digest('hex');

/**
 * Constant-time hex string compare. Refresh-token JWT signature is the first
 * line of defense against forgery; this is belt-and-suspenders for the
 * stored-hash check.
 */
const safeEqualHex = (a: string, b: string): boolean => {
	if (a.length !== b.length) return false;
	const ab = Buffer.from(a, 'utf8');
	const bb = Buffer.from(b, 'utf8');
	return crypto.timingSafeEqual(ab, bb);
};

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

export const generateAccessToken = async (
	user: User | Admin,
	role: 'admin' | 'user' = 'user',
	sessionId?: string,
	storeId?: string
) => {
	const claims: Record<string, unknown> = {
		id: user.id,
		name: user.name,
		email: user.email,
		role,
		sessionId
	};

	if (storeId) claims.storeId = storeId;

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
		{ id, userId, sessionId: resolvedSessionId },
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
		// Deny-list the session so any access tokens issued under it are
		// rejected immediately by the auth middleware (instead of staying
		// usable for the remainder of their 10-minute TTL).
		await denySession(c.var.redis, decoded.sessionId);
	} else {
		await AuthData.revokeRefreshToken(c.var.prisma, decoded.id);
	}
};

export const rotateRefreshToken = async (
	c: Context<AppEnv>,
	token: string,
	storeId?: string
) => {
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

	const hash = sha256(token);

	// Read-validate-revoke-issue runs inside a single serializable transaction:
	//   - Prevents two concurrent rotations from both succeeding (RFC 6819).
	//   - Atomic revoke + create — a DB hiccup mid-rotation no longer logs the
	//     user out spuriously with a half-applied state.
	//   - Reuse detection: presenting an already-revoked token kills the
	//     entire session, blasting every live refresh token bound to it.
	const { userId, sessionId, newRefreshTokenJwt, user } = await runSerializable(
		c.var.prisma,
		async tx => {
			const stored = await tx.refreshToken.findUnique({
				where: { id: decoded.id },
				include: { user: true }
			});

			if (!stored) {
				throw new LogicError(LogicErrorCode.InvalidToken);
			}

			if (!safeEqualHex(hash, stored.hashedToken)) {
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
				{ id: newId, userId: stored.userId, sessionId: stored.sessionId },
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
		}
	);

	// If storeId was requested, verify the user is still a manager. This
	// happens *outside* the serializable tx — store-manager membership is
	// not part of the rotation invariant.
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

	const newAccessToken = await generateAccessToken(
		user,
		'user',
		sessionId,
		resolvedStoreId
	);

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

// Admin Refresh Token Functions

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
		{ id, adminId, sessionId: resolvedSessionId, role: 'admin' },
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
		// Same as the user-side flow: shut down active access tokens now.
		await denySession(c.var.redis, decoded.sessionId);
	} else {
		await AdminAuthData.revokeAdminRefreshToken(c.var.prisma, decoded.id);
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
	c: Context<AppEnv>,
	token: string
) => {
	const decoded = decodeAdminToken(token);

	if (decoded.role !== 'admin') {
		throw new LogicError(LogicErrorCode.InvalidToken);
	}

	const hash = sha256(token);

	// Same RFC 6819 atomic rotation pattern as the user-side flow.
	const result = await runSerializable(c.var.prisma, async tx => {
		const stored = await tx.adminRefreshToken.findUnique({
			where: { id: decoded.id }
		});

		if (!stored) {
			throw new LogicError(LogicErrorCode.InvalidToken);
		}

		if (!safeEqualHex(hash, stored.hashedToken)) {
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
				role: 'admin'
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
	});

	// Look up the admin record (rotation tx kept the user-side `include` on
	// the ref-token row; for admins we read separately to avoid bloating the
	// serializable transaction).
	const admin = await c.var.prisma.admin.findUnique({
		where: { id: result.adminId }
	});

	if (!admin) {
		throw new LogicError(LogicErrorCode.AdminNotFound);
	}

	const newAccessToken = await generateAccessToken(
		admin,
		'admin',
		result.sessionId
	);

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
