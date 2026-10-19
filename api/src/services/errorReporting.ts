import * as Sentry from '@sentry/bun';

/**
 * Habiti's error-reporting port. Call sites pass context that is already
 * safe to store (Paystack extras are redacted before they get here).
 * Today this forwards to Sentry. With no `Sentry.init`, `captureException`
 * returns without sending; the caller has already logged the failure.
 */
export type ErrorReportUser = {
	id: string;
	email?: string;
};

export type ErrorReport = {
	tags?: Record<string, string | number | boolean>;
	extra?: object;
	user?: ErrorReportUser;
	contexts?: Record<string, Record<string, unknown>>;
};

export const captureException = (
	error: unknown,
	report?: ErrorReport
): void => {
	Sentry.captureException(error, {
		...(report?.tags ? { tags: report.tags } : {}),
		...(report?.extra
			? { extra: report.extra as Record<string, unknown> }
			: {}),
		...(report?.user ? { user: report.user } : {}),
		...(report?.contexts ? { contexts: report.contexts } : {})
	});
};
