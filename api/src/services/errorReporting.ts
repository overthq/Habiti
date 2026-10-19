import * as Sentry from '@sentry/bun';

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
