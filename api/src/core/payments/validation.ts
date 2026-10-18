import z from 'zod';

export const eventIdSchema = z.union([z.number(), z.string()]).optional();

export const TransferSuccessSchema = z.object({
	id: eventIdSchema,
	reference: z.string(),
	reason: z.string().optional().nullable()
});

export const TransferFailureSchema = z.object({
	id: eventIdSchema,
	reference: z.string(),
	reason: z.string().optional().nullable()
});

export const TransferReversedSchema = z.object({
	id: eventIdSchema,
	reference: z.string()
});

export type TransferSuccessPayload = z.infer<typeof TransferSuccessSchema>;
export type TransferFailurePayload = z.infer<typeof TransferFailureSchema>;
export type TransferReversedPayload = z.infer<typeof TransferReversedSchema>;

export const CardAuthorizationSchema = z.object({
	authorization_code: z.string(),
	card_type: z.string(),
	last4: z.string(),
	exp_month: z.string(),
	exp_year: z.string(),
	bin: z.string(),
	bank: z.string(),
	channel: z.string(),
	signature: z.string(),
	reusable: z.boolean(),
	country_code: z.string(),
	account_name: z.string().nullable()
});

export const TransferAuthorizationSchema = z.object({
	authorization_code: z.string(),
	bin: z.string(),
	last4: z.string(),
	exp_month: z.string(),
	exp_year: z.string(),
	card_type: z.literal('transfer'),
	bank: z.string(),
	country_code: z.string(),
	brand: z.string(),
	reusable: z.boolean(),
	sender_bank: z.string(),
	sender_bank_account_number: z.string(),
	sender_country: z.string(),
	sender_name: z.string(),
	narration: z.string(),
	receiver_bank_account_number: z.string(),
	receiver_bank: z.string()
});

export const CardChargeMetadataSchema = z.union([
	z.object({
		userId: z.string().optional().nullable(),
		orderId: z.string().optional().nullable()
	}),
	z.string()
]);

export const CardChargeSuccessSchema = z.object({
	id: eventIdSchema,
	customer: z.object({ email: z.string() }), // I don't know if this is actually supplied.
	authorization: CardAuthorizationSchema,
	metadata: CardChargeMetadataSchema.nullable()
});

export const TransferChargeSuccessSchema = z.object({
	id: eventIdSchema,
	authorization: TransferAuthorizationSchema,
	metadata: CardChargeMetadataSchema
});

export type CardChargeSuccessPayload = z.infer<typeof CardChargeSuccessSchema>;
export type TransferChargeSuccessPayload = z.infer<
	typeof TransferChargeSuccessSchema
>;

export type ChargeSuccessPayload =
	| CardChargeSuccessPayload
	| TransferChargeSuccessPayload;

export const isTransferCharge = (
	data: ChargeSuccessPayload
): data is TransferChargeSuccessPayload => {
	return data.authorization.card_type === 'transfer';
};

/**
 * Checkout Pay with Transfer (`bank_transfer`) uses a temporary account.
 * Dedicated virtual accounts (`dedicated_nuban`) are a different product
 * and are not fulfilled here.
 */
export const CHECKOUT_BANK_TRANSFER_CHANNEL = 'bank_transfer';
export const DEDICATED_NUBAN_CHANNEL = 'dedicated_nuban';

const NON_CARD_CHANNELS = new Set([
	CHECKOUT_BANK_TRANSFER_CHANNEL,
	DEDICATED_NUBAN_CHANNEL
]);

export interface PaystackChargeData {
	amount?: unknown;
	reference?: unknown;
	channel?: unknown;
	currency?: unknown;
	metadata?: unknown;
	gateway_response?: unknown;
	message?: unknown;
	reason?: unknown;
	customer?: { email?: string | null } | null;
	authorization?: {
		card_type?: string | null;
		channel?: string | null;
		authorization_code?: string;
		signature?: string | null;
		bin?: string;
		last4?: string;
		exp_month?: string;
		exp_year?: string;
		bank?: string | null;
		country_code?: string;
		account_name?: string | null;
	} | null;
}

/**
 * Paystack delivers `metadata` as an object, a JSON string, an empty string,
 * or occasionally a non-object (`0`). Only an object with `orderId` identifies
 * a Habiti order.
 */
export const parsePaystackMetadata = (
	metadata: unknown,
	depth = 0
): Record<string, unknown> | null => {
	if (depth > 2 || metadata == null) return null;

	if (typeof metadata === 'string') {
		const trimmed = metadata.trim();
		if (!trimmed) return null;

		try {
			return parsePaystackMetadata(JSON.parse(trimmed), depth + 1);
		} catch {
			return null;
		}
	}

	if (typeof metadata === 'object' && !Array.isArray(metadata)) {
		return metadata as Record<string, unknown>;
	}

	return null;
};

export const orderIdFromPaystackMetadata = (
	metadata: unknown
): string | null => {
	const orderId = parsePaystackMetadata(metadata)?.orderId;

	if (typeof orderId !== 'string') return null;

	const trimmed = orderId.trim();
	return trimmed.length > 0 ? trimmed : null;
};

/** Charge amounts are integer kobo. Floats are refused rather than rounded. */
export const paystackAmountKobo = (amount: unknown): number | null => {
	if (typeof amount === 'number' && Number.isInteger(amount) && amount >= 0) {
		return amount;
	}

	if (typeof amount === 'string' && /^[0-9]+$/.test(amount)) {
		return Number(amount);
	}

	return null;
};

export const paystackReference = (
	data: { reference?: unknown } | null | undefined
): string | null =>
	typeof data?.reference === 'string' && data.reference.length > 0
		? data.reference
		: null;

export const paystackCurrency = (
	data: { currency?: unknown } | null | undefined
): string | null =>
	typeof data?.currency === 'string' && data.currency.length > 0
		? data.currency
		: null;

export const paystackChargeChannel = (
	data:
		| {
				channel?: unknown;
				authorization?: { channel?: unknown } | null;
		  }
		| null
		| undefined
): string | null => {
	const authorizationChannel = data?.authorization?.channel;

	if (
		typeof authorizationChannel === 'string' &&
		authorizationChannel.length > 0
	) {
		return authorizationChannel;
	}

	if (typeof data?.channel === 'string' && data.channel.length > 0) {
		return data.channel;
	}

	return null;
};

export const paystackFailureReason = (
	data:
		| {
				gateway_response?: unknown;
				message?: unknown;
				reason?: unknown;
		  }
		| null
		| undefined
): string | null => {
	for (const value of [data?.gateway_response, data?.message, data?.reason]) {
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim();
		}
	}

	return null;
};

export const isDedicatedNubanCharge = (
	data: PaystackChargeData | null | undefined
): boolean => paystackChargeChannel(data) === DEDICATED_NUBAN_CHANNEL;

/**
 * Transfer instruments must not be stored as reusable cards. Checkout
 * `bank_transfer` and DVA `dedicated_nuban` both report `card_type: "transfer"`.
 */
export const isNonCardCharge = (
	data: PaystackChargeData | null | undefined
): boolean => {
	if (!data) return false;
	if (data.authorization?.card_type === 'transfer') return true;

	const channel = paystackChargeChannel(data);
	return channel != null && NON_CARD_CHANNELS.has(channel);
};
