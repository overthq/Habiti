import { timingSafeEqual } from 'crypto';
import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import jwt from 'jsonwebtoken';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import { authenticate } from '../middleware/auth';
import { rateLimit, composeRateLimits } from '../middleware/rateLimit';
import { env } from '../config/env';
import { APIException } from '../types/errors';
import { LogicError, LogicErrorCode } from '../core/logic/errors';
import * as AuthLogic from '../core/logic/auth';
import * as UserLogic from '../core/logic/users';
import * as CartLogic from '../core/logic/carts';
import * as Schemas from '../core/validations/rest';

// Per-IP fallback for unauthenticated routes — protects the service.
const ipLimiter = rateLimit({
	prefix: 'auth:ip',
	windowSec: 60,
	limit: 20
});

// Per-email/identity limiter — protects individual accounts. Falls back to
// the IP-derived key if no body or no email is present.
const identityLimiter = (prefix: string) =>
	rateLimit({
		prefix,
		windowSec: 60,
		limit: 5,
		keyGenerator: async c => {
			try {
				const body = await c.req.raw.clone().json();
				const email =
					typeof body?.email === 'string' ? body.email.toLowerCase() : null;
				if (email) return `email:${email}`;
			} catch {
				// fall through
			}
			const forwarded = c.req.header('x-forwarded-for');
			return forwarded ? forwarded.split(',')[0]!.trim() : 'anon';
		}
	});

const auth = new Hono<AppEnv>();

auth.post(
	'/register',
	composeRateLimits(ipLimiter, identityLimiter('auth:register')),
	zValidator('json', Schemas.registerBodySchema, zodHook),
	async c => {
		const { name, email } = c.req.valid('json');

		const user = await UserLogic.register(c, { name, email });
		return c.json({ user }, 201);
	}
);

auth.post(
	'/login',
	composeRateLimits(ipLimiter, identityLimiter('auth:login')),
	zValidator('json', Schemas.authenticateBodySchema, zodHook),
	async c => {
		const { email } = c.req.valid('json');

		await UserLogic.login(c, { email });
		return c.json({ message: 'Verification code sent to your email' });
	}
);

auth.post(
	'/verify-code',
	composeRateLimits(ipLimiter, identityLimiter('auth:verify-code')),
	zValidator('json', Schemas.verifyCodeBodySchema, zodHook),
	async c => {
		const { email, code, cartIds } = c.req.valid('json');

		if (!email || !code) {
			throw new APIException(400, 'Email and verification code are required.');
		}

		const cachedCode = await AuthLogic.retrieveVerificationCode(email);

		if (!cachedCode) {
			throw new LogicError(LogicErrorCode.NotFound);
		}

		// Constant-time compare to prevent timing-based code recovery.
		const a = Buffer.from(cachedCode, 'utf8');
		const b = Buffer.from(code, 'utf8');
		if (a.length !== b.length || !timingSafeEqual(a, b)) {
			throw new APIException(400, 'Invalid code');
		}

		const user = await UserLogic.getUserByEmail(c, email);

		if (!user) {
			throw new LogicError(LogicErrorCode.UserNotFound);
		}

		const refreshResult = await AuthLogic.generateRefreshToken(
			c,
			user.id,
			undefined,
			{
				userAgent: c.req.header('user-agent'),
				ipAddress: c.req.header('x-forwarded-for') ?? undefined
			}
		);
		const accessToken = await AuthLogic.generateAccessToken(
			user,
			'user',
			refreshResult.sessionId
		);

		if (cartIds && cartIds.length > 0) {
			await CartLogic.claimCarts(c, { cartIds, userId: user.id });
		}

		setCookie(c, 'refreshToken', refreshResult.token, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'Strict',
			path: '/'
		});

		return c.json({
			accessToken,
			refreshToken: refreshResult.token,
			userId: user.id
		});
	}
);

auth.post(
	'/apple-callback',
	ipLimiter,
	zValidator('json', Schemas.appleCallbackBodySchema, zodHook),
	async c => {
		if (
			!env.APPLE_CLIENT_ID ||
			!env.APPLE_CLIENT_SECRET ||
			!env.APPLE_REDIRECT_URI
		) {
			throw new Error('Apple credentials not specified');
		}

		const body = c.req.valid('json');

		const response = await fetch('https://appleid.apple.com/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: env.APPLE_CLIENT_ID,
				client_secret: env.APPLE_CLIENT_SECRET,
				code: body.code,
				grant_type: 'authorization_code',
				redirect_uri: env.APPLE_REDIRECT_URI
			})
		});

		const data = await response.json();
		const decodedToken = jwt.decode(data.id_token) as any;

		if (!decodedToken?.email) {
			throw new APIException(400, 'Invalid Apple ID token');
		}

		let user = await UserLogic.getUserByEmail(c, decodedToken.email);

		if (!user) {
			user = await UserLogic.createUser(c, {
				name: decodedToken.name || '',
				email: decodedToken.email
			});
		}

		const refreshResult = await AuthLogic.generateRefreshToken(
			c,
			user.id,
			undefined,
			{
				userAgent: c.req.header('user-agent'),
				ipAddress: c.req.header('x-forwarded-for') ?? undefined
			}
		);
		const accessToken = await AuthLogic.generateAccessToken(
			user,
			'user',
			refreshResult.sessionId
		);

		setCookie(c, 'refreshToken', refreshResult.token, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'Strict',
			path: '/'
		});

		return c.json({
			accessToken,
			refreshToken: refreshResult.token,
			userId: user.id
		});
	}
);

auth.post(
	'/refresh',
	zValidator('json', Schemas.refreshBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const refreshToken = getCookie(c, 'refreshToken') || body.refreshToken;

		if (!refreshToken) {
			throw new APIException(401, 'Refresh token required');
		}

		const tokens = await AuthLogic.rotateRefreshToken(
			c,
			refreshToken,
			body.storeId
		);

		setCookie(c, 'refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'Strict',
			path: '/'
		});

		return c.json(tokens);
	}
);

auth.post(
	'/switch-store',
	authenticate,
	zValidator('json', Schemas.switchStoreBodySchema, zodHook),
	async c => {
		const { storeId } = c.req.valid('json');

		if (!c.var.auth?.id) {
			throw new APIException(401, 'Authentication required');
		}

		const storeManager = await c.var.prisma.storeManager.findUnique({
			where: {
				storeId_managerId: {
					managerId: c.var.auth.id,
					storeId
				}
			}
		});

		if (!storeManager) {
			throw new APIException(403, 'Not a manager of this store');
		}

		const accessToken = await AuthLogic.generateAccessToken(
			{
				id: c.var.auth.id,
				name: c.var.auth.name,
				email: c.var.auth.email
			} as any,
			'user',
			c.get('auth')?.sessionId,
			storeId
		);

		return c.json({ accessToken });
	}
);

auth.post(
	'/logout',
	zValidator('json', Schemas.logoutBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const refreshToken = getCookie(c, 'refreshToken') || body.refreshToken;

		if (refreshToken) {
			await AuthLogic.revokeRefreshToken(c, refreshToken);
		}

		deleteCookie(c, 'refreshToken', { path: '/' });
		return c.json({ message: 'Logged out' });
	}
);

export default auth;
