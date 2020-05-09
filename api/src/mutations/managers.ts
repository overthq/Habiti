import util from 'util';
import { Manager } from '../models';
import client from '../config/redis';
import { sign } from 'jsonwebtoken';

const get = util.promisify(client.get).bind(client);

const sendVerificationEmail = async (email: string) => {
	const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
	client.set(email, randomCode);
	client.expire(email, 600);
	console.log(email, randomCode);
};

export const createManager = async (_, { storeId, input }) => {
	const { name, email, role } = input;

	const manager = await Manager.create({ storeId, name, email, role });
	return manager;
};

export const updateManager = async (_, { managerId, input }) => {
	const updatedManager = await Manager.findByIdAndUpdate(managerId, input);
	return updatedManager;
};

export const authenticateManager = async (_, { email }) => {
	const manager = await Manager.findOne({ email });
	if (!manager) throw new Error('Specified manager does not exist');
	sendVerificationEmail(email);

	return `Verification email sent to ${email}`;
};

export const verifyManagerAuthentication = async (_, { email, code }) => {
	const verificationCode = await get(email);
	if (!verificationCode) {
		throw new Error(
			`Verification code for ${email} not found. Looks like it might have expired.`
		);
	}

	if (verificationCode !== code) {
		throw new Error('Invalid verification code entered');
	}

	const manager = await Manager.findOne({ email });
	const accessToken = sign(
		{ id: manager.id, email: manager.email, role: 'manager ' },
		process.env.JWT_SECRET
	);

	return accessToken;
};
