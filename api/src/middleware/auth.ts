import { Request, Response, NextFunction } from 'express';

import { APIException } from '../types/errors';
import { env } from '../config/env';
import * as AuthLogic from '../core/logic/auth';

type AuthOptions = {
	required?: boolean;
	adminOnly?: boolean;
};

export const auth = (options: AuthOptions = {}) => {
	const { required = true, adminOnly = false } = options;

	return async (req: Request, _: Response, next: NextFunction) => {
		const token = req.headers.authorization?.split(' ')[1];

		// No token provided
		if (!token) {
			if (required) {
				return next(new APIException(401, 'Authentication required'));
			}
			// Optional auth with no token - proceed as anonymous
			return next();
		}

		// Token was provided - must be valid (regardless of `required`)
		try {
			const decoded = await AuthLogic.verifyAccessToken(token);

			if (adminOnly && (decoded as any).role !== 'admin') {
				return next(new APIException(403, 'Forbidden'));
			}

			req.auth = decoded as any;
			return next();
		} catch (error) {
			// Token provided but invalid/expired - always return 401
			// This allows the client to refresh the token and retry
			return next(new APIException(401, 'Invalid or expired token'));
		}
	};
};

export const authenticate = auth({ required: true });
export const optionalAuth = auth({ required: false });
export const isAdmin = auth({ required: true, adminOnly: true });
export const authenticateProd = auth({
	required: env.NODE_ENV === 'production'
});
