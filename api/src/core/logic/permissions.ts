import { AppContext } from '../../utils/context';
import { LogicError, LogicErrorCode } from './errors';

// It makes sense to check this on a per-request basis, until:
// - We scope access tokens to a single store (for store mangement)
// - Ensure that the associated tokens are invalidated once the user is removed
//   as a manager for that store.
//
// All in all, this should remain until we can build a robust authentication
// system.

export const canManageStore = async (ctx: AppContext) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!ctx.storeId) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const storeManager = await ctx.prisma.storeManager.findUnique({
		where: {
			storeId_managerId: { managerId: ctx.user.id, storeId: ctx.storeId }
		}
	});

	return !!storeManager;
};

// TODO: Move the meat of the functionality here
export const isHabitiAdmin = async (ctx: AppContext) => ctx.isAdmin();
