import util from 'util';
import { Manager } from '../models';
import client from '../config/redis';
import { sign } from 'jsonwebtoken';

const get = util.promisify(client.get).bind(client);

const sendVerificationEmail = (email: string) => {
	const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
	client.set(email, randomCode);
	client.expire(email, 600);
	console.log(email, randomCode);
};

export const createManager = async (_, { storeId, input }, { user }) => {
	const { name, email, role } = input;

	if (!user) {
		const storeManagers = await Manager.find({ storeId });
		if (storeManagers.length !== 0) {
			throw new Error('You are not authorized to create a new manager');
		}
		await Manager.create({ storeId, name, email, role: 'Admin' });
	} else if (user.role !== 'manager') {
		throw new Error('You are not authorized to carry out this operation');
	} else {
		const manager = await Manager.findById(user.id);
		if (!manager) throw new Error('Manager does not exist');
		if (manager.storeId !== storeId) {
			throw new Error(
				'You are not authorized to create managers in this store.'
			);
		}
		if (manager.role !== 'Admin') {
			throw new Error(
				'Only managers with the Admin role are allowed to create managers'
			);
		}

		await Manager.create({ storeId, name, email, role });
	}

	sendVerificationEmail(email);

	return `Verification email sent to ${email}`;
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
		{ id: manager.id, email: manager.email, role: 'manager' },
		process.env.JWT_SECRET
	);

	return accessToken;
};
