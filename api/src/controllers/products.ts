import { Request, Response } from 'express';

import prismaClient from '../config/prisma';

export default class ProductController {
	public async getProductById(req: Request, res: Response) {
		if (!req.params.id) {
			return res.status(400).json({ error: 'Product ID is required' });
		}

		const product = await prismaClient.product.findUnique({
			where: { id: req.params.id }
		});

		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		return res.json({ product });
	}

	public async getRelatedProducts(req: Request, res: Response) {
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
	public async getProductReviews(req: Request, res: Response) {
		if (!req.params.id) {
			return res.status(400).json({ error: 'Product ID is required' });
		}

		const reviews = await prismaClient.productReview.findMany({
			where: { productId: req.params.id }
		});

		return res.json({ reviews });
	}

	// POST /products/:id/reviews
	public async createProductReview(req: Request, res: Response) {
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
	public async updateProduct(req: Request, res: Response) {
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
}
