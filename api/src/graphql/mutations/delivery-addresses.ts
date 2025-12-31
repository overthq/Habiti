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
	return DeliveryAddressLogic.createDeliveryAddress(ctx, {
		...input,
		userId: ctx.user?.id ?? ''
	});
};
