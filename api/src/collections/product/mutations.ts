import { FileUpload } from 'graphql-upload';
import { UploadApiResponse } from 'cloudinary';
import { Resolver } from '../../types/resolvers';
import { uploadStream } from '../../utils/upload';

const createProduct: Resolver = async (_, { input }, ctx) => {
	const product = await ctx.prisma.product.create({
		data: input
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

// TODO: This should not be here.
// Need a complete rethink of this data model, really.

interface AddToWatchlistArgs {
	productId: string;
}

const addToWatchlist: Resolver<AddToWatchlistArgs> = async (
	_,
	{ productId },
	ctx
) => {
	const watchlistProduct = await ctx.prisma.watchlistProduct.create({
		data: {
			productId,
			userId: ctx.user.id
		}
	});

	return watchlistProduct;
};

export default {
	Mutation: {
		createProduct,
		editProduct,
		addToWatchlist
	}
};
