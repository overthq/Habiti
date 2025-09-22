import * as AddressData from '../data/addresses';
import { AppContext } from '../../utils/context';

interface CreateDeliveryAddressArgs {
	name: string;
	userId: string;
}

export const createDeliveryAddress = async (
	ctx: AppContext,
	args: CreateDeliveryAddressArgs
) => {
	const address = await AddressData.createDeliveryAddress(ctx.prisma, args);

	return address;
};
