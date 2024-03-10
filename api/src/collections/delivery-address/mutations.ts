import { Resolver } from '../../types/resolvers';

interface AddDeliveryAddressArgs {
	input: {
		name: string;
	};
}

const addDeliveryAddress: Resolver<AddDeliveryAddressArgs> = (
	_,
	{ input },
	ctx
) => {};

export default {
	Mutation: {
		addDeliveryAddress
	}
};
