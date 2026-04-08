import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';
import { optionalAuth } from '../middleware/auth';
import * as StoreLogic from '../core/logic/stores';
import * as ProductLogic from '../core/logic/products';

const landing = new Hono<AppEnv>();

landing.get('/highlights', optionalAuth, async c => {
	const [trendingStores, featuredProducts] = await Promise.all([
		StoreLogic.getTrendingStores(c, { take: 6 }),
		ProductLogic.getFeaturedProducts(c, { take: 8 })
	]);

	return c.json({
		trendingStores,
		featuredProducts
	});
});

export default landing;
