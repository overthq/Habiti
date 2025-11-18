import { Request, Response } from 'express';

import * as ProductLogic from '../core/logic/products';
import { hydrateQuery } from '../utils/queries';
import { getAppContext } from '../utils/context';

export const getProducts = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);

	const products = await ProductLogic.getProducts(ctx, query);

	return res.json({ products });
};

export const getProductById = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const ctx = getAppContext(req);
	const productWithContext = await ProductLogic.getProductById(
		ctx,
		req.params.id
	);

	if (!productWithContext) {
		return res.status(404).json({ error: 'Product not found' });
	}

	return res.json(productWithContext);
};

export const getRelatedProducts = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const ctx = getAppContext(req);
	const products = await ProductLogic.getRelatedProducts(ctx, req.params.id);

	return res.json({ products });
};

export const getProductReviews = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const ctx = getAppContext(req);
	const reviews = await ProductLogic.getProductReviews(ctx, req.params.id);

	return res.json({ reviews });
};

export const createProductReview = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const ctx = getAppContext(req);
	const { rating, body } = req.body;

	const review = await ProductLogic.createProductReview(ctx, {
		productId: req.params.id,
		rating,
		body
	});

	return res.json({ review });
};

export const updateProduct = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const ctx = getAppContext(req);
	const { name, description, unitPrice, quantity } = req.body;

	const product = await ProductLogic.updateProduct(ctx, {
		productId: req.params.id,
		name,
		description,
		unitPrice,
		quantity
	});

	return res.json({ product });
};

export const updateProductCategories = async (
	req: Request<{ id: string }, {}, { add: string[]; remove: string[] }>,
	res: Response
) => {
	const ctx = getAppContext(req);
	const { add, remove } = req.body;

	const product = await ProductLogic.updateProductCategories(ctx, {
		productId: req.params.id,
		addCategoryIds: add,
		removeCategoryIds: remove
	});

	return res.json({ product });
};
