import type { Context } from 'hono';

import type { AppEnv } from '../../types/hono';
import { LogicError, LogicErrorCode } from './errors';

interface StoreScope {
	storeId: string;
	userId: string;
}

export const assertStoreScope = (
	c: Context<AppEnv>,
	storeId?: string
): StoreScope => {
	const userId = c.var.auth?.id;

	if (!userId) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (c.var.isAdmin) {
		const target = storeId ?? c.var.storeId;

		if (!target) {
			throw new LogicError(LogicErrorCode.StoreContextRequired);
		}

		return { storeId: target, userId };
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.StoreContextRequired);
	}

	if (storeId && storeId !== c.var.storeId) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	return { storeId: c.var.storeId, userId };
};

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
