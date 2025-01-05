import { Request, Response, NextFunction } from 'express';

import { APIException } from '../routes/types';

export const errorHandler = (
	err: Error,
	_: Request,
	res: Response,
	__: NextFunction
) => {
	if (err instanceof APIException) {
		return res.status(err.statusCode).json({
			status: 'error',
			message: err.message,
			errors: err.errors
		});
	}

	console.error(err);
	return res.status(500).json({
		status: 'error',
		message: 'Internal server error'
	});
};
