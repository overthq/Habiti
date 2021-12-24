const API_URL = 'https://api.paystack.co';

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
