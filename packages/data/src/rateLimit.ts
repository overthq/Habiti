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
const parseRetryAfter = (headerValue: string | undefined): number | null => {
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
const AUTO_RETRY_MAX_SEC = 2;

/**
 * Whether to auto-retry a 429 given the parsed delay.
 *
 * Rules:
 *   - `null` or negative delay  → don't retry (we don't know how long).
 *   - `0` seconds               → retry with a small jittered floor (the
 *                                 server may be at the boundary).
 *   - `(0, AUTO_RETRY_MAX_SEC]` → retry.
 *   - Anything larger           → surface to UI.
 *
 * Surfaced 429s end up with `error.retryAfterSeconds` set so a toast can
 * read it. The interceptor is responsible for tagging only one retry per
 * request via a `_rateLimitRetry` flag.
 */
export const shouldAutoRetry = (delaySec: number | null): boolean => {
	if (delaySec === null) return false;
	if (delaySec < 0) return false;
	return delaySec <= AUTO_RETRY_MAX_SEC;
};

/**
 * Compute the actual delay before retrying. Adds full jitter on top of
 * the server-suggested value to spread out a thundering herd of clients
 * that all received the same `Retry-After`. Min floor of 50ms so we
 * don't burn the CPU on `0`-second responses.
 */
export const computeRetryDelayMs = (delaySec: number): number => {
	const baseMs = Math.max(0, delaySec) * 1000;
	const jitterMs = Math.floor(Math.random() * 250);
	return Math.max(50, baseMs + jitterMs);
};

export const sleep = (ms: number) =>
	new Promise<void>(resolve => setTimeout(resolve, ms));
