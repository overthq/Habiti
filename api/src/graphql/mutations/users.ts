import argon2 from 'argon2';

import { Resolver } from '../../types/resolvers';
import { generateAccessToken } from '../../utils/auth';

export interface RegisterArgs {
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
	if (!name || !email || !password) {
		throw new Error('Name, email, and password are required.');
	}

	if (password.length < 8) {
		throw new Error('Password must be at least 8 characters long.');
	}

	if (!email.includes('@')) {
		throw new Error('Please provide a valid email address.');
	}

	const passwordHash = await argon2.hash(password);

	const user = await ctx.prisma.user.create({
		data: { name, email, passwordHash }
	});

	// ctx.services.email.queueMail({});

	return user;
};

export interface AuthenticateArgs {
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
	console.log({ email, password });

	if (!email || !password) {
		throw new Error('Email and password are required.');
	}

	const user = await ctx.prisma.user.findUnique({ where: { email } });

	console.log({ user });

	if (!user) throw new Error('The specified user does not exist.');

	const correct = await argon2.verify(user.passwordHash, password);

	if (!correct) {
		throw new Error('The entered password is incorrect');
	}

	console.log({ correct });

	const accessToken = await generateAccessToken(user);

	console.log({ accessToken, userId: user.id });

	return { accessToken, userId: user.id };
};

export interface VerifyArgs {
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
	if (!email || !code) {
		throw new Error('Email and verification code are required.');
	}

	const cachedCode = await ctx.redisClient.get(email);

	if (!cachedCode) throw new Error('No code found for user.');

	if (cachedCode === code) {
		const user = await ctx.prisma.user.findUnique({
			where: { email }
		});

		if (!user) {
			throw new Error('');
		}

		const accessToken = await generateAccessToken(user);

		return { accessToken, userId: user.id };
	} else {
		throw new Error('Invalid code');
	}
};

export interface EditProfileArgs {
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
	if (!id) throw new Error('User ID is required.');
	if (!input.name && !input.email) {
		throw new Error('At least one field (name or email) must be provided.');
	}
	if (input.email && !input.email.includes('@')) {
		throw new Error('Please provide a valid email address.');
	}

	return ctx.prisma.user.update({
		where: { id },
		data: input
	});
};

export const deleteAccount: Resolver = (_, __, ctx) => {
	return ctx.prisma.user.delete({ where: { id: ctx.user.id } });
};

export const deleteUser: Resolver = (_, { id }, ctx) => {
	return ctx.prisma.user.delete({ where: { id } });
};
