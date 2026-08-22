import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import type { AppEnv } from '../types/hono';

export const requireStoreContext = createMiddleware<AppEnv>(async (c, next) => {
	if (!c.var.storeId) {
		throw new HTTPException(400, {
			message:
				'Store context required. Use POST /auth/switch-store to set active store.'
		});
	}

	return next();
});
