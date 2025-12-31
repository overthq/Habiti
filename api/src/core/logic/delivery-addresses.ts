import * as AddressData from '../data/addresses';
import { AppContext } from '../../utils/context';
import { LogicError, LogicErrorCode } from './errors';

interface CreateDeliveryAddressArgs {
	name: string;
	userId: string;
}

export const createDeliveryAddress = async (
	ctx: AppContext,
	args: CreateDeliveryAddressArgs
): Promise<Awaited<ReturnType<typeof AddressData.createDeliveryAddress>>> => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (args.userId !== ctx.user.id) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const address = await AddressData.createDeliveryAddress(ctx.prisma, args);

	return address;
};
