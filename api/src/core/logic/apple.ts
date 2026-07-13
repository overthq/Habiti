import { createRemoteJWKSet, jwtVerify } from 'jose';

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

	// The web flow's Services ID is a valid audience too, so tokens from the
	// web callback can be verified with the same helper.
	return env.APPLE_CLIENT_ID ? [...bundleIds, env.APPLE_CLIENT_ID] : bundleIds;
};

export const verifyAppleIdentityToken = async (
	identityToken: string
): Promise<AppleIdentity> => {
	let payload: Record<string, unknown>;

	try {
		({ payload } = await jwtVerify(identityToken, appleJwks, {
			issuer: APPLE_ISSUER,
			audience: expectedAudiences()
		}));
	} catch {
		throw new LogicError(LogicErrorCode.InvalidToken, 'Invalid Apple token');
	}

	if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
		throw new LogicError(LogicErrorCode.InvalidToken, 'Invalid Apple token');
	}

	const email =
		typeof payload.email === 'string' ? payload.email.toLowerCase() : null;

	// Apple encodes this claim as a boolean or the strings 'true'/'false'.
	const emailVerified =
		payload.email_verified === true || payload.email_verified === 'true';

	return { appleId: payload.sub, email, emailVerified };
};
