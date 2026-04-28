import { jwt } from 'hono/jwt';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import { env } from '../config/env';
import { isSessionDenied } from '../core/data/sessionRevocation';
import type { AppEnv } from '../types/hono';

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
			return next();
		}

		try {
			await jwtMiddleware(c, async () => {});
			const payload = c.get('jwtPayload');

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
			c.set('storeId', payload.storeId ?? c.req.header('x-market-store-id'));
			c.set('isAdmin', payload.role === 'admin');
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
export const authenticateProd = auth({
	required: env.NODE_ENV === 'production'
});
