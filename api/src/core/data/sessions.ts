import type { RedisClient } from 'bun';

import { PrismaClient } from '../../generated/prisma/client';

interface CreateSessionInput {
	userId: string;
	userAgent?: string | undefined;
	ipAddress?: string | undefined;
}

export const createSession = async (
	prisma: PrismaClient,
	input: CreateSessionInput
) => {
	return prisma.session.create({
		data: {
			userId: input.userId,
			userAgent: input.userAgent ?? null,
			ipAddress: input.ipAddress ?? null
		}
	});
};

export const getSessionById = async (prisma: PrismaClient, id: string) => {
	return prisma.session.findUnique({
		where: { id },
		include: { user: true }
	});
};

export const revokeSession = async (prisma: PrismaClient, id: string) => {
	return prisma.$transaction([
		prisma.session.update({
			where: { id },
			data: { revoked: true }
		}),
		prisma.refreshToken.updateMany({
			where: { sessionId: id },
			data: { revoked: true }
		})
	]);
};

export const revokeUserSessions = async (
	prisma: PrismaClient,
	userId: string
) => {
	return prisma.$transaction([
		prisma.session.updateMany({
			where: { userId },
			data: { revoked: true }
		}),
		prisma.refreshToken.updateMany({
			where: { userId },
			data: { revoked: true }
		})
	]);
};

export const getUserSessions = async (prisma: PrismaClient, userId: string) => {
	return prisma.session.findMany({
		where: { userId, revoked: false },
		orderBy: { lastActiveAt: 'desc' }
	});
};

export const updateSessionActivity = async (
	prisma: PrismaClient,
	id: string
) => {
	return prisma.session.update({
		where: { id },
		data: { lastActiveAt: new Date() }
	});
};

/**
 * Session-level access-token deny list.
 *
 * We can't shorten an issued JWT's lifetime — it's a 10-minute access token.
 * To make logout / session-revoke take effect *now* (instead of waiting for
 * the JWT to expire), the auth middleware checks this Redis set on every
 * authenticated request. If the session is denied, the request is 401'd
 * regardless of the JWT being otherwise valid.
 *
 * TTL is set to slightly more than the access token's 10-minute lifetime, so
 * the set stays tiny: every revoked session falls out of the deny list as
 * soon as its longest-lived issued access token would expire anyway.
 *
 * One Redis GET per authenticated request — cheap; Redis is on the same VPC.
 */

const DENY_TTL_SEC = 11 * 60;

const denyKey = (sessionId: string) => `auth:session:revoked:${sessionId}`;

export const denySession = async (
	redis: RedisClient,
	sessionId: string
): Promise<void> => {
	const k = denyKey(sessionId);
	await redis.set(k, '1');
	await redis.expire(k, DENY_TTL_SEC);
};

export const isSessionDenied = async (
	redis: RedisClient,
	sessionId: string
): Promise<boolean> => {
	const v = await redis.get(denyKey(sessionId));
	return v !== null;
};

/** Test helper. */
export const clearSessionDeny = async (
	redis: RedisClient,
	sessionId: string
): Promise<void> => {
	await redis.del(denyKey(sessionId));
};
