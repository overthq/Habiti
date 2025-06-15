import { z } from 'zod';

export const createProductSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	unitPrice: z.number().min(0),
	quantity: z.number().min(0),
	storeId: z.string().min(1)
});

export const updateProductSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	unitPrice: z.number().min(0),
	quantity: z.number().min(0),
	storeId: z.string().min(1)
});

export const createProductReviewSchema = z.object({
	productId: z.string().min(1),
	rating: z.number().min(1).max(5),
	comment: z.string().min(1)
});

export const updateProductReviewSchema = z.object({
	productId: z.string().min(1),
	rating: z.number().min(1).max(5),
	comment: z.string().min(1)
});

export const getRelatedProductsSchema = z.object({
	productId: z.string().min(1)
});
