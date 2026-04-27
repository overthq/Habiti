/**
 * Parses an HTTP `Retry-After` or RFC-6585 / IETF draft-7 `RateLimit-Reset`
 * header into a delay in seconds. Returns `null` if the header is absent or
 * unparseable so callers can fall back to surfacing the error.
 *
 * `Retry-After` per RFC 7231 may be:
 *   - A non-negative integer (seconds until retry).
 *   - An HTTP-date (absolute time at which retry is allowed).
 *
 * `RateLimit-Reset` per the IETF draft is a non-negative integer (seconds
 * until the rate-limit window resets). Our API emits it via `hono-rate-limiter`.
 */
export const parseRetryAfter = (
	headerValue: string | undefined
): number | null => {
	if (!headerValue) return null;

	const trimmed = String(headerValue).trim();
	if (!trimmed) return null;

	const asNumber = Number(trimmed);
	if (Number.isFinite(asNumber) && asNumber >= 0) {
		return Math.ceil(asNumber);
	}

	const asDate = Date.parse(trimmed);
	if (!Number.isNaN(asDate)) {
		const delta = Math.ceil((asDate - Date.now()) / 1000);
		return delta > 0 ? delta : 0;
	}

	return null;
};

/** Pull the most authoritative rate-limit-reset hint from a response. */
export const extractRetryAfterSec = (headers: {
	get?: (k: string) => string | null;
	[k: string]: any;
}): number | null => {
	// Axios uses lowercased header keys; fetch's `Headers` exposes `.get()`.
	const read = (name: string): string | undefined => {
		if (typeof headers.get === 'function') {
			return headers.get(name) ?? undefined;
		}
		return headers[name] ?? headers[name.toLowerCase()];
	};

	return (
		parseRetryAfter(read('retry-after')) ??
		parseRetryAfter(read('ratelimit-reset'))
	);
};

/**
 * Auto-retry budget. Anything longer than this — surface the error to the
 * UI instead of silently blocking. Auth endpoints typically have 60s
 * windows; we don't want to hang the app for a minute.
 */
export const AUTO_RETRY_MAX_SEC = 2;

export const sleep = (ms: number) =>
	new Promise<void>(resolve => setTimeout(resolve, ms));
