import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import { authenticate, optionalAuth } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { parseNestedQuery, productFiltersSchema } from '../utils/queries';
import * as AuthLogic from '../core/logic/auth';
import * as StoreLogic from '../core/logic/stores';
import * as Schemas from '../core/validations/rest';

const stores = new Hono<AppEnv>();

const storeCreationLimiter = rateLimit({
	prefix: 'stores:create',
	windowSec: 60 * 60,
	limit: 5,
	keyGenerator: c => `user:${c.var.auth?.id}`
});

stores.post(
	'/',
	authenticate,
	storeCreationLimiter,
	zValidator('json', Schemas.createStoreBodySchema, zodHook),
	async c => {
		const body = c.req.valid('json');
		const store = await StoreLogic.createStore(c, body);
		const accessToken = await AuthLogic.generateStoreAccessToken(
			c.var.auth!,
			store.id
		);

		return c.json({ store, accessToken }, 201);
	}
);

stores.delete('/:id', authenticate, async c => {
	await StoreLogic.deleteStore(c, { storeId: c.req.param('id') });
	return c.body(null, 204);
});

stores.post('/:id/follow', authenticate, async c => {
	const follower = await StoreLogic.followStore(c, {
		storeId: c.req.param('id')
	});
	return c.json({ follower });
});

stores.post('/:id/unfollow', authenticate, async c => {
	const follower = await StoreLogic.unfollowStore(c, {
		storeId: c.req.param('id')
	});
	return c.json({ follower });
});

stores.get('/:id', optionalAuth, async c => {
	const storeWithContext = await StoreLogic.getStoreById(c, c.req.param('id'));

	if (!storeWithContext) {
		throw new HTTPException(404, {
			message: 'Store not found'
		});
	}

	return c.json(storeWithContext);
});

stores.get('/:id/products', optionalAuth, async c => {
	const id = c.req.param('id');

	const products = await StoreLogic.getStoreProducts(
		c,
		id,
		productFiltersSchema.parse(parseNestedQuery(c.req.query()))
	);
	return c.json({ products });
});

export default stores;
