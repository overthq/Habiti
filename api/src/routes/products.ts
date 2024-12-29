import { eq } from 'drizzle-orm';
import { Router, Request, Response } from 'express';

import { APIException } from './types';
import { db } from '../db';
import { Product, ProductReview } from '../db/schema';
import { authenticate, optionalAuth } from '../middleware/auth';
import { buildQuery } from '../utils/filters';

const router: Router = Router();

// GET /products
router.get('/', optionalAuth, async (req: Request, res: Response) => {
	const { filter, orderBy } = req.query;
	const baseQuery = buildQuery(Product, filter as any, orderBy as any);
	const products = await db.query.Product.findMany(baseQuery);

	return res.json({ data: products });
});

router.post('/', authenticate, async (req: Request, res: Response) => {
	const { name, description, unitPrice, quantity, storeId } = req.body;

	const product = await db.insert(Product).values({
		name,
		description,
		unitPrice,
		quantity,
		storeId
	});

	return res.status(201).json({ data: product });
});

// GET /products/:id
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		throw new APIException(400, 'Product id is required');
	}

	const product = await db.query.Product.findFirst({
		where: eq(Product.id, id),
		with: {
			store: true,
			images: true,
			categories: true,
			options: true,
			reviews: true
		}
	});

	if (!product) {
		throw new APIException(404, `Product with id ${id} not found`);
	}

	return res.json({ data: product });
});

// GET /products/:id/reviews
router.get(
	'/:id/reviews',
	optionalAuth,
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id) {
			throw new APIException(400, 'Product id is required');
		}

		const product = await db.query.Product.findFirst({
			where: eq(Product.id, id),
			with: { reviews: true }
		});

		if (!product) {
			throw new APIException(404, `Product with id ${id} not found`);
		}

		return res.json({ data: product.reviews });
	}
);

// GET /products/:id/related
router.get(
	'/:id/related',
	optionalAuth,
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id) {
			throw new APIException(400, 'Product id is required');
		}

		const product = await db.query.Product.findFirst({
			where: eq(Product.id, id),
			with: { categories: true }
		});

		if (!product) {
			throw new APIException(404, `Product with id ${id} not found`);
		}

		// Find products with similar categories
		const relatedProducts = await db.query.Product.findMany({
			where: (products, { and, eq, ne, inArray }) =>
				and(ne(products.id, id), eq(products.storeId, product.storeId))
		});

		return res.json({ data: relatedProducts });
	}
);

// POST /products/:id/reviews
router.post(
	'/:id/reviews',
	authenticate,
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { rating, comment } = req.body;

		if (!id) {
			throw new APIException(400, 'Product id is required');
		}

		const product = await db.query.Product.findFirst({
			where: eq(Product.id, id)
		});

		if (!product) {
			throw new APIException(404, `Product with id ${id} not found`);
		}

		const review = await db
			.insert(ProductReview)
			.values({
				productId: id,
				userId: req.auth!.id,
				rating,
				comment
			})
			.returning();

		return res.status(201).json({ data: review });
	}
);

export default router;
