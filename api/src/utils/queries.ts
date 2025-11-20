import { Request } from 'express';
import { z } from 'zod';

// Limit these to things we actually want to use to filter from the frontend.

export const productFiltersSchema = z.object({
	categoryId: z.string().optional(),
	inStock: z.boolean().optional(),
	minPrice: z.number().optional(),
	maxPrice: z.number().optional(),
	orderBy: z
		.object({
			unitPrice: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional()
		})
		.optional()
});

export const orderFiltersSchema = z.object({
	orderBy: z
		.object({
			total: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional()
		})
		.optional()
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;
export type OrderFilters = z.infer<typeof orderFiltersSchema>;

export const productFiltersToPrismaClause = (filters?: ProductFilters) => {
	const where: any = {};
	let orderBy: any = undefined;

	if (filters?.categoryId) {
		where.categories = { some: { categoryId: { equals: filters.categoryId } } };
	}

	if (filters?.inStock) {
		where.quantity = { gt: 0 };
	}

	if (filters?.minPrice) {
		where.unitPrice = { gte: filters.minPrice };
	}

	if (filters?.maxPrice) {
		where.unitPrice = { lte: filters.maxPrice };
	}

	if (filters?.orderBy) {
		orderBy = filters.orderBy;
	}

	return { where, orderBy };
};

export const orderFiltersToPrismaClause = (filters?: OrderFilters) => {
	const where: any = {};
	let orderBy: any = undefined;

	if (filters?.orderBy) {
		orderBy = filters.orderBy;
	}

	return { where, orderBy };
};

type FilterOperators = {
	equals?: any;
	in?: any[];
	notIn?: any[];
	contains?: string;
	startsWith?: string;
	endsWith?: string;
	mode?: 'insensitive';
	lt?: number;
	lte?: number;
	gt?: number;
	gte?: number;
};

// NOTE: This depends on Express properly parsing query parameters into objects
// If we move away from Express, we might need to write a custom parser for
// query parameters (or just use `qs`), before passing them to this function.

export const hydrateQuery = (query: Request['query']) => {
	let filter: Record<string, FilterOperators> = {};
	let orderBy: Record<string, 'asc' | 'desc'> = {};

	if (query.filter) {
		filter = query.filter as Record<string, FilterOperators>;
	}

	if (query.orderBy) {
		orderBy = query.orderBy as Record<string, 'asc' | 'desc'>;
	}

	return {
		...(Object.keys(filter).length && { where: filter }),
		...(Object.keys(orderBy).length && { orderBy })
	};
};
