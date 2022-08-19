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

export const storeCard = async (userId: string, data: any) => {
	const card = await prisma.card.findUnique({
		where: { signature: data.authorization.signature }
	});

	if (!card) {
		const card = await prisma.card.create({
			data: {
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

		// TODO: Trigger a transaction to send the money back to said user.
		return card;
	}

	return card;
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
	console.log('here too');
	console.log(`${API_URL}/transaction/verify/${reference}`);
	const response = await fetch(`${API_URL}/transaction/verify/${reference}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
		}
	});

	const v = await response.json();

	console.log(v);

	const { data, status } = v;

	if (status === true && data.status === 'success') {
		const card = await storeCard(userId, data);
		return card;
	} else {
		throw new Error('Verification failed!');
	}
};
