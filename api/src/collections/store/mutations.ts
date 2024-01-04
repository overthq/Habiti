import { FileUpload } from 'graphql-upload';
import { UploadApiResponse } from 'cloudinary';
import { Resolver } from '../../types/resolvers';
import { uploadStream } from '../../utils/upload';
import { createTransferReceipient } from '../../utils/paystack';

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
	let uploadedImage: UploadApiResponse;

	if (storeImage) {
		const { createReadStream } = await storeImage;
		const stream = createReadStream();

		uploadedImage = await uploadStream(stream);
	}

	const store = await ctx.prisma.store.create({
		data: {
			...rest,
			managers: { create: { managerId: ctx.user.id } },
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

	let bankAccountReference: string = undefined;

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

export default {
	Mutation: {
		createStore,
		editStore,
		deleteStore
	}
};
