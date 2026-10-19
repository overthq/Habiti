import type { Context, ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { LogicError, logicErrorToApiException } from '../core/logic/errors';
import { captureException } from '../services/errorReporting';
import { AppEnv } from '../types/hono';
import { rootLogger } from '../services/logger';
import { metrics, MetricNames } from '../services/metrics';

export const errorHandler: ErrorHandler = (err, c) => {
	const ctx = c as Context<AppEnv>;
	const logger = ctx.var?.logger ?? rootLogger;

	if (err instanceof LogicError) {
		const apiException = logicErrorToApiException(err.code);

		metrics.inc(MetricNames.ErrorsByClass, {
			class: 'logic',
			code: err.code,
			status: apiException.status
		});

		logger.warn({ code: err.code, status: apiException.status }, 'logic_error');

		return c.json({ message: apiException.message }, apiException.status);
	}

	if (err instanceof HTTPException) {
		metrics.inc(MetricNames.ErrorsByClass, {
			class: 'http',
			status: err.status
		});

		if (err.status >= 500) {
			logger.error({ err, status: err.status }, 'http_error');
		} else {
			logger.warn({ status: err.status, msg: err.message }, 'http_error');
		}

		return c.json({ message: err.message }, err.status);
	}

	metrics.inc(MetricNames.ErrorsByClass, {
		class: 'unhandled',
		status: 500
	});

	const auth = ctx.var?.auth;
	const user = auth?.id
		? auth.email
			? { id: auth.id, email: auth.email }
			: { id: auth.id }
		: undefined;

	captureException(err, {
		contexts: {
			request: {
				method: c.req.method,
				path: c.req.path,
				requestId: ctx.var?.requestId ?? null,
				traceId: ctx.var?.traceId ?? null
			}
		},
		...(user ? { user } : {})
	});

	logger.error({ err }, 'unexpected_error');

	return c.json({ message: 'Internal server error' }, 500);
};
