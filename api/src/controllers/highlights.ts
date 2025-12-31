import { NextFunction, Request, Response } from 'express';

import { getAppContext } from '../utils/context';
import * as StoreLogic from '../core/logic/stores';
import * as ProductLogic from '../core/logic/products';

export const getLandingHighlights = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);

		const [trendingStores, featuredProducts] = await Promise.all([
			StoreLogic.getTrendingStores(ctx, { take: 6 }),
			ProductLogic.getFeaturedProducts(ctx, { take: 8 })
		]);

		return res.json({
			trendingStores,
			featuredProducts
		});
	} catch (error) {
		return next(error);
	}
};
