import { Resolver } from '../../types/resolvers';

interface AddDeliveryAddressArgs {
	input: {
		name: string;
	};
}

const addDeliveryAddress: Resolver<AddDeliveryAddressArgs> = async (
	_,
	{ input },
	ctx
) => {
	const deliveryAddress = await ctx.prisma.deliveryAddress.create({
		data: { name: input.name, userId: ctx.user.id }
	});

	return deliveryAddress;
};

export default {
	Mutation: {
		addDeliveryAddress
	}
};
