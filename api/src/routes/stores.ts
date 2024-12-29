import { and, eq } from 'drizzle-orm';
import { Router, Request, Response } from 'express';

import { APIException } from './types';
import { db } from '../db';
import { Store, StoreManager, StoreFollower } from '../db/schema';
import { authenticate, optionalAuth } from '../middleware/auth';
import { buildQuery } from '../utils/filters';

const router: Router = Router();

// GET /stores
router.get('/', optionalAuth, async (req: Request, res: Response) => {
	const { filter, orderBy } = req.query;
	const baseQuery = buildQuery(Store, filter as any, orderBy as any);
	const stores = await db.query.Store.findMany(baseQuery);
	res.json({ data: stores });
});

router.post('/', authenticate, async (req: Request, res: Response) => {
	const { name, description, website, twitter, instagram } = req.body;

	if (!name) {
		throw new APIException(400, 'Store name is required');
	}

	const store = await db.insert(Store).values({
		name,
		description,
		website,
		twitter,
		instagram
	});

	res.status(201).json({ data: store });
});

// GET /stores/:id
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		throw new APIException(400, 'Store id is required');
	}

	const store = await db.query.Store.findFirst({
		where: eq(Store.id, id),
		with: {
			products: true,
			managers: true,
			followers: true
		}
	});

	if (!store) {
		throw new APIException(404, `Store with id ${id} not found`);
	}

	return res.json({ data: store });
});

// GET /stores/current
router.get('/current', authenticate, async (req: Request, res: Response) => {
	const manager = await db.query.StoreManager.findFirst({
		where: and(
			eq(StoreManager.managerId, req.auth!.id),
			eq(StoreManager.storeId, req.headers['x-market-store-id'] as string)
		),
		with: { store: true }
	});

	if (!manager) {
		throw new APIException(404, 'You are not a manager of this store');
	}

	return res.json({ data: manager.store });
});

// GET /stores/:id/products
router.get('/:id/products', async (req: Request, res: Response) => {
	const { id } = req.params;
	const { filter, orderBy } = req.query;

	if (!id) {
		throw new APIException(400, 'Store id is required');
	}

	const store = await db.query.Store.findFirst({
		where: eq(Store.id, id),
		with: { products: true }
	});

	if (!store) {
		throw new APIException(404, `Store with id ${id} not found`);
	}

	const baseQuery = buildQuery(Store, filter as any, orderBy as any);
	const products = await db.query.Product.findMany({
		...baseQuery,
		where: eq(Store.id, id)
	});

	res.json({ data: products });
});

// POST /stores/:id/follow
router.post(
	'/:id/follow',
	authenticate,
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id) {
			throw new APIException(400, 'Store id is required');
		}

		const store = await db.query.Store.findFirst({
			where: eq(Store.id, id)
		});

		if (!store) {
			throw new APIException(404, `Store with id ${id} not found`);
		}

		const existingFollow = await db.query.StoreFollower.findFirst({
			where: and(
				eq(StoreFollower.storeId, id),
				eq(StoreFollower.followerId, req.auth!.id)
			)
		});

		if (existingFollow) {
			throw new APIException(400, 'You are already following this store');
		}

		await db.insert(StoreFollower).values({
			storeId: id,
			followerId: req.auth!.id
		});

		res.status(201).json({ message: 'Store followed successfully' });
	}
);

// DELETE /stores/:id/follow
router.delete(
	'/:id/follow',
	authenticate,
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id) {
			throw new APIException(400, 'Store id is required');
		}

		const store = await db.query.Store.findFirst({
			where: eq(Store.id, id)
		});

		if (!store) {
			throw new APIException(404, `Store with id ${id} not found`);
		}

		await db
			.delete(StoreFollower)
			.where(
				and(
					eq(StoreFollower.storeId, id),
					eq(StoreFollower.followerId, req.auth!.id)
				)
			);

		res.json({ message: 'Store unfollowed successfully' });
	}
);

export default router;
