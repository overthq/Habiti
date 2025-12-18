import { Resolver } from '../../types/resolvers';
import * as DeliveryAddressLogic from '../../core/logic/delivery-addresses';

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
	const result = await DeliveryAddressLogic.createDeliveryAddress(ctx, {
		...input,
		userId: ctx.user?.id ?? ''
	});

	if (!result.ok) throw new Error(result.error);

	return result.data;
};
