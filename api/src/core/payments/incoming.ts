/**
 * Turns a Paystack charge or transfer-rejection payload into the shape the
 * payment logic understands. Wire details (metadata as a string, channel
 * names, snake_case card fields) stay in this file.
 */

const CHECKOUT_BANK_TRANSFER_CHANNEL = 'bank_transfer';
const DEDICATED_NUBAN_CHANNEL = 'dedicated_nuban';

export type ChargeInstrument = 'card' | 'transfer' | 'dedicated_account';

export interface StoredCardCharge {
	email: string;
	signature: string;
	authorizationCode: string;
	bin: string;
	last4: string;
	expMonth: string;
	expYear: string;
	bank: string;
	cardType: string;
	countryCode: string;
}

export interface IncomingCharge {
	orderId: string | null;
	amount: number | null;
	currency: string | null;
	reference: string | null;
	instrument: ChargeInstrument;
	card: StoredCardCharge | null;
}

export interface IncomingTransferRejection {
	orderId: string | null;
	amount: number | null;
	reference: string | null;
	reason: string | null;
	instrument: ChargeInstrument;
}

const record = (value: unknown): Record<string, unknown> | null => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
	return value as Record<string, unknown>;
};

const text = (value: unknown): string | null => {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
};

const metadataRecord = (
	metadata: unknown,
	depth = 0
): Record<string, unknown> | null => {
	if (depth > 2 || metadata == null) return null;

	if (typeof metadata === 'string') {
		const trimmed = metadata.trim();
		if (!trimmed) return null;

		try {
			return metadataRecord(JSON.parse(trimmed), depth + 1);
		} catch {
			return null;
		}
	}

	return record(metadata);
};

const orderIdFrom = (metadata: unknown): string | null =>
	text(metadataRecord(metadata)?.orderId);

/** Integer subunit amounts only. Floats are refused rather than rounded. */
const amountFrom = (amount: unknown): number | null => {
	if (typeof amount === 'number' && Number.isInteger(amount) && amount >= 0) {
		return amount;
	}

	if (typeof amount === 'string' && /^[0-9]+$/.test(amount)) {
		return Number(amount);
	}

	return null;
};

const channelFrom = (
	body: Record<string, unknown>,
	authorization: Record<string, unknown> | null
): string | null => text(authorization?.channel) ?? text(body.channel);

const instrumentFrom = (
	body: Record<string, unknown>,
	authorization: Record<string, unknown> | null
): ChargeInstrument => {
	const channel = channelFrom(body, authorization);

	if (channel === DEDICATED_NUBAN_CHANNEL) return 'dedicated_account';

	if (
		authorization?.card_type === 'transfer' ||
		channel === CHECKOUT_BANK_TRANSFER_CHANNEL
	) {
		return 'transfer';
	}

	return 'card';
};

const cardFrom = (
	body: Record<string, unknown>,
	authorization: Record<string, unknown> | null
): StoredCardCharge => ({
	email: text(record(body.customer)?.email) ?? '',
	signature: text(authorization?.signature) ?? '',
	authorizationCode: text(authorization?.authorization_code) ?? '',
	bin: text(authorization?.bin) ?? '',
	last4: text(authorization?.last4) ?? '',
	expMonth: text(authorization?.exp_month) ?? '',
	expYear: text(authorization?.exp_year) ?? '',
	bank: text(authorization?.bank) ?? '',
	cardType: text(authorization?.card_type) ?? '',
	countryCode: text(authorization?.country_code) ?? ''
});

const reasonFrom = (body: Record<string, unknown>): string | null => {
	for (const value of [body.gateway_response, body.message, body.reason]) {
		const reason = text(value);
		if (reason) return reason;
	}

	return null;
};

export const readIncomingCharge = (data: unknown): IncomingCharge => {
	const body = record(data) ?? {};
	const authorization = record(body.authorization);
	const instrument = instrumentFrom(body, authorization);

	return {
		orderId: orderIdFrom(body.metadata),
		amount: amountFrom(body.amount),
		currency: text(body.currency),
		reference: text(body.reference),
		instrument,
		card: instrument === 'card' ? cardFrom(body, authorization) : null
	};
};

export const readTransferRejection = (
	data: unknown
): IncomingTransferRejection => {
	const body = record(data) ?? {};
	const authorization = record(body.authorization);

	return {
		orderId: orderIdFrom(body.metadata),
		amount: amountFrom(body.amount),
		reference: text(body.reference),
		reason: reasonFrom(body),
		instrument: instrumentFrom(body, authorization)
	};
};
