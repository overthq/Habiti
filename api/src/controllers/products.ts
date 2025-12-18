import { Request, Response, NextFunction } from 'express';

import * as ProductLogic from '../core/logic/products';
import { logicErrorToApiException } from '../core/logic/errors';
import { hydrateQuery } from '../utils/queries';
import { getAppContext } from '../utils/context';

export const getProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const query = hydrateQuery(req.query);

	const ctx = getAppContext(req);

	const productsResult = await ProductLogic.getProducts(ctx, query);

	if (!productsResult.ok) {
		return next(logicErrorToApiException(productsResult.error));
	}

	return res.json({ products: productsResult.data });
};

export const getProductById = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);
	const productWithContextResult = await ProductLogic.getProductById(
		ctx,
		req.params.id
	);

	if (!productWithContextResult.ok) {
		return next(logicErrorToApiException(productWithContextResult.error));
	}

	return res.json(productWithContextResult.data);
};

export const getRelatedProducts = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);
	const productsResult = await ProductLogic.getRelatedProducts(
		ctx,
		req.params.id
	);

	if (!productsResult.ok) {
		return next(logicErrorToApiException(productsResult.error));
	}

	return res.json({ products: productsResult.data });
};

export const getProductReviews = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);
	const reviewsResult = await ProductLogic.getProductReviews(
		ctx,
		req.params.id
	);

	if (!reviewsResult.ok) {
		return next(logicErrorToApiException(reviewsResult.error));
	}

	return res.json({ reviews: reviewsResult.data });
};

export const createProductReview = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);
	const { rating, body } = req.body;

	const reviewResult = await ProductLogic.createProductReview(ctx, {
		productId: req.params.id,
		rating,
		body
	});

	if (!reviewResult.ok) {
		return next(logicErrorToApiException(reviewResult.error));
	}

	return res.json({ review: reviewResult.data });
};

export const updateProduct = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);
	const { name, description, unitPrice, quantity } = req.body;

	const productResult = await ProductLogic.updateProduct(ctx, {
		productId: req.params.id,
		name,
		description,
		unitPrice,
		quantity
	});

	if (!productResult.ok) {
		return next(logicErrorToApiException(productResult.error));
	}

	return res.json({ product: productResult.data });
};

export const updateProductCategories = async (
	req: Request<{ id: string }, {}, { add: string[]; remove: string[] }>,
	res: Response,
	next: NextFunction
) => {
	const ctx = getAppContext(req);
	const { add, remove } = req.body;

	const productResult = await ProductLogic.updateProductCategories(ctx, {
		productId: req.params.id,
		addCategoryIds: add,
		removeCategoryIds: remove
	});

	if (!productResult.ok) {
		return next(logicErrorToApiException(productResult.error));
	}

	return res.json({ product: productResult.data });
};
