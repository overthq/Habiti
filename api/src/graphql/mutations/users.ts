import { PushTokenType } from '@prisma/client';
import { authenticatedResolver } from '../permissions';

export interface EditProfileArgs {
	input: {
		name?: string;
		email?: string;
	};
}

export const editProfile = authenticatedResolver<EditProfileArgs>(
	(_, { input }, ctx) => {
		if (!ctx.user.id) throw new Error('User ID is required.');

		if (!input.name && !input.email) {
			throw new Error('At least one field (name or email) must be provided.');
		}
		if (input.email && !input.email.includes('@')) {
			throw new Error('Please provide a valid email address.');
		}

		return ctx.prisma.user.update({
			where: { id: ctx.user.id },
			data: input
		});
	}
);

export interface SavePushTokenArgs {
	input: {
		token: string;
		type: PushTokenType;
	};
}

export const savePushToken = authenticatedResolver<SavePushTokenArgs>(
	(_, { input }, ctx) => {
		return ctx.prisma.userPushToken.create({
			data: {
				token: input.token,
				type: input.type,
				user: {
					connect: { id: ctx.user.id }
				}
			}
		});
	}
);

export interface DeletePushTokenArgs {
	input: {
		token: string;
		type: PushTokenType;
	};
}

export const deletePushToken = authenticatedResolver<DeletePushTokenArgs>(
	(_, { input }, ctx) => {
		return ctx.prisma.userPushToken.delete({
			where: {
				userId_token: {
					userId: ctx.user.id,
					token: input.token
				},
				type: input.type
			}
		});
	}
);

export const deleteAccount = authenticatedResolver((_, __, ctx) => {
	return ctx.prisma.user.delete({ where: { id: ctx.user.id } });
});
