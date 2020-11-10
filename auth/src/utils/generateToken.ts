import { sign } from 'jsonwebtoken';

interface Claim {
	id: string;
	name: string;
	phone: string;
}

const generateToken = ({ id, name, phone }: Claim) => {
	const claims = {
		name,
		phone,
		market: {
			'x-hasura-default-role': 'user',
			'x-hasura-role': 'user',
			'x-hasura-allowed-roles': ['user'],
			'x-hasura-user-id': id
		}
	};

	return {
		accessToken: sign(claims, process.env.JWT_SECRET)
	};
};

export default generateToken;
