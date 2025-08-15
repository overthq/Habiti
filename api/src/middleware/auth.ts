import { Request, Response, NextFunction } from 'express';

import { APIException } from '../routes/types';
import { verifyAccessToken } from '../utils/auth';
import { env } from '../config/env';

type AuthOptions = {
	required?: boolean;
	adminOnly?: boolean;
};

export const auth = (options: AuthOptions = {}) => {
	const { required = true, adminOnly = false } = options;

	return async (req: Request, _: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization?.split(' ')[1];

			if (!token) {
				if (required) {
					throw new APIException(401, 'Authentication required');
				}
				// For optional auth, just continue without setting req.auth
				return next();
			}

			const decoded = await verifyAccessToken(token);

			if (adminOnly && (decoded as any).role !== 'admin') {
				throw new APIException(403, 'Forbidden');
			}

			req.auth = decoded as any;
			next();
		} catch (error) {
			if (required) {
				next(new APIException(401, 'Invalid or expired token'));
			} else {
				// For optional auth, continue even if token is invalid
				next();
			}
		}
	};
};

export const authenticate = auth({ required: true });
export const optionalAuth = auth({ required: false });
export const isAdmin = auth({ required: true, adminOnly: true });
export const authenticateProd = auth({
	required: env.NODE_ENV === 'production'
});
