/**
 * Copies a payment or payout value with secrets removed. Callers pass the
 * result to every sink (Pino and Sentry extra). Pino's redact list does not
 * see Sentry extra, and its `*` wildcard is only one object level.
 *
 * The input is never mutated. Walks objects and arrays, stops at cycles, and
 * gives up at `MAX_DEPTH` rather than logging the raw remainder.
 *
 * A bare `code` is kept. Axios uses it for transport failures
 * (`ERR_BAD_REQUEST`) and Paystack uses it for API failures (`invalid_params`).
 * Credentials in these payloads are `authorization_code`, `access_code`, and
 * `otp`, not `code`.
 *
 * `bank_code` / `bankCode` are kept. They are public bank identifiers, and a
 * failed account resolve is much harder to debug without them. The account
 * number is the secret half.
 */

export const REDACTED = '[REDACTED]';

const CIRCULAR = '[Circular]';

const MAX_DEPTH = 8;

const SECRET_KEYS = new Set([
	'authorization_code',
	'authorizationCode',
	'access_code',
	'accessCode',
	'authorization_url',
	'authorizationUrl',
	'otp',
	'account_number',
	'accountNumber',
	'sender_bank_account_number',
	'receiver_bank_account_number',
	'account_name',
	'accountName',
	'name',
	'sender_name',
	'senderName',
	'first_name',
	'firstName',
	'last_name',
	'lastName',
	'phone'
]);

const EMAIL_KEYS = new Set(['email']);

const EMAIL_PATTERN = /^([^@\s]+)@([^@\s]+\.[^@\s]+)$/;

/**
 * Keeps the domain and the first character of the local part so two failures
 * can still be told apart. Anything that is not an email becomes `[REDACTED]`.
 */
export const maskEmail = (value: unknown): string => {
	if (typeof value !== 'string') return REDACTED;

	const match = EMAIL_PATTERN.exec(value.trim());
	const local = match?.[1];
	const domain = match?.[2];

	if (!local || !domain) return REDACTED;

	return `${local.slice(0, 1)}***@${domain}`;
};

const isPlainObject = (value: object): boolean => {
	const proto = Object.getPrototypeOf(value);

	return proto === Object.prototype || proto === null;
};

const walk = (
	value: unknown,
	seen: WeakSet<object>,
	depth: number
): unknown => {
	if (value === null || typeof value !== 'object') return value;

	if (depth >= MAX_DEPTH) return REDACTED;

	if (seen.has(value)) return CIRCULAR;

	if (!Array.isArray(value) && !isPlainObject(value)) return value;

	seen.add(value);

	try {
		if (Array.isArray(value)) {
			return value.map(item => walk(item, seen, depth + 1));
		}

		const out: Record<string, unknown> = {};

		for (const [key, nested] of Object.entries(
			value as Record<string, unknown>
		)) {
			if (SECRET_KEYS.has(key)) {
				out[key] = REDACTED;
			} else if (EMAIL_KEYS.has(key)) {
				out[key] = maskEmail(nested);
			} else {
				out[key] = walk(nested, seen, depth + 1);
			}
		}

		return out;
	} finally {
		seen.delete(value);
	}
};

export const redactSensitive = <T>(value: T): T => {
	return walk(value, new WeakSet(), 0) as T;
};

/**
 * Top-level `code` on a Paystack error body. Hoist this next to the body:
 * Pino's existing `*.code` path censors a one-level `code`, which is exactly
 * `responseData.code` / `paystackResponse.code`.
 */
export const paystackErrorCode = (body: unknown): string | undefined => {
	if (!body || typeof body !== 'object' || Array.isArray(body)) return undefined;

	const code = (body as Record<string, unknown>).code;

	return typeof code === 'string' ? code : undefined;
};

/**
 * Fields safe to log from a thrown error. Pino's err serializer copies every
 * enumerable property, and Axios `toJSON` then includes `config.headers`
 * (the Paystack bearer token) and `config.data`. Pass this object to the
 * logger instead of `{ err }`.
 */
export const errorForLog = (
	error: unknown
): {
	errorName?: string;
	message?: string;
	code?: string;
	status?: number;
	stack?: string;
} => {
	if (!error || typeof error !== 'object') {
		return typeof error === 'string' ? { message: error } : {};
	}

	const record = error as Record<string, unknown>;
	const response = record.response;
	const responseStatus =
		response && typeof response === 'object'
			? (response as { status?: unknown }).status
			: undefined;
	const status =
		typeof responseStatus === 'number'
			? responseStatus
			: typeof record.status === 'number'
				? record.status
				: undefined;

	const out: {
		errorName?: string;
		message?: string;
		code?: string;
		status?: number;
		stack?: string;
	} = {};

	if (typeof record.name === 'string') out.errorName = record.name;
	if (typeof record.message === 'string') out.message = record.message;
	if (typeof record.code === 'string') out.code = record.code;
	if (typeof record.stack === 'string') out.stack = record.stack;
	if (status !== undefined) out.status = status;

	return out;
};
