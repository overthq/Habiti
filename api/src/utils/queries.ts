import { Request } from 'express';
import { z } from 'zod';
import { OrderStatus, ProductStatus } from '../generated/prisma/client';

export const userFiltersSchema = z.object({
	search: z.string().optional(),
	suspended: z
		.union([z.boolean(), z.enum(['true', 'false'])])
		.transform(val => (typeof val === 'string' ? val === 'true' : val))
		.optional(),
	orderBy: z
		.object({
			name: z.enum(['asc', 'desc']).optional(),
			email: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional()
		})
		.optional()
});

export type UserFilters = z.infer<typeof userFiltersSchema>;

export const userFiltersToPrismaClause = (filters?: UserFilters) => {
	const where: any = {};
	let orderBy: any = undefined;

	if (filters?.search) {
		where.OR = [
			{ name: { contains: filters.search, mode: 'insensitive' } },
			{ email: { contains: filters.search, mode: 'insensitive' } }
		];
	}

	if (filters?.suspended !== undefined) {
		where.suspended = filters.suspended;
	}

	if (filters?.orderBy) {
		orderBy = filters.orderBy;
	}

	return { where, orderBy };
};

export const productFiltersSchema = z.object({
	search: z.string().optional(),
	categoryId: z.string().optional(),
	storeId: z.string().optional(),
	status: z.nativeEnum(ProductStatus).optional(),
	inStock: z
		.union([z.boolean(), z.enum(['true', 'false'])])
		.transform(val => (typeof val === 'string' ? val === 'true' : val))
		.optional(),
	minPrice: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional(),
	maxPrice: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional(),
	orderBy: z
		.object({
			unitPrice: z.enum(['asc', 'desc']).optional(),
			quantity: z.enum(['asc', 'desc']).optional(),
			name: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional()
		})
		.optional()
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;

export const productFiltersToPrismaClause = (filters?: ProductFilters) => {
	const where: any = {};
	let orderBy: any = undefined;

	if (filters?.search) {
		where.name = { contains: filters.search, mode: 'insensitive' };
	}

	if (filters?.categoryId) {
		where.categories = { some: { categoryId: { equals: filters.categoryId } } };
	}

	if (filters?.storeId) {
		where.storeId = filters.storeId;
	}

	if (filters?.status) {
		where.status = filters.status;
	}

	if (filters?.inStock) {
		where.quantity = { gt: 0 };
	}

	if (filters?.minPrice !== undefined && filters?.maxPrice !== undefined) {
		where.unitPrice = { gte: filters.minPrice, lte: filters.maxPrice };
	} else if (filters?.minPrice !== undefined) {
		where.unitPrice = { gte: filters.minPrice };
	} else if (filters?.maxPrice !== undefined) {
		where.unitPrice = { lte: filters.maxPrice };
	}

	if (filters?.orderBy) {
		orderBy = filters.orderBy;
	}

	return { where, orderBy };
};

export const orderFiltersSchema = z.object({
	status: z.nativeEnum(OrderStatus).optional(),
	storeId: z.string().optional(),
	userId: z.string().optional(),
	minTotal: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional(),
	maxTotal: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	orderBy: z
		.object({
			total: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional()
		})
		.optional()
});

export type OrderFilters = z.infer<typeof orderFiltersSchema>;

export const orderFiltersToPrismaClause = (filters?: OrderFilters) => {
	const where: any = {};
	let orderBy: any = undefined;

	if (filters?.status) {
		where.status = filters.status;
	}

	if (filters?.storeId) {
		where.storeId = filters.storeId;
	}

	if (filters?.userId) {
		where.userId = filters.userId;
	}

	if (filters?.minTotal !== undefined && filters?.maxTotal !== undefined) {
		where.total = { gte: filters.minTotal, lte: filters.maxTotal };
	} else if (filters?.minTotal !== undefined) {
		where.total = { gte: filters.minTotal };
	} else if (filters?.maxTotal !== undefined) {
		where.total = { lte: filters.maxTotal };
	}

	if (filters?.dateFrom && filters?.dateTo) {
		where.createdAt = {
			gte: new Date(filters.dateFrom),
			lte: new Date(filters.dateTo)
		};
	} else if (filters?.dateFrom) {
		where.createdAt = { gte: new Date(filters.dateFrom) };
	} else if (filters?.dateTo) {
		where.createdAt = { lte: new Date(filters.dateTo) };
	}

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
