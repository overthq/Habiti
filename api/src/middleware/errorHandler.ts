import type { Context } from 'hono';

import { APIException } from '../types/errors';
import { LogicError, logicErrorToApiException } from '../core/logic/errors';

export const errorHandler = (err: Error, c: Context) => {
	if (err instanceof LogicError) {
		const apiException = logicErrorToApiException(err.code);
		return c.json(
			{ message: apiException.message, errors: apiException.errors },
			apiException.statusCode as any
		);
	}

	if (err instanceof APIException) {
		return c.json(
			{ message: err.message, errors: err.errors },
			err.statusCode as any
		);
	}

	console.error('Unexpected error:', err);
	return c.json({ message: 'Internal server error' }, 500);
};
