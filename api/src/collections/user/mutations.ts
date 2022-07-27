import { Resolver } from '../../types/resolvers';
import { generateAccessToken, sendVerificationCode } from '../../utils/auth';

interface RegisterArgs {
	input: {
		name: string;
		email: string;
		phone: string;
	};
}

export const register: Resolver<RegisterArgs> = async (
	_,
	{ input: { name, email, phone } },
	ctx
) => {
	const user = await ctx.prisma.user.create({ data: { name, email, phone } });

	return user;
};

interface AuthenticateArgs {
	input: {
		phone: string;
	};
}

export const authenticate: Resolver<AuthenticateArgs> = async (
	_,
	{ input: { phone } },
	ctx
) => {
	const user = await ctx.prisma.user.findUnique({ where: { phone } });

	if (!user) throw new Error('The specified user does not exist.');

	await sendVerificationCode(phone);

	return { message: 'Authentication successful.' };
};

interface VerifyArgs {
	input: {
		phone: string;
		code: string;
	};
}

export const verify: Resolver<VerifyArgs> = async (
	_,
	{ input: { phone, code } },
	ctx
) => {
	const cachedCode = await ctx.redisClient.get(phone);

	if (!cachedCode) throw new Error('No code found for user.');

	if (cachedCode === code) {
		const user = await ctx.prisma.user.findUnique({
			where: { phone }
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
		phone?: string;
	};
}

export const editProfile: Resolver<EditProfileArgs> = async (
	_,
	{ id, input },
	ctx
) => {
	const { name, phone } = input;

	const user = await ctx.prisma.user.update({
		where: { id },
		data: {
			name,
			phone
		}
	});

	return user;
};

const deleteAccount: Resolver = async (_, __, ctx) => {
	const user = await ctx.prisma.user.delete({ where: { id: ctx.user.id } });

	return user;
};

const deleteUser: Resolver = async (_, { id }, ctx) => {
	await ctx.prisma.user.delete({ where: { id } });

	return id;
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
