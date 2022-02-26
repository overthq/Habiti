import { FileUpload } from 'graphql-upload';
import { UploadApiResponse } from 'cloudinary';
import { Resolver } from '../../types/resolvers';
import { uploadStream } from '../../utils/upload';

interface CreateStoreArgs {
	input: {
		name: string;
		description?: string;
		website?: string;
		twitter?: string;
		instagram?: string;
		imageFile?: Promise<FileUpload>;
	};
}

const createStore: Resolver<CreateStoreArgs> = async (_, { input }, ctx) => {
	const { imageFile, ...rest } = input;
	let uploadedImage: UploadApiResponse;

	if (imageFile) {
		const { createReadStream } = await imageFile;
		const stream = createReadStream();

		uploadedImage = await uploadStream(stream);
	}

	const store = await ctx.prisma.store.create({
		data: {
			...rest,
			managers: {
				create: {
					managerId: ctx.user.id
				}
			},
			...(!!uploadedImage
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
	id: string;
	input: {
		name?: string;
		description?: string;
		website?: string;
		twitter?: string;
		instagram?: string;
		imageFile?: Promise<FileUpload>;
	};
}

const editStore: Resolver<EditStoreArgs> = async (_, { id, input }, ctx) => {
	const { imageFile, ...rest } = input;
	let uploadedUrl = '';

	if (imageFile) {
		const { createReadStream } = await imageFile;
		const stream = createReadStream();

		const { url } = await uploadStream(stream);
		uploadedUrl = url;
	}

	const store = await ctx.prisma.store.update({
		where: { id },
		data: {
			...rest,
			...(uploadedUrl !== ''
				? {
						image: {
							update: {
								path: uploadedUrl
							}
						}
				  }
				: {})
		}
	});

	return store;
};

interface FollowStoreArgs {
	storeId: string;
}

const followStore: Resolver<FollowStoreArgs> = async (_, { storeId }, ctx) => {
	const fetchedStore = await ctx.prisma.storeFollower
		.create({
			data: {
				followerId: ctx.user.id,
				storeId
			}
		})
		.store();

	return fetchedStore;
};

interface UnfollowStoreArgs {
	storeId: string;
}

const unfollowStore: Resolver<UnfollowStoreArgs> = async (
	_,
	{ storeId },
	ctx
) => {
	const fetchedStore = await ctx.prisma.storeFollower
		.delete({
			where: {
				storeId_followerId: { storeId, followerId: ctx.user.id }
			}
		})
		.store();

	return fetchedStore;
};

interface DeleteStoreArgs {
	id: string;
}

const deleteStore: Resolver<DeleteStoreArgs> = async (_, { id }, ctx) => {
	await ctx.prisma.store.delete({ where: { id } });

	return id;
};

export default {
	Mutation: {
		createStore,
		editStore,
		followStore,
		unfollowStore,
		deleteStore
	}
};
