import { Request, Response, NextFunction } from 'express';

import { APIException } from '../types/errors';

export const requireStoreContext = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	const storeId = req.auth?.storeId ?? req.headers['x-market-store-id'];

	if (!storeId) {
		return next(
			new APIException(
				400,
				'Store context required. Use POST /auth/switch-store to set active store.'
			)
		);
	}

	return next();
};
