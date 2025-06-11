import { ResolverContext } from '../../types/resolvers';

interface CreateUserParams {
	name: string;
	email: string;
	passwordHash: string;
}

interface UpdateUserParams {
	name?: string;
	email?: string;
	passwordHash?: string;
	suspended?: boolean;
}

export const createUser = async (
	ctx: ResolverContext,
	params: CreateUserParams
) => {
	const user = await ctx.prisma.user.create({
		data: params
	});

	return user;
};

export const updateUser = async (
	ctx: ResolverContext,
	userId: string,
	params: UpdateUserParams
) => {
	const user = await ctx.prisma.user.update({
		where: { id: userId },
		data: params
	});

	return user;
};

export const getUserById = async (ctx: ResolverContext, userId: string) => {
	const user = await ctx.prisma.user.findUnique({
		where: { id: userId }
	});

	return user;
};

export const getUserByEmail = async (ctx: ResolverContext, email: string) => {
	const user = await ctx.prisma.user.findUnique({
		where: { email }
	});

	return user;
};

export const deleteUser = async (ctx: ResolverContext, userId: string) => {
	await ctx.prisma.user.delete({
		where: { id: userId }
	});
};
