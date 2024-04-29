import { Resolver } from '../../types/resolvers';

interface AddProductReviewArgs {
	input: {
		productId: string;
		body?: string;
		rating: number;
	};
}

const addProductReview: Resolver<AddProductReviewArgs> = async (
	_,
	{ input },
	ctx
) => {
	const productReview = await ctx.prisma.productReview.create({
		data: {
			userId: ctx.user.id,
			productId: input.productId,
			body: input.body,
			rating: input.rating
		}
	});

	return productReview;
};

export default {
	Mutation: {
		addProductReview
	}
};
