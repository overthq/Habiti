import type { Context } from 'hono';
import * as Sentry from '@sentry/bun';

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

	Sentry.captureException(err, scope => {
		scope.setContext('request', {
			method: c.req.method,
			path: c.req.path,
			requestId: c.req.header('x-request-id') ?? null
		});

		const auth = (c as Context<any>).var?.auth;

		if (auth?.id) {
			scope.setUser({ id: auth.id, email: auth.email });
		}

		return scope;
	});

	console.error('Unexpected error:', err);

	return c.json({ message: 'Internal server error' }, 500);
};
