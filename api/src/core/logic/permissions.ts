import type { Context } from 'hono';

import type { AppEnv } from '../../types/hono';
import { LogicError, LogicErrorCode } from './errors';

interface StoreScope {
	storeId: string;
	userId: string;
}

/**
 * Authorizes a store-scoped action from the access token alone, and returns
 * the scope it established: the store to act on, and who is acting.
 *
 * The `storeId` claim is set only by `/auth/switch-store`, which verifies
 * management before minting it, and is re-verified (and dropped) on every
 * refresh rotation. `authenticate` refuses to take store context from anywhere
 * else. So a claim naming a store *is* proof the caller manages it, and
 * re-querying `storeManager` on every request only confirms what the token
 * already established.
 *
 * Pass `storeId` when the action names its target separately -- a path param,
 * a row already loaded -- so the claim is checked to match it. Omit it when the
 * action operates on whatever store the caller is scoped to; `storeId` on the
 * result is then the id to use, which is why this hands the scope back rather
 * than a boolean. `userId` comes back for the same reason: callers would
 * otherwise reach for `c.var.auth!.id`, and a non-null assertion is exactly the
 * shortcut this is meant to retire.
 *
 * This is deliberately stricter than the `canManageStore(c)` pattern it
 * replaces. Those guards read `if (c.var.storeId && c.var.storeId !== target)`,
 * which lapses when the caller has no store context at all -- and an absent
 * store id reaching a `where` clause is worse than a rejection, because Prisma
 * drops the condition and matches every store's rows. Missing context is an
 * error here, never a pass.
 */
export const assertStoreScope = (
	c: Context<AppEnv>,
	storeId?: string
): StoreScope => {
	const userId = c.var.auth?.id;

	if (!userId) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	// Platform admins are scoped by the admin router rather than by a claim,
	// and reach these functions with the store named explicitly.
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

/**
 * Per-request confirmation that the manager row still exists.
 *
 * `assertStoreScope` covers authorization; this is only worth reaching for
 * where the staleness window matters -- a claim outlives the row it was minted
 * from until the token expires. `removeStoreManager` denies the removed user's
 * sessions to close that window, so this is currently unreferenced; it earns
 * its place again if manager rows start disappearing by some other route
 * (a script, a cascade) that cannot deny sessions.
 */
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
