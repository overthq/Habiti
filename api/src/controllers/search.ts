import { Request, Response } from 'express';
import { getAppContext } from '../utils/context';
import * as SearchLogic from '../core/logic/search';

export const globalSearch = async (req: Request, res: Response) => {
	const { query } = req.query;

	if (!query || typeof query !== 'string') {
		return res.json({ products: [], stores: [] });
	}

	const ctx = getAppContext(req);

	const { products, stores } = await SearchLogic.globalSearch(ctx, query);

	return res.json({ products, stores });
};
