import { Resolver } from '../../types/resolvers';

interface AddProductOptionArgs {
	input: {
		productId: string;
		name: string;
		description?: string;
	};
}

const addProductOption: Resolver<AddProductOptionArgs> = async (
	_,
	{ input },
	ctx
) => {
	const productOption = await ctx.prisma.productOption.create({
		data: {
			productId: input.productId,
			name: input.name,
			description: input.description ?? null
		}
	});

	return productOption;
};

export default {
	Mutation: {
		addProductOption
	}
};
