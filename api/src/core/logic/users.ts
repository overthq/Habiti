import * as UserData from '../data/users';
import prismaClient from '../../config/prisma';
import { AppContext } from '../../utils/context';
import { EmailType } from '../../services/email';
import { cacheVerificationCode, hashPassword } from './auth';
import { registerBodySchema } from '../validations/auth';

export const register = async (context: AppContext, args: unknown) => {
	const { data, error } = registerBodySchema.safeParse(args);

	if (error) {
		throw new Error(`[UserLogic.register] - Malformed input: ${error.message}`);
	}

	const existingUser = await UserData.getUserByEmail(prismaClient, data.email);

	if (existingUser) {
		throw new Error('A user already exists with the specified email');
	}

	const passwordHash = await hashPassword(data.password);

	const user = await UserData.createUser(prismaClient, {
		name: data.name,
		email: data.email,
		passwordHash
	});

	const code = await cacheVerificationCode(data.email);

	context.services.email.sendMail({
		emailType: EmailType.NewAccount,
		email: data.email,
		code
	});

	return user;
};
