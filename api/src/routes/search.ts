import { Router, Request, Response } from 'express';

import { db } from '../db';

const router: Router = Router();

// GET /search
router.get('/', async (req: Request, res: Response) => {
	const { query } = req.query;

	if (!query || typeof query !== 'string') {
		res.json({ data: [] });
		return;
	}

	const [products, stores] = await Promise.all([
		db.query.Product.findMany({
			where: (products, { ilike }) => ilike(products.name, `%${query}%`)
		}),
		db.query.Store.findMany({
			where: (stores, { ilike }) => ilike(stores.name, `%${query}%`)
		})
	]);

	return res.json({ products, stores });
});

export default router;
