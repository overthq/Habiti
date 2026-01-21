import { NextFunction, Request, Response } from 'express';
import { getAppContext } from '../utils/context';
import * as SearchLogic from '../core/logic/search';

export const globalSearch = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { query } = req.query;

	if (!query || typeof query !== 'string') {
		return res.json({ products: [], stores: [] });
	}

	try {
		const ctx = getAppContext(req);

		const { products, stores } = await SearchLogic.globalSearch(ctx, query);

		return res.json({ products, stores });
	} catch (error) {
		return next(error);
	}
};
