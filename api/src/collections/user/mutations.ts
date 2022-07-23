import { Resolver } from '../../types/resolvers';

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
		editProfile,
		deleteUser,
		deleteAccount
	}
};
