import { UploadApiResponse } from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import { Prisma } from '../../generated/prisma/client';

import * as StoreLogic from '../../core/logic/stores';
import { Resolver } from '../../types/resolvers';
import { createTransferReceipient } from '../../core/payments';
import { uploadStream } from '../../utils/upload';
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
	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
	}

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
		imageUrl?: string;
		imagePublicId?: string;
		bankAccountNumber?: string;
		bankCode?: string;
	};
}

export const editStore = storeAuthorizedResolver<EditStoreArgs>(
	async (_, { input }, ctx) => {
		if (!ctx.user) {
			throw new Error('User not authenticated');
		}

		if (!ctx.storeId) {
			throw new Error('No storeId specified');
		}

		const { imageFile, imageUrl, imagePublicId, ...rest } = input;

		let storeUpdateData: Prisma.StoreUpdateInput = {
			...rest
		};

		if (imageFile) {
			const { createReadStream } = await imageFile;
			const stream = createReadStream();

			const { url, public_id } = await uploadStream(stream);

			storeUpdateData.image = {
				upsert: {
					create: { path: url, publicId: public_id },
					update: { path: url, publicId: public_id }
				}
			};
		} else if (imageUrl && imagePublicId) {
			storeUpdateData.image = {
				upsert: {
					create: { path: imageUrl, publicId: imagePublicId },
					update: { path: imageUrl, publicId: imagePublicId }
				}
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
		const store = await StoreLogic.deleteStore(ctx, { storeId: id });

		return store.id;
	}
);

export interface FollowStoreArgs {
	storeId: string;
}

export const followStore: Resolver<FollowStoreArgs> = (_, { storeId }, ctx) => {
	return StoreLogic.followStore(ctx, { storeId });
};

export interface UnfollowStoreArgs {
	storeId: string;
}

export const unfollowStore: Resolver<UnfollowStoreArgs> = (
	_,
	{ storeId },
	ctx
) => {
	return StoreLogic.unfollowStore(ctx, { storeId });
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
