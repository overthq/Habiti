import { createHash } from 'crypto';
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';

import { env } from '../../config/env';
import { LogicError, LogicErrorCode } from './errors';

const APPLE_ISSUER = 'https://appleid.apple.com';

const appleJwks = createRemoteJWKSet(
	new URL('https://appleid.apple.com/auth/keys')
);

export interface AppleIdentity {
	appleId: string;
	email: string | null;
	emailVerified: boolean;
}

const expectedAudiences = (): string[] => {
	const bundleIds = env.APPLE_BUNDLE_IDS.split(',')
		.map(id => id.trim())
		.filter(Boolean);

	// The web's Services ID is a valid audience too.
	return env.APPLE_CLIENT_ID ? [...bundleIds, env.APPLE_CLIENT_ID] : bundleIds;
};

/**
 * `nonce` is the raw value the client generated; Apple embeds its SHA-256
 * hash in the token. Web tokens must carry one so an intercepted token can't
 * be replayed. Native apps don't send one yet, so it stays optional for them.
 */
export const verifyAppleIdentityToken = async (
	identityToken: string,
	nonce?: string,
	keys: JWTVerifyGetKey = appleJwks
): Promise<AppleIdentity> => {
	let payload: Record<string, unknown>;

	try {
		({ payload } = await jwtVerify(identityToken, keys, {
			issuer: APPLE_ISSUER,
			audience: expectedAudiences()
		}));
	} catch {
		throw new LogicError(LogicErrorCode.InvalidToken, 'Invalid Apple token');
	}

	if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
		throw new LogicError(LogicErrorCode.InvalidToken, 'Invalid Apple token');
	}

	const isWebToken =
		!!env.APPLE_CLIENT_ID &&
		(payload.aud === env.APPLE_CLIENT_ID ||
			(Array.isArray(payload.aud) &&
				payload.aud.includes(env.APPLE_CLIENT_ID)));

	if (nonce !== undefined || isWebToken) {
		const expected = nonce
			? createHash('sha256').update(nonce).digest('hex')
			: null;

		if (!expected || payload.nonce !== expected) {
			throw new LogicError(LogicErrorCode.InvalidToken, 'Invalid Apple token');
		}
	}

	const email =
		typeof payload.email === 'string' ? payload.email.toLowerCase() : null;

	// Apple encodes this claim as a boolean or the strings 'true'/'false'.
	const emailVerified =
		payload.email_verified === true || payload.email_verified === 'true';

	return { appleId: payload.sub, email, emailVerified };
};
