import { NextFunction, Request, Response } from 'express';
import { getAppContext } from '../utils/context';
import * as SearchLogic from '../core/logic/search';
import type { SearchQuery } from '../core/validations/rest';

export const globalSearch = async (
	req: Request<{}, {}, {}, SearchQuery>,
	res: Response,
	next: NextFunction
) => {
	const { query } = req.query;

	try {
		const ctx = getAppContext(req);

		const { products, stores } = await SearchLogic.globalSearch(ctx, query);

		return res.json({ products, stores });
	} catch (error) {
		return next(error);
	}
};
