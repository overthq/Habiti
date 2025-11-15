import axios from 'axios';
import { env } from '../../config/env';

const API_URL = 'https://api.paystack.co';

const client = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`
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
	const response = await client.post<InitializeTransactionResponse>(
		'/transaction/initialize',
		{
			email: options.email,
			amount: options.amount,
			...(options.metadata && { metadata: options.metadata })
		}
	);

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

// {
//   status: true,
//   message: 'Transfer retrieved',
//   data: {
//     amount: 200000,
//     createdAt: '2025-07-29T08:12:37.000Z',
//     currency: 'NGN',
//     domain: 'test',
//     failures: null,
//     id: 857012583,
//     integration: 720234,
//     reason: 'Payout',
//     reference: '93c8e1ef-3ab6-4eab-acd9-804a2096ada1',
//     source: 'balance',
//     source_details: null,
//     status: 'abandoned',
//     titan_code: null,
//     transfer_code: 'TRF_v2yinnxx82pkqdwt',
//     request: 1063383178,
//     transferred_at: null,
//     updatedAt: '2025-07-29T09:13:51.000Z',
//     recipient: {
//       active: true,
//       createdAt: '2025-07-29T01:07:28.000Z',
//       currency: 'NGN',
//       description: null,
//       domain: 'test',
//       email: null,
//       id: 108397942,
//       integration: 720234,
//       metadata: null,
//       name: 'Korede Fashokun',
//       recipient_code: 'RCP_jc74mmlips477s4',
//       type: 'nuban',
//       updatedAt: '2025-07-29T01:07:28.000Z',
//       is_deleted: false,
//       isDeleted: false,
//       details: [Object]
//     },
//     session: { provider: null, id: null },
//     fee_charged: 0,
//     fees_breakdown: null,
//     gateway_response: null
//   }
// }

interface VerifyTransferResponse {
	status: boolean;
	message: string;
	data: {
		status: string;
		reason: string;
		transfer_code: string;
	};
}

export const verifyTransfer = async (transferId: string) => {
	const response = await client.get<VerifyTransferResponse>(
		`/transfer/verify/${transferId}`
	);

	return response.data;
};

// {
//   "status": true,
//   "message": "Transfer has been queued",
//   "data": {
//     "domain": "test",
//     "amount": 1000000,
//     "currency": "NGN",
//     "reference": "n7ll9pzl6b",
//     "source": "balance",
//     "source_details": null,
//     "reason": "E go better for you",
//     "status": "success",
//     "failures": null,
//     "transfer_code": "TRF_zuirlnr9qblgfko",
//     "titan_code": null,
//     "transferred_at": null,
//     "id": 529410,
//     "integration": 123460,
//     "recipient": 225204,
//     "createdAt": "2018-08-02T10:02:55.000Z",
//     "updatedAt": "2018-08-02T10:12:05.000Z"
//   }
// }

interface FinalizeTransferOptions {
	transferCode: string;
	otp: string;
}

interface FinalizeTransferResponse {
	status: boolean;
	message: string;
	data: {
		status: string;
		reason: string;
		transfer_code: string;
	};
}

export const finalizeTransfer = async (options: FinalizeTransferOptions) => {
	const response = await client.post<FinalizeTransferResponse>(
		'/transfer/finalize_transfer',
		{
			transfer_code: options.transferCode,
			otp: options.otp
		}
	);

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
