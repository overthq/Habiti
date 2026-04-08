import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as ProductLogic from '../core/logic/products';
import * as Schemas from '../core/validations/rest';

const products = new Hono<AppEnv>();

products.get('/:id', optionalAuth, async c => {
	const productWithContext = await ProductLogic.getProductById(
		c,
		c.req.param('id')
	);
	return c.json(productWithContext);
});

products.get('/:id/reviews', optionalAuth, async c => {
	const reviews = await ProductLogic.getProductReviews(c, c.req.param('id'));
	return c.json({ reviews });
});

products.post(
	'/:id/reviews',
	authenticate,
	zValidator('json', Schemas.createReviewBodySchema, zodHook),
	async c => {
		const { rating, body } = c.req.valid('json');

		const review = await ProductLogic.createProductReview(c, {
			productId: c.req.param('id'),
			rating,
			body
		});

		return c.json({ review });
	}
);

products.get('/:id/related', optionalAuth, async c => {
	const products = await ProductLogic.getRelatedProducts(c, c.req.param('id'));
	return c.json({ products });
});

export default products;
