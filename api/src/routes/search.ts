import { Router, Request, Response } from 'express';

import prismaClient from '../config/prisma';

const router: Router = Router();

// GET /search
router.get('/', async (req: Request, res: Response) => {
	const { query } = req.query;

	if (!query || typeof query !== 'string') {
		return res.json({ data: [] });
	}

	const [products, stores] = await Promise.all([
		prismaClient.product.findMany({
			where: { name: { contains: query, mode: 'insensitive' } }
		}),
		prismaClient.store.findMany({
			where: { name: { contains: query, mode: 'insensitive' } }
		})
	]);

	return res.json({ products, stores });
});

export default router;
