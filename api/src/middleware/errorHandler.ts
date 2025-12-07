import { Request, Response, NextFunction } from 'express';

import { APIException } from '../types/errors';

/**
 * Global error handler middleware for Express.
 * Handles APIException errors and returns them as JSON responses.
 * Must be registered after all routes.
 */
export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (err instanceof APIException) {
		return res.status(err.statusCode).json({
			message: err.message,
			errors: err.errors
		});
	}

	// For unexpected errors, return a generic 500 response
	console.error('Unexpected error:', err);
	return res.status(500).json({
		message: 'Internal server error'
	});
};
