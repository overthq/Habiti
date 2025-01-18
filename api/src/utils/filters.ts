// import {
// 	SQL,
// 	and,
// 	asc,
// 	desc,
// 	eq,
// 	gt,
// 	gte,
// 	ilike,
// 	like,
// 	lt,
// 	lte,
// 	Column,
// 	sql
// } from 'drizzle-orm';
// import { PgTable } from 'drizzle-orm/pg-core';

// // Generic filter types
// export type FilterOperator =
// 	| {
// 			type: 'string';
// 			operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'like';
// 			value: string;
// 			caseInsensitive?: boolean;
// 	  }
// 	| {
// 			type: 'number';
// 			operator: 'equals' | 'lt' | 'lte' | 'gt' | 'gte' | 'between';
// 			value: number;
// 			value2?: number;
// 	  }
// 	| { type: 'boolean'; operator: 'equals'; value: boolean }
// 	| {
// 			type: 'date';
// 			operator: 'equals' | 'lt' | 'lte' | 'gt' | 'gte' | 'between';
// 			value: Date | string;
// 			value2?: Date | string;
// 	  };

// export type TableFilters<T> = {
// 	[K in keyof T]?: FilterOperator;
// };

// export type OrderDirection = 'asc' | 'desc';

// export type OrderBy<T> = {
// 	[K in keyof T]?: OrderDirection;
// };

// // Generic filter application
// function applyFilter(
// 	column: Column<any, any, any>,
// 	filter: FilterOperator
// ): SQL<unknown> {
// 	switch (filter.type) {
// 		case 'string':
// 			return applyStringFilter(column, filter);
// 		case 'number':
// 			return applyNumberFilter(column, filter);
// 		case 'boolean':
// 			return applyBooleanFilter(column, filter);
// 		case 'date':
// 			return applyDateFilter(column, filter);
// 		default:
// 			throw new Error(`Unsupported filter type: ${(filter as any).type}`);
// 	}
// }

// function applyStringFilter(
// 	column: Column,
// 	filter: Extract<FilterOperator, { type: 'string' }>
// ): SQL<unknown> {
// 	const value = filter.caseInsensitive
// 		? filter.value.toLowerCase()
// 		: filter.value;

// 	switch (filter.operator) {
// 		case 'equals':
// 			return filter.caseInsensitive ? ilike(column, value) : eq(column, value);
// 		case 'contains':
// 			return filter.caseInsensitive
// 				? ilike(column, `%${value}%`)
// 				: like(column, `%${value}%`);
// 		case 'startsWith':
// 			return filter.caseInsensitive
// 				? ilike(column, `${value}%`)
// 				: like(column, `${value}%`);
// 		case 'endsWith':
// 			return filter.caseInsensitive
// 				? ilike(column, `%${value}`)
// 				: like(column, `%${value}`);
// 		case 'like':
// 			return filter.caseInsensitive
// 				? ilike(column, value)
// 				: like(column, value);
// 		default:
// 			throw new Error(`Unsupported string operator: ${filter.operator}`);
// 	}
// }

// function applyNumberFilter(
// 	column: Column,
// 	filter: Extract<FilterOperator, { type: 'number' }>
// ): SQL<unknown> {
// 	switch (filter.operator) {
// 		case 'equals':
// 			return eq(column, filter.value);
// 		case 'lt':
// 			return lt(column, filter.value);
// 		case 'lte':
// 			return lte(column, filter.value);
// 		case 'gt':
// 			return gt(column, filter.value);
// 		case 'gte':
// 			return gte(column, filter.value);
// 		case 'between':
// 			if (filter.value2 === undefined) {
// 				throw new Error('value2 is required for between operator');
// 			}
// 			return (
// 				and(gte(column, filter.value), lte(column, filter.value2)) || sql`1=1`
// 			);
// 		default:
// 			throw new Error(`Unsupported number operator: ${filter.operator}`);
// 	}
// }

// function applyDateFilter(
// 	column: Column<any, Date, any>,
// 	filter: Extract<FilterOperator, { type: 'date' }>
// ): SQL<unknown> {
// 	const value = new Date(filter.value);
// 	const value2 = filter.value2 ? new Date(filter.value2) : undefined;

// 	switch (filter.operator) {
// 		case 'equals':
// 			return eq(column, value);
// 		case 'lt':
// 			return lt(column, value);
// 		case 'lte':
// 			return lte(column, value);
// 		case 'gt':
// 			return gt(column, value);
// 		case 'gte':
// 			return gte(column, value);
// 		case 'between':
// 			if (!value2) {
// 				throw new Error('value2 is required for between operator');
// 			}
// 			return and(gte(column, value), lte(column, value2)) || sql`1=1`;
// 		default:
// 			throw new Error(`Unsupported date operator: ${filter.operator}`);
// 	}
// }

// function applyBooleanFilter(
// 	column: Column,
// 	filter: Extract<FilterOperator, { type: 'boolean' }>
// ): SQL<unknown> {
// 	return eq(column, filter.value);
// }

// // Generic query builder
// export function buildQuery<T extends Record<string, any>>(
// 	table: PgTable<any>,
// 	filters?: TableFilters<T>,
// 	orderBy?: OrderBy<T>
// ) {
// 	// Apply filters
// 	const conditions: SQL<unknown>[] = [];
// 	if (filters) {
// 		for (const [key, filter] of Object.entries(filters)) {
// 			if (filter && key in table) {
// 				conditions.push(applyFilter(table[key], filter));
// 			}
// 		}
// 	}

// 	const ordering: SQL<unknown>[] = [];
// 	// Apply ordering
// 	if (orderBy) {
// 		for (const [key, direction] of Object.entries(orderBy)) {
// 			if (key in table) {
// 				ordering.push(direction === 'asc' ? asc(table[key]) : desc(table[key]));
// 			}
// 		}
// 	}

// 	return {
// 		where: conditions.length > 0 ? and(...conditions) : sql`1=1`,
// 		orderBy: ordering
// 	};
// }

export {};
