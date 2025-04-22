import { Request, Response } from 'express';

import prismaClient from '../config/prisma';
import { hydrateQuery } from '../utils/queries';

export async function getProducts(req: Request, res: Response) {
	const query = hydrateQuery(req.query);

	const products = await prismaClient.product.findMany({
		include: { categories: { include: { category: true } } },
		...query
	});
	return res.json({ products });
}

export async function getProductById(req: Request, res: Response) {
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
}

export async function getRelatedProducts(req: Request, res: Response) {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Product ID is required' });
	}

	const product = await prismaClient.product.findUnique({
		where: { id: req.params.id }
	});

	if (!product) {
		return res.status(404).json({ error: 'Product not found' });
	}

	// Get the current product's categories
	const productCategories = await prismaClient.productCategory.findMany({
		where: { productId: req.params.id },
		select: { categoryId: true }
	});

	const categoryIds = productCategories.map(pc => pc.categoryId);

	// Find products that share categories with the current product
	if (categoryIds.length > 0) {
		const products = await prismaClient.product.findMany({
			where: {
				AND: [
					{ id: { not: req.params.id } }, // Exclude current product
					{ storeId: product.storeId }, // Same store
					{ categories: { some: { categoryId: { in: categoryIds } } } }
				]
			},
			take: 5 // Limit to 5 related products
		});

		return res.json({ products });
	}

	// Fallback: if no categories, return other products from same store
	const products = await prismaClient.product.findMany({
		where: {
			AND: [{ id: { not: req.params.id } }, { storeId: product.storeId }]
		},
		take: 5
	});

	return res.json({ products });
}

// GET /products/:id/reviews
export async function getProductReviews(req: Request, res: Response) {
	if (!req.params.id) {
		return res.status(400).json({ error: 'Product ID is required' });
	}

	const reviews = await prismaClient.productReview.findMany({
		where: { productId: req.params.id }
	});

	return res.json({ reviews });
}

// POST /products/:id/reviews
export async function createProductReview(req: Request, res: Response) {
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
}

// PUT /products/:id
export async function updateProduct(req: Request, res: Response) {
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
}

// PUT /products/:id/categories
export async function updateProductCategories(
	req: Request<{ id: string }, {}, { add: string[]; remove: string[] }>,
	res: Response
) {
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
}
