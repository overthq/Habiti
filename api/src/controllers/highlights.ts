import { NextFunction, Request, Response } from 'express';

import { getAppContext } from '../utils/context';
import * as StoreLogic from '../core/logic/stores';
import * as ProductLogic from '../core/logic/products';
import { logicErrorToApiException } from '../core/logic/errors';

export const getLandingHighlights = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);

	const [trendingStoresResult, featuredProductsResult] = await Promise.all([
		StoreLogic.getTrendingStores(ctx, { take: 6 }),
		ProductLogic.getFeaturedProducts(ctx, { take: 8 })
	]);

	if (!trendingStoresResult.ok) {
		return next(logicErrorToApiException(trendingStoresResult.error));
	}

	if (!featuredProductsResult.ok) {
		return next(logicErrorToApiException(featuredProductsResult.error));
	}

	return res.json({
		trendingStores: trendingStoresResult.data,
		featuredProducts: featuredProductsResult.data
	});
};
