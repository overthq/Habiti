import { Resolver } from '../../types/resolvers';

interface AddProductToCategoryArgs {
	input: {
		productId: string;
		categoryId: string;
	};
}

const addProductToCategory: Resolver<AddProductToCategoryArgs> = async (
	_,
	{ input },
	ctx
) => {
	const productCategory = await ctx.prisma.productCategory.create({
		data: { categoryId: input.categoryId, productId: input.productId }
	});

	return productCategory;
};

const removeProductFromCategory: Resolver<AddProductToCategoryArgs> = async (
	_,
	{ input },
	ctx
) => {
	const productCategory = await ctx.prisma.productCategory.delete({
		where: {
			categoryId_productId: {
				categoryId: input.categoryId,
				productId: input.productId
			}
		}
	});

	return productCategory;
};

interface CreateProductCategoryArgs {
	input: {
		name: string;
	};
}

const createProductCategory: Resolver<CreateProductCategoryArgs> = async (
	_,
	{ input },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('Store not found');
	}

	const category = await ctx.prisma.storeProductCategory.create({
		data: { storeId: ctx.storeId, name: input.name }
	});

	return category;
};

interface EditProductCategoryArgs {
	categoryId: string;
	input: {
		name?: string;
		description?: string;
	};
}

const editProductCategory: Resolver<EditProductCategoryArgs> = async (
	_,
	{ categoryId, input },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('Store not found');
	}

	return ctx.prisma.storeProductCategory.update({
		where: { id: categoryId },
		data: input
	});
};

interface DeleteProductCategoryArgs {
	categoryId: string;
}

const deleteProductCategory: Resolver<DeleteProductCategoryArgs> = async (
	_,
	{ categoryId },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('Store not found');
	}

	const category = await ctx.prisma.storeProductCategory.delete({
		where: { id: categoryId }
	});

	return category;
};

export default {
	Mutation: {
		addProductToCategory,
		createProductCategory,
		editProductCategory,
		deleteProductCategory,
		removeProductFromCategory
	}
};
