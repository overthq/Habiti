import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	test
} from 'bun:test';
import { createHash } from 'crypto';
import { SignJWT, generateKeyPair, type CryptoKey } from 'jose';

import { env } from '../../config/env';
import { verifyAppleIdentityToken } from './apple';

const WEB_CLIENT_ID = 'app.habiti.web';
const BUNDLE_ID = 'app.habiti.dashboard';
const RAW_NONCE = 'a'.repeat(32);
const HASHED_NONCE = createHash('sha256').update(RAW_NONCE).digest('hex');

let privateKey: CryptoKey;
let keys: () => Promise<CryptoKey>;

const sign = (claims: Record<string, unknown>, audience: string) =>
	new SignJWT({ email: 'ada@example.com', email_verified: 'true', ...claims })
		.setProtectedHeader({ alg: 'RS256' })
		.setIssuer('https://appleid.apple.com')
		.setSubject('apple-user-1')
		.setAudience(audience)
		.setIssuedAt()
		.setExpirationTime('5m')
		.sign(privateKey);

const originalClientId = env.APPLE_CLIENT_ID;

beforeAll(async () => {
	const pair = await generateKeyPair('RS256');
	privateKey = pair.privateKey;
	keys = async () => pair.publicKey;
	env.APPLE_CLIENT_ID = WEB_CLIENT_ID;
});

afterEach(() => {
	env.APPLE_CLIENT_ID = WEB_CLIENT_ID;
});

describe('verifyAppleIdentityToken', () => {
	test('accepts a web token whose nonce matches the raw nonce', async () => {
		const token = await sign({ nonce: HASHED_NONCE }, WEB_CLIENT_ID);

		const identity = await verifyAppleIdentityToken(token, RAW_NONCE, keys);

		expect(identity).toEqual({
			appleId: 'apple-user-1',
			email: 'ada@example.com',
			emailVerified: true
		});
	});

	test('rejects a web token when no nonce is sent', async () => {
		const token = await sign({ nonce: HASHED_NONCE }, WEB_CLIENT_ID);

		await expect(
			verifyAppleIdentityToken(token, undefined, keys)
		).rejects.toThrow('Invalid Apple token');
	});

	test('rejects a web token whose nonce does not match', async () => {
		const token = await sign({ nonce: HASHED_NONCE }, WEB_CLIENT_ID);

		await expect(
			verifyAppleIdentityToken(token, 'b'.repeat(32), keys)
		).rejects.toThrow('Invalid Apple token');
	});

	test('native tokens still work without a nonce', async () => {
		const token = await sign({}, BUNDLE_ID);

		const identity = await verifyAppleIdentityToken(token, undefined, keys);

		expect(identity.appleId).toBe('apple-user-1');
	});

	test('a native token is held to a nonce once one is sent', async () => {
		const token = await sign({}, BUNDLE_ID);

		await expect(
			verifyAppleIdentityToken(token, RAW_NONCE, keys)
		).rejects.toThrow('Invalid Apple token');
	});

	test('web-issued tokens are rejected when the Services ID is not configured', async () => {
		env.APPLE_CLIENT_ID = undefined;
		const token = await sign({ nonce: HASHED_NONCE }, WEB_CLIENT_ID);

		await expect(
			verifyAppleIdentityToken(token, RAW_NONCE, keys)
		).rejects.toThrow('Invalid Apple token');
	});
});

afterAll(() => {
	env.APPLE_CLIENT_ID = originalClientId;
});
