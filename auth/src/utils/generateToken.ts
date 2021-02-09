import { sign } from 'jsonwebtoken';

interface Claim {
	id: string;
	name: string;
	phone: string;
	userType: 'user' | 'manager';
}

const generateToken = ({ id, name, phone, userType }: Claim) => {
	const claims = {
		name,
		phone,
		market: {
			'x-hasura-default-role': 'user',
			'x-hasura-role': userType,
			'x-hasura-allowed-roles': ['user', 'manager'],
			'x-hasura-user-id': id
		}
	};

	return {
		accessToken: sign(claims, process.env.JWT_SECRET)
	};
};

export default generateToken;
