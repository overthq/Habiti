import { jwt } from 'hono/jwt';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';

import { env } from '../config/env';
import { isSessionDenied } from '../core/data/sessions';
import type { AppEnv } from '../types/hono';

// logsMiddleware binds request ids before auth runs. Once auth knows a user
// or store id, swap in one child that adds just those. Skip an id already
// on the logger so a second pass does not duplicate keys. No id means the
// pre-auth logger stays in place.
const bindRequestLogger = (c: Context<AppEnv>) => {
	const logger = c.var.logger;

	if (!logger) return;

	const userId = c.var.auth?.id;
	const storeId = c.var.storeId;
	const current = logger.bindings();
	const bindings: Record<string, string> = {};

	if (
		typeof userId === 'string' &&
		userId.length > 0 &&
		current.userId !== userId
	) {
		bindings.userId = userId;
	}

	if (
		typeof storeId === 'string' &&
		storeId.length > 0 &&
		current.storeId !== storeId
	) {
		bindings.storeId = storeId;
	}

	if (Object.keys(bindings).length === 0) return;

	c.set('logger', logger.child(bindings));
};

type AuthOptions = {
	required?: boolean;
	adminOnly?: boolean;
};

const jwtMiddleware = jwt({ secret: env.JWT_SECRET, alg: 'HS256' });

export const auth = (options: AuthOptions = {}) => {
	const { required = true, adminOnly = false } = options;

	return createMiddleware<AppEnv>(async (c, next) => {
		const token = c.req.header('authorization')?.split(' ')[1];

		if (!token) {
			if (required) {
				throw new HTTPException(401, { message: 'Authentication required' });
			}
			c.set('storeId', c.req.header('x-market-store-id'));
			bindRequestLogger(c);
			return next();
		}

		try {
			await jwtMiddleware(c, async () => {});
			const payload = c.get('jwtPayload');

			// Ensure only access tokens are accepted.
			if (payload.typ !== 'access') {
				throw new HTTPException(401, { message: 'Invalid or expired token' });
			}

			if (adminOnly && payload.role !== 'admin') {
				throw new HTTPException(403, { message: 'Forbidden' });
			}

			// Check if session is still valid
			if (payload.sessionId) {
				const denied = await isSessionDenied(c.var.redis, payload.sessionId);

				if (denied) {
					throw new HTTPException(401, { message: 'Session revoked' });
				}
			}

			c.set('auth', payload);
			c.set('storeId', payload.storeId);
			c.set('isAdmin', payload.role === 'admin');

			bindRequestLogger(c);

			return next();
		} catch (error) {
			if (error instanceof HTTPException) throw error;
			throw new HTTPException(401, { message: 'Invalid or expired token' });
		}
	});
};

export const authenticate = auth({ required: true });
export const optionalAuth = auth({ required: false });
export const isAdmin = auth({ required: true, adminOnly: true });

export const requireFullAccount = createMiddleware<AppEnv>(async (c, next) => {
	if (c.var.auth?.anonymous) {
		throw new HTTPException(403, {
			message: 'A full account is required for this action'
		});
	}

	return next();
});

export const authenticateProd = auth({
	required: env.NODE_ENV === 'production'
});
