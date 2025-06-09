import { ResolverContext } from '../../types/resolvers';

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
