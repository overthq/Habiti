import * as AddressData from '../data/addresses';
import { AppContext } from '../../utils/context';
import { err, ok, Result } from './result';
import { LogicErrorCode } from './errors';

interface CreateDeliveryAddressArgs {
	name: string;
	userId: string;
}

export const createDeliveryAddress = async (
	ctx: AppContext,
	args: CreateDeliveryAddressArgs
): Promise<
	Result<
		Awaited<ReturnType<typeof AddressData.createDeliveryAddress>>,
		LogicErrorCode
	>
> => {
	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		if (args.userId !== ctx.user.id) {
			return err(LogicErrorCode.Forbidden);
		}

		const address = await AddressData.createDeliveryAddress(ctx.prisma, args);

		return ok(address);
	} catch (e) {
		console.error(
			'[DeliveryAddressLogic.createDeliveryAddress] Unexpected error',
			e
		);
		return err(LogicErrorCode.Unexpected);
	}
};
