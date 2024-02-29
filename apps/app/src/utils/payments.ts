import env from '../../env';

export interface InitialChargeResponse {
	authorization_url: string;
	access_code: string;
	reference: string;
}

export const attemptInitialCharge = async (email?: string) => {
	const emailToUse = email ?? 'test@test.co';

	const response = await fetch(`${env.apiUrl}/payments/initial-charge`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email: emailToUse })
	});

	const {
		data: { data }
	} = await response.json();

	return data as InitialChargeResponse;
};
