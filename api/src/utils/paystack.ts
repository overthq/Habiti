import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const API_URL = 'https://api.paystack.co';
const prisma = new PrismaClient();

interface ChargeAuthorizationOptions {
	authorizationCode: string;
	email: string;
	amount: string;
}

export const chargeAuthorization = async (
	options: ChargeAuthorizationOptions
) => {
	const response = await fetch(`${API_URL}/transaction/charge_authorization`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			authorization_code: options.authorizationCode,
			amount: options.amount,
			email: options.email
		})
	});

	const data = await response.json();
	return data;
};

export const storeCard = (userId: string, data: any) => {
	return prisma.card.upsert({
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
			userId
		}
	});
};

export const initialCharge = async (email: string) => {
	const response = await fetch(`${API_URL}/transaction/initialize`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, amount: 5000 })
	});

	const data = await response.json();
	return data;
};

// Hack to verify transaction in dev.
// (On prod, the webhook should do this).

export const verifyTransaction = async (userId: string, reference: string) => {
	const response = await fetch(`${API_URL}/transaction/verify/${reference}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
		}
	});

	const { data, status } = await response.json();

	if (status === true && data.status === 'success') {
		return storeCard(userId, data);
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

	const response = await fetch(`${API_URL}/transferrecepient`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			type: 'nuban',
			name,
			account_number: accountNumber,
			bank_code: bankCode,
			currency: 'NGN'
		})
	});

	const { data } = await response.json();

	return data;
};

export const createTransferReference = () => {
	// Do something.
};

export const payAccount = async (amount: string, reference: string) => {
	// Pay account.
	const response = await fetch(`${API_URL}`, {
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
		},
		body: JSON.stringify({ amount, reference })
	});

	const data = await response.json();

	return data;
};

export const verifyTransfer = async (transferId: string) => {
	const response = await fetch(`${API_URL}/transfer/${transferId}`, {
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
		}
	});

	const data = await response.json();

	return data;
};
