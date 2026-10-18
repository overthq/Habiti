/**
 * Call-site hook for `order.create`, Paystack webhooks, and similar work.
 * It runs `fn` and does not emit a span.
 *
 * Sentry is the trace backend (`config/sentry.ts`): when `SENTRY_DSN` is
 * set, `@sentry/bun` records `Bun.serve` HTTP spans and Prisma spans.
 * Outbound duration and error counts stay in `utils/instrument.ts`.
 */
export interface Tracer {
	startSpan<T>(
		name: string,
		fn: () => Promise<T>,
		attributes?: Record<string, string | number | boolean | undefined>
	): Promise<T>;
}

export const tracer: Tracer = {
	async startSpan(_name, fn) {
		return fn();
	}
};
