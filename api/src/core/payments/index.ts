import { storeCard } from '../data/cards';
import {
	ChargeAuthorizationOptions,
	CreateTransferReceipientOptions,
	InitialChargeOptions,
	PayAccountOptions,
	ResolveAccountNumberOptions,
	VerifyTransferOptions
} from './types';

const API_URL = 'https://api.paystack.co';

export const chargeAuthorization = async (
	options: ChargeAuthorizationOptions
) => {
	const data = await post('/transaction/charge_authorization', {
		authorization_code: options.authorizationCode,
		email: options.email,
		amount: options.amount
	});

	return data;
};

export const initialCharge = async (options: InitialChargeOptions) => {
	const data = await post('/transaction/initialize', {
		email: options.email,
		amount: options.amount,
		...(options.orderId && {
			metadata: {
				orderId: options.orderId
			}
		})
	});

	return data;
};

export const payAccount = async (options: PayAccountOptions) => {
	const data = await post('/transfer', {
		source: 'balance',
		amount: options.amount,
		reference: options.reference,
		recepient: options.recepient,
		reason: 'Payout'
	});

	return data;
};

export const verifyTransfer = async (options: VerifyTransferOptions) => {
	const data = await get(`/transfer/verify/${options.transferId}`);

	return data;
};

export const resolveAccountNumber = async (
	options: ResolveAccountNumberOptions
) => {
	const { data } = await get(
		`/bank/resolve?account_number=${options.accountNumber}&bank_code=${options.bankCode}`
	);

	return data;
};

// This should probably be run on the frontend in a script.
// We should generate the list and store it with the code as a JSON file,
// We can update it OTA.

export const createTransferReceipient = async (
	options: CreateTransferReceipientOptions
) => {
	try {
		const { data } = await post('/transferrecipient', {
			type: 'nuban',
			name: options.name,
			account_number: options.accountNumber,
			bank_code: options.bankCode,
			currency: 'NGN'
		});

		return data.recipient_code;
	} catch (error) {
		console.log('An error occurred while creating a transfer recepient:');
		console.log(error);
		throw error;
	}
};

export const loadBanks = async () => {
	const data = await get('/bank?currency=NGN');

	return data;
};

export const verifyTransaction = async (reference: string) => {
	const { data, status } = await get(`/transaction/verify/${reference}`);

	if (status === true && data.status === 'success') {
		return storeCard(data);
	} else {
		throw new Error('Verification failed!');
	}
};

export const listBanks = async () => {
	const data = await get('/bank?currency=NGN');

	return data;
};

const post = async (path: string, body: object) => {
	const response = await fetch(`${API_URL}${path}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	const data = await response.json();
	return data;
};

const get = async (path: string) => {
	const response = await fetch(`${API_URL}${path}`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
	});

	const data = await response.json();
	return data;
};
