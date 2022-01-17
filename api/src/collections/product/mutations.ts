import { FileUpload } from 'graphql-upload';
import { Resolver } from '../../types/resolvers';
import { uploadStream } from '../../utils/upload';

const createProduct: Resolver = async (_, { input }, ctx) => {
	const product = await ctx.prisma.product.create({
		data: input
	});

	return product;
};

// TODO: Allow multiple file uploads. Shouldn't be too hard.
// Maybe create separate mutation for adding files
// And another for removing them.

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
	let uploadedUrl = '';

	if (imageFile) {
		const { createReadStream } = await imageFile;
		const stream = createReadStream();

		const { url } = await uploadStream(stream);
		uploadedUrl = url;
	}

	const product = await ctx.prisma.product.update({
		where: { id },
		data: {
			...rest,
			...(uploadedUrl !== ''
				? {
						images: {
							create: {
								path: uploadedUrl
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
