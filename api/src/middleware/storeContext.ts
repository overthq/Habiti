import { createMiddleware } from 'hono/factory';

import { APIException } from '../types/errors';
import type { AppEnv } from '../types/hono';

export const requireStoreContext = createMiddleware<AppEnv>(async (c, next) => {
	const auth = c.get('auth');
	const storeId = auth?.storeId ?? c.req.header('x-market-store-id');

	if (!storeId) {
		throw new APIException(
			400,
			'Store context required. Use POST /auth/switch-store to set active store.'
		);
	}

	return next();
});
