import env from '../../env';

interface RegisterPayload {
	name: string;
	phone: string;
}

export const register = async ({ name, phone }: RegisterPayload) => {
	try {
		const response = await fetch(`${env.authUrl}/register`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, phone })
		});

		await response.json();
	} catch (error) {
		console.log(error);
	}
};

export const authenticate = async (phone: string) => {
	try {
		const response = await fetch(`${env.authUrl}/authenticate`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phone })
		});

		await response.json();
	} catch (error) {
		console.log(error);
	}
};

interface VerifyCodePayload {
	phone: string;
	code: string;
}

export const verifyCode = async ({ phone, code }: VerifyCodePayload) => {
	try {
		const response = await fetch(`${env.authUrl}/verify-code`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phone, code, userType: 'manager' })
		});

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};
