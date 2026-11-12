import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';

import { zodHook } from '../utils/validation';
import { authenticate, optionalAuth } from '../middleware/auth';
import { rateLimit, composeRateLimits } from '../middleware/rateLimit';
import { timingSafeEqualString } from '../utils/timingSafe';
import { env } from '../config/env';
import { LogicError, LogicErrorCode } from '../core/logic/errors';
import * as AppleLogic from '../core/logic/apple';
import * as AuthLogic from '../core/logic/auth';
import * as UserLogic from '../core/logic/users';
import * as Schemas from '../core/validations/rest';

import type { Context } from 'hono';
import type { AppEnv } from '../types/hono';

const ipLimiter = rateLimit({
	prefix: 'auth:ip',
	windowSec: 60,
	limit: 20
});

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

const setRefreshCookie = (c: Context<AppEnv>, token: string) => {
	setCookie(c, 'refreshToken', token, {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'Strict',
		path: '/'
	});
};

const sessionMetadata = (c: Context<AppEnv>) => ({
	userAgent: c.req.header('user-agent'),
	ipAddress: c.req.header('x-forwarded-for') ?? undefined
});

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
	optionalAuth,
	zValidator('json', Schemas.verifyCodeBodySchema, zodHook),
	async c => {
		const { email, code } = c.req.valid('json');

		if (!email || !code) {
			throw new HTTPException(400, {
				message: 'Email and verification code are required.'
			});
		}

		const cachedCode = await AuthLogic.retrieveVerificationCode(c, email);

		if (!cachedCode) {
			throw new LogicError(LogicErrorCode.NotFound);
		}

		if (!timingSafeEqualString(cachedCode, code)) {
			throw new HTTPException(400, { message: 'Invalid code' });
		}

		// Single-use: a code that has authenticated once must not work again.
		await AuthLogic.deleteVerificationCode(c, email);

		const user = await UserLogic.getUserByEmail(c, email);

		if (!user) {
			throw new LogicError(LogicErrorCode.UserNotFound);
		}

		// A guest signing in to an account adopts their anonymous data.
		const anonymousCaller = await UserLogic.getAnonymousCaller(c);

		if (anonymousCaller && anonymousCaller.id !== user.id) {
			await UserLogic.mergeAnonymousUser(c, anonymousCaller.id, user.id);
		}

		const refreshResult = await AuthLogic.generateRefreshToken(
			c,
			user.id,
			undefined,
			sessionMetadata(c)
		);

		const accessToken = await AuthLogic.generateAccessToken({
			owner: user,
			sessionId: refreshResult.sessionId
		});

		setRefreshCookie(c, refreshResult.token);

		return c.json({
			accessToken,
			refreshToken: refreshResult.token,
			userId: user.id
		});
	}
);

auth.post('/anonymous', ipLimiter, async c => {
	const user = await UserLogic.createAnonymousUser(c);

	const refreshResult = await AuthLogic.generateRefreshToken(
		c,
		user.id,
		undefined,
		sessionMetadata(c)
	);

	const accessToken = await AuthLogic.generateAccessToken({
		owner: user,
		sessionId: refreshResult.sessionId
	});

	setRefreshCookie(c, refreshResult.token);

	return c.json(
		{
			accessToken,
			refreshToken: refreshResult.token,
			userId: user.id
		},
		201
	);
});

auth.post(
	'/apple',
	ipLimiter,
	optionalAuth,
	zValidator('json', Schemas.appleSignInBodySchema, zodHook),
	async c => {
		const { identityToken, fullName, createIfMissing, nonce } =
			c.req.valid('json');

		const identity = await AppleLogic.verifyAppleIdentityToken(
			identityToken,
			nonce
		);
		const user = await UserLogic.signInWithApple(c, {
			identity,
			name: fullName,
			createIfMissing
		});

		const refreshResult = await AuthLogic.generateRefreshToken(
			c,
			user.id,
			undefined,
			sessionMetadata(c)
		);

		const accessToken = await AuthLogic.generateAccessToken({
			owner: user,
			sessionId: refreshResult.sessionId
		});

		setRefreshCookie(c, refreshResult.token);

		return c.json({
			accessToken,
			refreshToken: refreshResult.token,
			userId: user.id
		});
	}
);

auth.post(
	'/refresh',
	ipLimiter,
	zValidator('json', Schemas.refreshBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const refreshToken = getCookie(c, 'refreshToken') || body.refreshToken;

		if (!refreshToken) {
			throw new HTTPException(401, { message: 'Refresh token required' });
		}

		const tokens = await AuthLogic.rotateRefreshToken(
			c,
			refreshToken,
			body.storeId
		);

		setRefreshCookie(c, tokens.refreshToken);

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
			throw new HTTPException(401, { message: 'Authentication required' });
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
			throw new HTTPException(403, { message: 'Not a manager of this store' });
		}

		const accessToken = await AuthLogic.generateStoreAccessToken(
			c.var.auth,
			storeId
		);

		return c.json({ accessToken });
	}
);

auth.post(
	'/logout',
	ipLimiter,
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
