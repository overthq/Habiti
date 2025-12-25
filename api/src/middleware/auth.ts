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
		if (!required) {
			return next();
		}

		try {
			const token = req.headers.authorization?.split(' ')[1];

			if (!token) {
				throw new APIException(401, 'Authentication required');
			}

			const decodedResult = await AuthLogic.verifyAccessToken(token);
			if (!decodedResult.ok) {
				throw new APIException(401, 'Invalid or expired token');
			}
			const decoded = decodedResult.data;

			if (adminOnly && (decoded as any).role !== 'admin') {
				throw new APIException(403, 'Forbidden');
			}

			req.auth = decoded as any;
			next();
		} catch (error) {
			next(new APIException(401, 'Invalid or expired token'));
		}
	};
};

export const authenticate = auth({ required: true });
export const optionalAuth = auth({ required: false });
export const isAdmin = auth({ required: true, adminOnly: true });
export const authenticateProd = auth({
	required: env.NODE_ENV === 'production'
});
