import type { RedisClient } from 'bun';

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

const key = (sessionId: string) => `auth:session:revoked:${sessionId}`;

export const denySession = async (
	redis: RedisClient,
	sessionId: string
): Promise<void> => {
	const k = key(sessionId);
	await redis.set(k, '1');
	await redis.expire(k, DENY_TTL_SEC);
};

export const isSessionDenied = async (
	redis: RedisClient,
	sessionId: string
): Promise<boolean> => {
	const v = await redis.get(key(sessionId));
	return v !== null;
};

/** Test helper. */
export const clearSessionDeny = async (
	redis: RedisClient,
	sessionId: string
): Promise<void> => {
	await redis.del(key(sessionId));
};
