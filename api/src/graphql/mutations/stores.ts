import { UploadApiResponse } from 'cloudinary';
import { FileUpload } from 'graphql-upload';

import { Resolver } from '../../types/resolvers';
import { createTransferReceipient } from '../../utils/paystack';
import { uploadStream } from '../../utils/upload';
import { getPushTokensForStore } from '../../utils/notifications';

interface CreateStoreArgs {
	input: {
		name: string;
		description?: string;
		website?: string;
		twitter?: string;
		instagram?: string;
		storeImage?: Promise<FileUpload>;
	};
}

const createStore: Resolver<CreateStoreArgs> = async (_, { input }, ctx) => {
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

interface EditStoreArgs {
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

const editStore: Resolver<EditStoreArgs> = async (_, { input }, ctx) => {
	if (!ctx.storeId) {
		throw new Error('No storeId specified');
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

interface DeleteStoreArgs {
	id: string;
}

// FIXME: We need better access control
const deleteStore: Resolver<DeleteStoreArgs> = async (_, { id }, ctx) => {
	const storeManagers = await ctx.prisma.storeManager.findMany({
		where: { storeId: id }
	});

	const storeManagerIds = storeManagers.map(manager => manager.managerId);

	if (storeManagerIds.includes(ctx.user.id)) {
		await ctx.prisma.store.delete({ where: { id } });
	} else {
		throw new Error('You are not authorized to delete this store');
	}

	return id;
};

interface FollowStoreArgs {
	storeId: string;
}

const followStore: Resolver<FollowStoreArgs> = async (_, { storeId }, ctx) => {
	const follower = await ctx.prisma.storeFollower.create({
		data: { followerId: ctx.user.id, storeId },
		include: { store: true }
	});

	const pushTokens = await getPushTokensForStore(storeId);

	for (const pushToken of pushTokens) {
		if (pushToken) {
			ctx.services.notifications.queueNotification({
				type: 'NEW_FOLLOW',
				data: {
					followerName: ctx.user.name
				},
				recipientTokens: [pushToken]
			});
		}
	}

	return follower;
};

interface UnfollowStoreArgs {
	storeId: string;
}

const unfollowStore: Resolver<UnfollowStoreArgs> = async (
	_,
	{ storeId },
	ctx
) => {
	return ctx.prisma.storeFollower.delete({
		where: { storeId_followerId: { storeId, followerId: ctx.user.id } }
	});
};

interface AddStoreManagerArgs {
	input: {
		storeId: string;
		managerId: string;
	};
}

const addStoreManager: Resolver<AddStoreManagerArgs> = async (
	_parent,
	args,
	ctx
) => {
	return ctx.prisma.storeManager.create({
		data: {
			storeId: args.input.storeId,
			managerId: args.input.managerId
		}
	});
};

interface RemoveStoreManagerArgs {
	managerId: string;
}

const removeStoreManager: Resolver<RemoveStoreManagerArgs> = async (
	_parent,
	args,
	ctx
) => {
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
};

export default {
	Mutation: {
		createStore,
		editStore,
		deleteStore,
		followStore,
		unfollowStore,
		addStoreManager,
		removeStoreManager
	}
};
