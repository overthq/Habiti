import argon2 from 'argon2';

import { Resolver } from '../../types/resolvers';
import { generateAccessToken } from '../../utils/auth';

interface RegisterArgs {
	input: {
		name: string;
		email: string;
		password: string;
	};
}

export const register: Resolver<RegisterArgs> = async (
	_,
	{ input: { name, email, password } },
	ctx
) => {
	// TODO: Validate password

	const passwordHash = await argon2.hash(password);

	const user = await ctx.prisma.user.create({
		data: { name, email, passwordHash }
	});

	// ctx.services.email.queueMail({});

	return user;
};

interface AuthenticateArgs {
	input: {
		email: string;
		password: string;
	};
}

export const authenticate: Resolver<AuthenticateArgs> = async (
	_,
	{ input: { email, password } },
	ctx
) => {
	const user = await ctx.prisma.user.findUnique({ where: { email } });

	if (!user) throw new Error('The specified user does not exist.');

	const correct = await argon2.verify(user.passwordHash, password);

	if (!correct) {
		throw new Error('The entered password is incorrect');
	}

	const accessToken = await generateAccessToken(user);

	return { accessToken, userId: user.id };
};

interface VerifyArgs {
	input: {
		email: string;
		code: string;
	};
}

export const verify: Resolver<VerifyArgs> = async (
	_,
	{ input: { email, code } },
	ctx
) => {
	const cachedCode = await ctx.redisClient.get(email);

	if (!cachedCode) throw new Error('No code found for user.');

	if (cachedCode === code) {
		const user = await ctx.prisma.user.findUnique({
			where: { email }
		});

		const accessToken = await generateAccessToken(user);

		return { accessToken, userId: user.id };
	} else {
		throw new Error('Invalid code');
	}
};

interface EditProfileArgs {
	id: string;
	input: {
		name?: string;
		email?: string;
	};
}

export const editProfile: Resolver<EditProfileArgs> = (
	_,
	{ id, input },
	ctx
) => {
	const { name, email } = input;

	return ctx.prisma.user.update({
		where: { id },
		data: { name, email }
	});
};

const deleteAccount: Resolver = (_, __, ctx) => {
	return ctx.prisma.user.delete({ where: { id: ctx.user.id } });
};

const deleteUser: Resolver = (_, { id }, ctx) => {
	return ctx.prisma.user.delete({ where: { id } });
};

export default {
	Mutation: {
		register,
		authenticate,
		verify,
		editProfile,
		deleteUser,
		deleteAccount
	}
};
