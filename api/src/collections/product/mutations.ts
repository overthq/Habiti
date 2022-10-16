import { FileUpload } from 'graphql-upload';
import { UploadApiResponse } from 'cloudinary';
import { Resolver } from '../../types/resolvers';
import { uploadImages, uploadStream } from '../../utils/upload';

interface CreateProductArgs {
	input: {
		name: string;
		description: string;
		storeId: string;
		unitPrice: number;
		quantity: number;
		imageFiles: Promise<FileUpload>[];
	};
}

const createProduct: Resolver<CreateProductArgs> = async (
	_,
	{ input },
	ctx
) => {
	console.log({ input });
	const { imageFiles, ...rest } = input;

	const uploadedImages = await uploadImages(imageFiles);

	const product = await ctx.prisma.product.create({
		data: {
			...rest,
			images: {
				...(uploadedImages.length > 0
					? {
							createMany: {
								data: uploadedImages.map(({ url, public_id }) => ({
									path: url,
									publicId: public_id
								}))
							}
					  }
					: {})
			}
		}
	});

	return product;
};

interface EditProductArgs {
	id: string;
	input: {
		name?: string;
		description?: string;
		unitPrice?: number;
		imageFile?: Promise<FileUpload>;
	};
}

const editProduct: Resolver<EditProductArgs> = async (
	_,
	{ id, input },
	ctx
) => {
	const { imageFile, ...rest } = input;
	let uploadedImage: UploadApiResponse;

	if (imageFile) {
		const { createReadStream } = await imageFile;
		const stream = createReadStream();

		uploadedImage = await uploadStream(stream);
	}

	const product = await ctx.prisma.product.update({
		where: { id },
		data: {
			...rest,
			...(!!uploadedImage
				? {
						images: {
							create: {
								path: uploadedImage.url,
								publicId: uploadedImage.public_id
							}
						}
				  }
				: {})
		}
	});

	return product;
};

interface AddImageArgs {
	id: string;
	input: {
		imageFiles: Promise<FileUpload>[];
	};
}

const addProductImages: Resolver<AddImageArgs> = async (
	_,
	{ id, input },
	ctx
) => {
	const { imageFiles } = input;

	if (imageFiles.length <= 0) {
		throw new Error('Attempting to upload 0 images');
	}

	const uploadedImages = await uploadImages(imageFiles);

	const product = await ctx.prisma.product.update({
		where: { id },
		data: {
			images: {
				createMany: {
					data: uploadedImages.map(({ url, public_id }) => ({
						path: url,
						publicId: public_id
					}))
				}
			}
		}
	});

	return product;
};

export default {
	Mutation: {
		createProduct,
		editProduct,
		addProductImages
	}
};
