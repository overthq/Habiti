import * as UserData from '../data/users';
import prismaClient from '../../config/prisma';
import { AppContext } from '../../utils/context';
import { EmailType } from '../../services/email';
import { cacheVerificationCode, hashPassword } from './auth';

interface RegisterArgs {
	name: string;
	email: string;
	password: string;
}

export const register = async (context: AppContext, args: RegisterArgs) => {
	const existingUser = await UserData.getUserByEmail(prismaClient, args.email);

	if (existingUser) {
		throw new Error('A user already exists with the specified email');
	}

	const passwordHash = await hashPassword(args.password);

	const user = await UserData.createUser(prismaClient, {
		name: args.name,
		email: args.email,
		passwordHash
	});

	const code = await cacheVerificationCode(args.email);

	context.services.email.sendMail({
		emailType: EmailType.NewAccount,
		email: args.email,
		code
	});

	return user;
};
