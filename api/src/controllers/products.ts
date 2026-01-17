import { Request, Response, NextFunction } from 'express';

import * as ProductLogic from '../core/logic/products';
import { productFiltersSchema } from '../utils/queries';
import { getAppContext } from '../utils/context';

export const getProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const filters = productFiltersSchema.parse(req.query);
		const ctx = getAppContext(req);
		const products = await ProductLogic.getProducts(ctx, filters);
		return res.json({ products });
	} catch (error) {
		return next(error);
	}
};

export const getProductById = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const productWithContext = await ProductLogic.getProductById(
			ctx,
			req.params.id
		);
		return res.json(productWithContext);
	} catch (error) {
		return next(error);
	}
};

export const getRelatedProducts = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const products = await ProductLogic.getRelatedProducts(ctx, req.params.id);
		return res.json({ products });
	} catch (error) {
		return next(error);
	}
};

export const getProductReviews = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const reviews = await ProductLogic.getProductReviews(ctx, req.params.id);
		return res.json({ reviews });
	} catch (error) {
		return next(error);
	}
};

export const createProductReview = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const { rating, body } = req.body;

		const review = await ProductLogic.createProductReview(ctx, {
			productId: req.params.id,
			rating,
			body
		});

		return res.json({ review });
	} catch (error) {
		return next(error);
	}
};

export const updateProduct = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
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
	} catch (error) {
		return next(error);
	}
};

export const updateProductCategories = async (
	req: Request<{ id: string }, {}, { add: string[]; remove: string[] }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const { add, remove } = req.body;

		const product = await ProductLogic.updateProductCategories(ctx, {
			productId: req.params.id,
			addCategoryIds: add,
			removeCategoryIds: remove
		});

		return res.json({ product });
	} catch (error) {
		return next(error);
	}
};

export const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		const { name, description, unitPrice, quantity, storeId } = req.body;

		const product = await ProductLogic.createProduct(ctx, {
			name,
			description,
			unitPrice,
			quantity,
			storeId
		});

		return res.json({ product });
	} catch (error) {
		return next(error);
	}
};

export const deleteProduct = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const ctx = getAppContext(req);
		await ProductLogic.deleteProduct(ctx, { productId: req.params.id });
		return res.status(204).json({ message: 'Product deleted' });
	} catch (error) {
		return next(error);
	}
};
