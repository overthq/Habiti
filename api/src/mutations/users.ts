import util from 'util';
import { User } from '../models';
import client from '../config/redis';

// Move to helpers?
const sendVerificationCode = async (phone: string) => {
	const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
	client.set(phone, randomCode);
	client.expire(phone, 600);
	console.log(phone, randomCode);
};

const get = util.promisify(client.get).bind(client);

export const register = async (_, { name, phone }) => {
	await User.create({ name, phone });
	sendVerificationCode(phone);

	return 'Verification code sent to user.';
};

export const authenticate = async (_, { phone }) => {
	const user = await User.findOne({ phone });
	if (!user) throw new Error('User does not exist');
	sendVerificationCode(phone);

	return 'Verification code sent to user';
};

export const verifyAuthentication = async (_, { phone, code }) => {
	const verificationCode = await get(phone);
	try {
		if (!verificationCode) {
			throw new Error(
				`Verification code for ${phone} not found. Looks like it might have expired.`
			);
		}

		if (verificationCode !== code) {
			throw new Error('Invalid verification code entered');
		}

		const user = await User.findOne({ phone });
		return user;
	} catch (error) {
		console.log(error);
	}
};
