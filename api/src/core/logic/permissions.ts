import type { Context } from 'hono';

import type { AppEnv } from '../../types/hono';
import { LogicError, LogicErrorCode } from './errors';

// It makes sense to check this on a per-request basis, until:
// - We scope access tokens to a single store (for store mangement)
// - Ensure that the associated tokens are invalidated once the user is removed
//   as a manager for that store.
//
// All in all, this should remain until we can build a robust authentication
// system.

export const canManageStore = async (c: Context<AppEnv>) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const storeManager = await c.var.prisma.storeManager.findUnique({
		where: {
			storeId_managerId: { managerId: c.var.auth.id, storeId: c.var.storeId }
		}
	});

	return !!storeManager;
};

// TODO: Move the meat of the functionality here
export const isHabitiAdmin = async (c: Context<AppEnv>) => c.var.isAdmin;
