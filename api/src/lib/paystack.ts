import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/bun';

import { env } from '../config/env';
import { rootLogger } from '../services/logger';
import { instrument } from '../utils/instrument';
import { paystackErrorCode, redactSensitive } from '../utils/redact';

const API_URL = 'https://api.paystack.co';

const client = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`
	}
});

/**
 * One redacted record goes to both sinks. Sentry extra does not pass through
 * Pino, so redacting only the logger argument would leave the raw body on the
 * issue.
 */
export const reportPaystackFailure = (
	operation: string,
	payload: unknown,
	error: unknown
) => {
	const axiosError = error as AxiosError;
	const responseData = axiosError.response?.data;
	const paystackCode = paystackErrorCode(responseData);

	const logEntry = redactSensitive({
		operation,
		request: payload,
		status: axiosError.response?.status,
		statusText: axiosError.response?.statusText,
		responseData,
		...(paystackCode ? { paystackCode } : {}),
		code: axiosError.code,
		message: axiosError.message
	});

	rootLogger.error(logEntry, 'paystack.failed');

	Sentry.captureException(error, {
		tags: { integration: 'paystack', operation },
		extra: logEntry
	});

	return logEntry;
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
				reportPaystackFailure(operation, payload, error);

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
		channel: string;
		currency: string;
		metadata: { orderId?: string } | string | null;
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
