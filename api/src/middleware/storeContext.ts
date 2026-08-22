import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import type { AppEnv } from '../types/hono';

/**
 * Gates on the store context the auth middleware established, rather than
 * re-deriving it from the request.
 *
 * These two must agree. Deriving the id here separately meant this could admit
 * a request whose `c.var.storeId` was unset -- and the handlers behind it read
 * `c.var.storeId!`, so the undefined flows into `where: { storeId }`, where
 * Prisma drops the condition and matches every store's rows instead of none.
 */
export const requireStoreContext = createMiddleware<AppEnv>(async (c, next) => {
	if (!c.var.storeId) {
		throw new HTTPException(400, {
			message:
				'Store context required. Use POST /auth/switch-store to set active store.'
		});
	}

	return next();
});
