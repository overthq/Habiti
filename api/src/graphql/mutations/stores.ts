import { UploadApiResponse } from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import { Prisma } from '@prisma/client';

import { Resolver } from '../../types/resolvers';
import { createTransferReceipient } from '../../core/payments';
import { uploadStream } from '../../utils/upload';
import { getStorePushTokens } from '../../core/notifications';
import { NotificationType } from '../../core/notifications/types';
import { storeAuthorizedResolver } from '../permissions';

export interface CreateStoreArgs {
	input: {
		name: string;
		description?: string;
		website?: string;
		twitter?: string;
		instagram?: string;
		storeImage?: Promise<FileUpload>;
	};
}

export const createStore: Resolver<CreateStoreArgs> = async (
	_,
	{ input },
	ctx
) => {
	const { storeImage, ...rest } = input;
	let uploadedImage: UploadApiResponse | undefined;

	let storeCreateData: Prisma.StoreCreateInput = { ...rest };

	if (storeImage) {
		const { createReadStream } = await storeImage;
		const stream = createReadStream();

		uploadedImage = await uploadStream(stream);

		storeCreateData.image = {
			create: {
				path: uploadedImage.url,
				publicId: uploadedImage.public_id
			}
		};
	}

	storeCreateData.managers = {
		create: { managerId: ctx.user.id }
	};

	const store = await ctx.prisma.store.create({
		data: storeCreateData
	});

	return store;
};

export interface EditStoreArgs {
	input: {
		name?: string;
		description?: string;
		website?: string;
		twitter?: string;
		instagram?: string;
		imageFile?: Promise<FileUpload>;
		bankAccountNumber?: string;
		bankCode?: string;
	};
}

export const editStore = storeAuthorizedResolver<EditStoreArgs>(
	async (_, { input }, ctx) => {
		if (!ctx.storeId) {
			throw new Error('No storeId specified');
		}

		const { imageFile, ...rest } = input;

		let storeUpdateData: Prisma.StoreUpdateInput = {
			...rest
		};

		if (imageFile) {
			const { createReadStream } = await imageFile;
			const stream = createReadStream();

			const { url } = await uploadStream(stream);

			storeUpdateData.image = {
				update: { path: url }
			};
		}

		if (rest.bankAccountNumber && rest.bankCode) {
			const { data, status } = await createTransferReceipient({
				name: ctx.user.name,
				accountNumber: rest.bankAccountNumber,
				bankCode: rest.bankCode
			});

			if (status) {
				storeUpdateData.bankAccountNumber = data.details.account_number;
				storeUpdateData.bankCode = data.details.bank_code;
				storeUpdateData.bankAccountReference = data.recipient_code;
			}
		} else {
			storeUpdateData.bankAccountNumber = null;
			storeUpdateData.bankCode = null;
			storeUpdateData.bankAccountReference = null;
		}

		const store = await ctx.prisma.store.update({
			where: { id: ctx.storeId },
			data: storeUpdateData
		});

		return store;
	}
);

export interface DeleteStoreArgs {
	id: string;
}

export const deleteStore: Resolver<DeleteStoreArgs> = storeAuthorizedResolver(
	async (_, { id }, ctx) => {
		await ctx.prisma.store.delete({ where: { id } });

		return id;
	}
);

export interface FollowStoreArgs {
	storeId: string;
}

export const followStore: Resolver<FollowStoreArgs> = async (
	_,
	{ storeId },
	ctx
) => {
	const follower = await ctx.prisma.storeFollower.create({
		data: { followerId: ctx.user.id, storeId },
		include: { store: true }
	});

	const pushTokens = await getStorePushTokens(storeId);

	for (const pushToken of pushTokens) {
		if (pushToken) {
			ctx.services.notifications.queueNotification({
				type: NotificationType.NewFollower,
				data: { followerName: ctx.user.name },
				recipientTokens: [pushToken]
			});
		}
	}

	return follower;
};

export interface UnfollowStoreArgs {
	storeId: string;
}

export const unfollowStore: Resolver<UnfollowStoreArgs> = async (
	_,
	{ storeId },
	ctx
) => {
	return ctx.prisma.storeFollower.delete({
		where: { storeId_followerId: { storeId, followerId: ctx.user.id } }
	});
};

export interface AddStoreManagerArgs {
	input: {
		storeId: string;
		managerId: string;
	};
}

export const addStoreManager = storeAuthorizedResolver<AddStoreManagerArgs>(
	async (_, args, ctx) => {
		return ctx.prisma.storeManager.create({
			data: {
				storeId: args.input.storeId,
				managerId: args.input.managerId
			}
		});
	}
);

export interface RemoveStoreManagerArgs {
	managerId: string;
}

export const removeStoreManager =
	storeAuthorizedResolver<RemoveStoreManagerArgs>(async (_, args, ctx) => {
		if (!ctx.storeId) {
			throw new Error('No storeId specified');
		}

		return ctx.prisma.storeManager.delete({
			where: {
				storeId_managerId: {
					storeId: ctx.storeId,
					managerId: args.managerId
				}
			}
		});
	});
