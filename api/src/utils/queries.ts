import { Request } from 'express';

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
// If we move away from Express, we might need to write a custom parser fot
// query parameters, before passing them to this function.

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
