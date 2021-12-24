import { PrismaClient, User } from '@prisma/client';
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
			Authorization: `Bearer ${process.env.PAYSTACK_API_TOKEN}`,
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

export const storeCard = async (user: User, data: any) => {
	const card = await prisma.card.findUnique({
		where: { signature: data.authorization.signature }
	});

	if (!card) {
		await prisma.card.create({
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
				userId: user.id
			}
		});
	}
};
