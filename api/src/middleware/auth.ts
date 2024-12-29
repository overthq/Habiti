import { Request, Response, NextFunction } from 'express';

import { APIException } from '../routes/types';
import { verifyToken } from '../utils/auth';

export const authenticate = async (
	req: Request,
	_: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			throw new APIException(401, 'Authentication required');
		}

		const decoded = await verifyToken(token);
		req.auth = decoded as any;
		next();
	} catch (error) {
		next(new APIException(401, 'Invalid or expired token'));
	}
};

export const optionalAuth = async (
	req: Request,
	_: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (token) {
			const decoded = await verifyToken(token);
			req.auth = decoded as any;
		}
		next();
	} catch (error) {
		next();
	}
};
