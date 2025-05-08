import prismaClient from '../config/prisma';

const API_URL = 'https://api.paystack.co';

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

interface ChargeAuthorizationOptions {
	authorizationCode: string;
	email: string;
	amount: string;
}

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

interface StoreCardData {
	customer: { email: string };
	authorization: {
		signature: string;
		authorization_code: string;
		bin: string;
		last4: string;
		exp_month: string;
		exp_year: string;
		bank: string;
		card_type: string;
		country_code: string;
	};
}

export const storeCard = async (data: StoreCardData) => {
	return prismaClient.card.upsert({
		where: { signature: data.authorization.signature },
		update: {},
		create: {
			email: data.customer.email,
			authorizationCode: data.authorization.authorization_code,
			bin: data.authorization.bin,
			last4: data.authorization.last4,
			expMonth: data.authorization.exp_month,
			expYear: data.authorization.exp_year,
			bank: data.authorization.bank,
			signature: data.authorization.signature,
			cardType: data.authorization.card_type,
			countryCode: data.authorization.country_code,
			user: { connect: { email: data.customer.email } }
		}
	});
};

export const initialCharge = async (email: string, amount?: number) => {
	const data = await post('/transaction/initialize', {
		email,
		amount: amount ?? 5000
	});

	return data;
};

// Hack to verify transaction in dev.
// (On prod, the webhook should do this).

export const verifyTransaction = async (reference: string) => {
	const { data, status } = await get(`/transaction/verify/${reference}`);

	if (status === true && data.status === 'success') {
		return storeCard(data);
	} else {
		throw new Error('Verification failed!');
	}
};

export const createRecepient = async (
	name: string,
	accountNumber: string,
	bankCode: string
) => {
	// Consider also doing this with the authorization code.
	const { data } = await post('/transferrecipient', {
		type: 'nuban',
		name,
		account_number: accountNumber,
		bank_code: bankCode,
		currency: 'NGN'
	});

	return data;
};

export const payAccount = async (
	amount: string,
	reference: string,
	recepient: string
) => {
	const data = await post('/transfer', {
		source: 'balance',
		amount,
		reference,
		recepient,
		reason: 'Payout'
	});

	return data;
};

export const verifyTransfer = async (transferId: string) => {
	const data = await get(`/transfer/verify/${transferId}`);

	return data;
};

export const resolveAccountNumber = async (
	accountNumber: string,
	bankCode: string
) => {
	const { data } = await get(
		`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
	);

	return data;
};

// This should probably be run on the frontend in a script.
// We should generate the list and store it with the code as a JSON file,
// We can update it OTA.

export const listBanks = async () => {
	const data = await get('/bank?currency=NGN');

	return data;
};

export const createTransferReceipient = async (
	name: string,
	accountNumber: string,
	bankCode: string
) => {
	const { data } = await post('/transferrecipient', {
		type: 'nuban',
		name,
		account_number: accountNumber,
		bank_code: bankCode,
		currency: 'NGN'
	});

	return data.recipient_code;
};

export const loadBanks = async () => {
	const response = await fetch('https://api.paystack.co/bank?country=nigeria', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	const { data } = await response.json();

	return data;
};

// TODO: Use authorization code to return the tokenization fee to user programmatically.
