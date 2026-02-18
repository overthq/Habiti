import { Resolver } from '../../types/resolvers';
import * as AddressLogic from '../../core/logic/addresses';

export interface AddDeliveryAddressArgs {
	input: {
		name: string;
		line1: string;
		line2?: string;
		city: string;
		state: string;
		country: string;
		postcode?: string;
		latitude?: number;
		longitude?: number;
	};
}

export const addDeliveryAddress: Resolver<AddDeliveryAddressArgs> = async (
	_,
	{ input },
	ctx
) => {
	return AddressLogic.createUserAddress(ctx, {
		...input,
		userId: ctx.user?.id ?? ''
	});
};
