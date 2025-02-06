import { UploadApiResponse } from 'cloudinary';
import { FileUpload } from 'graphql-upload';

import { Resolver } from '../../types/resolvers';
import { createTransferReceipient } from '../../utils/paystack';
import { uploadStream } from '../../utils/upload';
import { getStorePushTokens } from '../../utils/notifications';
import { canManageStore, storeAuthorizedResolver } from '../permissions';

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

	if (storeImage) {
		const { createReadStream } = await storeImage;
		const stream = createReadStream();

		uploadedImage = await uploadStream(stream);
	}

	const store = await ctx.prisma.store.create({
		data: {
			...rest,
			managers: { create: { managerId: ctx.user.id } },
			...(uploadedImage
				? {
						image: {
							create: {
								path: uploadedImage.url,
								publicId: uploadedImage.public_id
							}
						}
					}
				: {})
		}
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

export const editStore: Resolver<EditStoreArgs> = async (_, { input }, ctx) => {
	if (!ctx.storeId) {
		throw new Error('No storeId specified');
	}

	const permitted = canManageStore(ctx.user.id, ctx.storeId);

	if (!permitted) {
		throw new Error('You are not authorized to edit this store');
	}

	const { imageFile, ...rest } = input;
	let uploadedUrl = '';

	if (imageFile) {
		const { createReadStream } = await imageFile;
		const stream = createReadStream();

		const { url } = await uploadStream(stream);
		uploadedUrl = url;
	}

	let bankAccountReference: string | undefined;

	if (rest.bankAccountNumber && rest.bankCode) {
		bankAccountReference = await createTransferReceipient(
			ctx.user.name,
			rest.bankAccountNumber,
			rest.bankCode
		);
	}

	const store = await ctx.prisma.store.update({
		where: { id: ctx.storeId },
		data: {
			...rest,
			...(uploadedUrl !== ''
				? { image: { update: { path: uploadedUrl } } }
				: {}),
			...(bankAccountReference ? { bankAccountReference } : {})
		}
	});

	return store;
};

export interface DeleteStoreArgs {
	id: string;
}

// FIXME: We need better access control
export const deleteStore: Resolver<DeleteStoreArgs> = async (
	_,
	{ id },
	ctx
) => {
	const permitted = canManageStore(ctx.user.id, id);

	if (!permitted) {
		throw new Error('You are not authorized to delete this store');
	}

	await ctx.prisma.store.delete({ where: { id } });

	return id;
};

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
				type: 'NEW_FOLLOW',
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
