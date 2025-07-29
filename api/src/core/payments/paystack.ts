import axios from 'axios';

const API_URL = 'https://api.paystack.co';

const client = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
	}
});

interface ChargeAuthorizationOptions {
	authorizationCode: string;
	email: string;
	amount: string;
}

export const chargeAuthorization = async (
	options: ChargeAuthorizationOptions
) => {
	const response = await client.post('/transaction/charge_authorization', {
		authorization_code: options.authorizationCode,
		email: options.email,
		amount: options.amount
	});

	return response.data;
};

interface InitializeTransactionOptions {
	email: string;
	amount: number;
	metadata?: {
		orderId?: string;
	};
}

export const initializeTransaction = async (
	options: InitializeTransactionOptions
) => {
	const response = await client.post('/transaction/initialize', {
		email: options.email,
		amount: options.amount,
		...(options.metadata && { metadata: options.metadata })
	});

	return response.data;
};

interface TransferOptions {
	amount: string;
	reference: string;
	recipient: string;
	metadata?: {
		payoutId?: string;
	};
}

export const transfer = async (options: TransferOptions) => {
	const response = await client.post('/transfer', {
		source: 'balance',
		amount: options.amount,
		reference: options.reference,
		recipient: options.recipient,
		reason: 'Payout',
		...(options.metadata && { metadata: options.metadata })
	});

	return response.data;
};

interface VerifyTransactionResponse {
	status: boolean;
	message: string;
	data: {
		id: number;
		status: string;
		reference: string;
		channel: string;
		currency: string;
		metadata?: { orderId?: string } | string | null;
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
	const response = await client.get<VerifyTransactionResponse>(
		`/transaction/verify/${reference}`
	);

	return response.data;
};

export const verifyTransfer = async (transferId: string) => {
	const response = await client.get(`/transfer/verify/${transferId}`);

	return response.data;
};

interface ResolveAccountNumberOptions {
	accountNumber: string;
	bankCode: string;
}

export const resolveAccountNumber = async (
	options: ResolveAccountNumberOptions
) => {
	const response = await client.get(
		`/bank/resolve?account_number=${options.accountNumber}&bank_code=${options.bankCode}`
	);

	return response.data;
};

interface CreateTransferReceipientOptions {
	name: string;
	accountNumber: string;
	bankCode: string;
}

// FIXME: Find out what the error shape looks like.
// For now, we're just checking that "status" is true, which doesn't really
// mean anything.
export interface CreateTransferReceipientResponse {
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

export const createTransferReceipient = async (
	options: CreateTransferReceipientOptions
) => {
	const response = await client.post<CreateTransferReceipientResponse>(
		'/transferrecipient',
		{
			type: 'nuban',
			name: options.name,
			account_number: options.accountNumber,
			bank_code: options.bankCode,
			currency: 'NGN'
		}
	);

	return response.data;
};

export const listBanks = async () => {
	const response = await client.get('/bank?currency=NGN');

	return response.data;
};
