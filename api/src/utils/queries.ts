import { z } from 'zod';

import {
	userFiltersSchema,
	productFiltersSchema,
	orderFiltersSchema
} from '../core/validations/rest';
import type {
	UserFilters,
	ProductFilters,
	OrderFilters
} from '../core/validations/rest';
import { APIException } from '../types/errors';

export { userFiltersSchema, productFiltersSchema, orderFiltersSchema };
export type { UserFilters, ProductFilters, OrderFilters };

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
	} else {
		where.status = { not: 'Archived' };
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

// NOTE: Hono does not parse nested query parameters into objects like Express does.
// If complex nested query parsing is needed, consider using `qs` to parse
// `c.req.url` query string before passing to this function.

const filterOpsSchema = z
	.object({
		equals: z.any().optional(),
		in: z.array(z.any()).optional(),
		notIn: z.array(z.any()).optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.literal('insensitive').optional(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional()
	})
	.strict();

interface HydrateQueryOptions {
	allowedFields: readonly string[];
	allowedOrderBy?: readonly string[];
}

/**
 * Validates and shapes a `?filter[…]=…&orderBy[…]=…` query into a Prisma
 * `{ where, orderBy }` clause. The caller MUST pass an allowlist of fields
 * for both filtering and ordering — without it, callers leak the ability to
 * filter/sort on any column (and any operator) the underlying Prisma model
 * exposes.
 *
 * Throws `APIException(400)` on invalid input so the central errorHandler
 * shapes the response.
 */
export const hydrateQuery = (
	query: Record<string, unknown>,
	opts: HydrateQueryOptions
) => {
	const { allowedFields, allowedOrderBy = allowedFields } = opts;

	if (allowedFields.length === 0) {
		throw new Error('hydrateQuery requires a non-empty allowedFields list');
	}

	const fieldEnum = z.enum(allowedFields as [string, ...string[]]);
	const orderEnum = z.enum(allowedOrderBy as [string, ...string[]]);

	const filterSchema = z.record(fieldEnum, filterOpsSchema).optional();
	const orderBySchema = z.record(orderEnum, z.enum(['asc', 'desc'])).optional();

	const filterParse = filterSchema.safeParse(query.filter);
	const orderByParse = orderBySchema.safeParse(query.orderBy);

	if (!filterParse.success || !orderByParse.success) {
		const errors = [
			...(filterParse.success
				? []
				: filterParse.error.errors.map(e => ({
						field: ['filter', ...e.path].join('.'),
						message: e.message,
						code: e.code
					}))),
			...(orderByParse.success
				? []
				: orderByParse.error.errors.map(e => ({
						field: ['orderBy', ...e.path].join('.'),
						message: e.message,
						code: e.code
					})))
		];
		throw new APIException(400, 'Invalid query', errors);
	}

	const filter = filterParse.data ?? {};
	const orderBy = orderByParse.data ?? {};

	return {
		...(Object.keys(filter).length ? { where: filter } : {}),
		...(Object.keys(orderBy).length ? { orderBy } : {})
	};
};
