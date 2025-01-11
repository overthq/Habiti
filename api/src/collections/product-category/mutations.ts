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

interface UpdateProductCategoriesArgs {
	input: {
		productId: string;
		add: string[];
		remove: string[];
	};
}

const updateProductCategories: Resolver<UpdateProductCategoriesArgs> = async (
	_,
	{ input },
	ctx
) => {
	await ctx.prisma.productCategory.deleteMany({
		where: { productId: input.productId, categoryId: { in: input.remove } }
	});

	await ctx.prisma.productCategory.createMany({
		data: input.add.map(categoryId => ({
			productId: input.productId,
			categoryId
		})),
		skipDuplicates: true
	});

	const product = await ctx.prisma.product.findUnique({
		where: { id: input.productId },
		include: { categories: true }
	});

	return product;
};

interface CreateProductCategoryArgs {
	input: {
		name: string;
		description?: string;
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
		data: {
			storeId: ctx.storeId,
			name: input.name,
			description: input.description ?? null
		}
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
		removeProductFromCategory,
		updateProductCategories
	}
};
