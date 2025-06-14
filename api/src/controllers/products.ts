import { Request, Response } from 'express';

import prismaClient from '../config/prisma';
import { getRelatedProducts as getRelatedProductsData } from '../core/data/products';
import { hydrateQuery } from '../utils/queries';

export const getProducts = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const products = await prismaClient.product.findMany({
		include: { categories: { include: { category: true } } },
		...query
	});
	return res.json({ products });
};

export const getProductById = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Product ID is required' });
	}

	const product = await prismaClient.product.findUnique({
		where: { id: req.params.id },
		include: { images: true }
	});

	if (!product) {
		return res.status(404).json({ error: 'Product not found' });
	}

	return res.json({ product });
};

export const getRelatedProducts = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Product ID is required' });
	}

	const products = await getRelatedProductsData(prismaClient, req.params.id);

	return res.json({ products });
};

// GET /products/:id/reviews
export const getProductReviews = async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Product ID is required' });
	}

	const reviews = await prismaClient.productReview.findMany({
		where: { productId: req.params.id }
	});

	return res.json({ reviews });
};

// POST /products/:id/reviews
export const createProductReview = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (!req.params.id) {
		return res.status(400).json({ error: 'Product ID is required' });
	}

	const { rating, body } = req.body;

	const review = await prismaClient.productReview.create({
		data: { productId: req.params.id, userId: req.auth.id, rating, body }
	});

	return res.json({ review });
};

// PUT /products/:id
export const updateProduct = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (!req.params.id) {
		return res.status(400).json({ error: 'Product ID is required' });
	}

	const { name, description, unitPrice, quantity } = req.body;

	const product = await prismaClient.product.update({
		where: { id: req.params.id },
		data: { name, description, unitPrice, quantity }
	});

	return res.json({ product });
};

// PUT /products/:id/categories
export const updateProductCategories = async (
	req: Request<{ id: string }, {}, { add: string[]; remove: string[] }>,
	res: Response
) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (!req.params.id) {
		return res.status(400).json({ error: 'Product ID is required' });
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
