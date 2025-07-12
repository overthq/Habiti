import { Request, Response } from 'express';

import prismaClient from '../config/prisma';
import * as ProductData from '../core/data/products';
import { hydrateQuery } from '../utils/queries';

export const getProducts = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const products = await prismaClient.product.findMany({
		include: {
			categories: { include: { category: true } },
			store: true
		},
		...query
	});
	return res.json({ products });
};

export const getProductById = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const product = await ProductData.getProductById(prismaClient, req.params.id);

	if (!product) {
		return res.status(404).json({ error: 'Product not found' });
	}

	return res.json({ product });
};

export const getRelatedProducts = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const products = await ProductData.getRelatedProducts(
		prismaClient,
		req.params.id
	);

	return res.json({ products });
};

export const getProductReviews = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	const reviews = await ProductData.getProductReviews(
		prismaClient,
		req.params.id
	);

	return res.json({ reviews });
};

export const createProductReview = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const { rating, body } = req.body;

	const review = await ProductData.createProductReview(prismaClient, {
		productId: req.params.id,
		userId: req.auth.id,
		rating,
		body
	});

	return res.json({ review });
};

export const updateProduct = async (
	req: Request<{ id: string }>,
	res: Response
) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const { name, description, unitPrice, quantity } = req.body;

	const product = await ProductData.updateProduct(prismaClient, req.params.id, {
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
	if (!req.auth) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const { add, remove } = req.body;

	await prismaClient.productCategory.deleteMany({
		where: { productId: req.params.id, categoryId: { in: remove } }
	});

	await prismaClient.productCategory.createMany({
		data: add.map(categoryId => ({ productId: req.params.id, categoryId })),
		skipDuplicates: true
	});

	const product = await prismaClient.product.findUnique({
		where: { id: req.params.id },
		include: { categories: true }
	});

	return res.json({ product });
};
