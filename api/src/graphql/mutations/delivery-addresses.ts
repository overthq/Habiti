import { Resolver } from '../../types/resolvers';

export interface AddDeliveryAddressArgs {
	input: {
		name: string;
	};
}

export const addDeliveryAddress: Resolver<AddDeliveryAddressArgs> = async (
	_,
	{ input },
	ctx
) => {
	const deliveryAddress = await ctx.prisma.deliveryAddress.create({
		data: { name: input.name, userId: ctx.user.id }
	});

	return deliveryAddress;
};
