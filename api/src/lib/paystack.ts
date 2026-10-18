import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/bun';

import { env } from '../config/env';
import { rootLogger } from '../services/logger';
import { instrument } from '../utils/instrument';

const API_URL = 'https://api.paystack.co';

const client = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`
	}
});

const REDACTED_KEYS = new Set([
	'authorization_code',
	'authorizationCode',
	'otp'
]);

const redact = (value: unknown): unknown => {
	if (Array.isArray(value)) {
		return value.map(redact);
	}

	if (value && typeof value === 'object') {
		const out: Record<string, unknown> = {};

		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			out[k] = REDACTED_KEYS.has(k) ? '[redacted]' : redact(v);
		}

		return out;
	}

	return value;
};

const withLogging = async <T>(
	operation: string,
	payload: unknown,
	fn: () => Promise<T>
): Promise<T> => {
	return instrument(
		'paystack',
		async () => {
			try {
				const result = await fn();
				rootLogger.debug({ operation }, 'paystack.ok');
				return result;
			} catch (error) {
				const axiosError = error as AxiosError;

				const logEntry = {
					operation,
					request: redact(payload),
					status: axiosError.response?.status,
					statusText: axiosError.response?.statusText,
					responseData: axiosError.response?.data,
					code: axiosError.code,
					message: axiosError.message
				};

				rootLogger.error(logEntry, 'paystack.failed');

				Sentry.captureException(error, {
					tags: { integration: 'paystack', operation },
					extra: logEntry
				});

				throw error;
			}
		},
		{ op: operation }
	);
};

interface ChargeAuthorizationOptions {
	authorizationCode: string;
	email: string;
	amount: string;
	metadata?: { orderId?: string };
}

export const chargeAuthorization = async (
	options: ChargeAuthorizationOptions
) => {
	const body = {
		authorization_code: options.authorizationCode,
		email: options.email,
		amount: options.amount,
		...(options.metadata && { metadata: options.metadata })
	};

	return withLogging('chargeAuthorization', body, async () => {
		const response = await client.post(
			'/transaction/charge_authorization',
			body
		);
		return response.data;
	});
};

interface InitializeTransactionOptions {
	email: string;
	amount: number;
	metadata?: {
		orderId?: string;
	};
}

export interface InitializeTransactionResponse {
	status: boolean;
	message: string;
	data: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
}

export const initializeTransaction = async (
	options: InitializeTransactionOptions
) => {
	const body = {
		email: options.email,
		amount: options.amount,
		...(options.metadata && { metadata: options.metadata })
	};

	return withLogging('initializeTransaction', body, async () => {
		const response = await client.post<InitializeTransactionResponse>(
			'/transaction/initialize',
			body
		);
		return response.data;
	});
};

interface TransferOptions {
	amount: string;
	reference: string;
	recipient: string;
	metadata?: {
		transactionId?: string;
	};
}

export const transfer = async (options: TransferOptions) => {
	const body = {
		source: 'balance',
		amount: options.amount,
		reference: options.reference,
		recipient: options.recipient,
		reason: 'Payout',
		...(options.metadata && { metadata: options.metadata })
	};

	return withLogging('transfer', body, async () => {
		const response = await client.post('/transfer', body);
		return response.data;
	});
};

export interface VerifyTransactionResponse {
	status: boolean;
	message: string;
	data: {
		id: number;
		status: string;
		reference: string;
		amount: number;
		channel: string;
		currency: string;
		metadata: { orderId?: string; bankTransfer?: boolean } | string | null;
		authorization: {
			authorization_code: string;
			bin: string;
			last4: string;
			exp_month: string;
			exp_year: string;
			channel: string;
			card_type: string;
			bank: string;
			country_code: string;
			brand: string;
			reusable: boolean;
			signature: string;
			account_name: string | null;
		};
		customer: { email: string };
	};
}

interface CreateBankTransferChargeOptions {
	email: string;
	amount: string;
	reference: string;
	accountExpiresAt: string;
	metadata?: { orderId: string; bankTransfer: true };
}

// POST /charge with `bank_transfer` returns the temporary account a shopper
// transfers to. This is Paystack Pay with Transfer, not a dedicated virtual account.
export interface BankTransferChargeResponse {
	status: boolean;
	message: string;
	data: {
		reference?: string;
		status?: string;
		display_text?: string;
		account_name?: string | null;
		account_number?: string | null;
		bank?: { slug?: string; name?: string; id?: number } | null;
		account_expires_at?: string | null;
		amount?: number;
		currency?: string;
	};
}

export const createBankTransferCharge = async (
	options: CreateBankTransferChargeOptions
) => {
	const body = {
		email: options.email,
		amount: options.amount,
		reference: options.reference,
		bank_transfer: {
			account_expires_at: options.accountExpiresAt
		},
		...(options.metadata && { metadata: options.metadata })
	};

	return withLogging('createBankTransferCharge', body, async () => {
		const response = await client.post<BankTransferChargeResponse>(
			'/charge',
			body
		);
		return response.data;
	});
};

export const verifyTransaction = async (reference: string) => {
	return withLogging('verifyTransaction', { reference }, async () => {
		const response = await client.get<VerifyTransactionResponse>(
			`/transaction/verify/${reference}`
		);
		return response.data;
	});
};

export interface VerifyTransferResponse {
	status: boolean;
	message: string;
	data: {
		status: string;
		reason: string;
		transfer_code: string;
	};
}

export const verifyTransfer = async (reference: string) => {
	return withLogging('verifyTransfer', { reference }, async () => {
		const response = await client.get<VerifyTransferResponse>(
			`/transfer/verify/${reference}`
		);
		return response.data;
	});
};

interface FinalizeTransferOptions {
	transferCode: string;
	otp: string;
}

export interface FinalizeTransferResponse {
	status: boolean;
	message: string;
	data: {
		status: string;
		reason: string;
		transfer_code: string;
	};
}

export const finalizeTransfer = async (options: FinalizeTransferOptions) => {
	const body = {
		transfer_code: options.transferCode,
		otp: options.otp
	};

	return withLogging('finalizeTransfer', body, async () => {
		const response = await client.post<FinalizeTransferResponse>(
			'/transfer/finalize_transfer',
			body
		);
		return response.data;
	});
};

interface ResolveAccountNumberOptions {
	accountNumber: string;
	bankCode: string;
}

export const resolveAccountNumber = async (
	options: ResolveAccountNumberOptions
) => {
	return withLogging('resolveAccountNumber', options, async () => {
		const response = await client.get(
			`/bank/resolve?account_number=${options.accountNumber}&bank_code=${options.bankCode}`
		);
		return response.data;
	});
};

interface CreateTransferRecipientOptions {
	name: string;
	accountNumber: string;
	bankCode: string;
}

// FIXME: Find out what the error shape looks like.
// For now, we're just checking that "status" is true, which doesn't really
// mean anything.
export interface CreateTransferRecipientResponse {
	status: boolean;
	message: string;
	data: {
		active: boolean;
		createdAt: string;
		currency: string;
		description: string | null;
		domain: string;
		email: string | null;
		id: number;
		integration: number;
		metadata: string | null;
		recipient_code: string;
		details: {
			authorization_code: string | null;
			account_number: string;
			account_name: string;
			bank_code: string;
			bank_name: string;
		};
	};
}

export const createTransferRecipient = async (
	options: CreateTransferRecipientOptions
) => {
	const body = {
		type: 'nuban',
		name: options.name,
		account_number: options.accountNumber,
		bank_code: options.bankCode,
		currency: 'NGN'
	};

	return withLogging('createTransferRecipient', body, async () => {
		const response = await client.post<CreateTransferRecipientResponse>(
			'/transferrecipient',
			body
		);
		return response.data;
	});
};

export const listBanks = async () => {
	return withLogging('listBanks', {}, async () => {
		const response = await client.get('/bank?currency=NGN');
		return response.data;
	});
};
