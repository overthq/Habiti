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

const parseValue = (val: string) => (!isNaN(Number(val)) ? Number(val) : val);

export const hydrateQuery = (query: Request['query']) => {
	const filter: Record<string, FilterOperators> = {};
	const orderBy: Record<string, 'asc' | 'desc'> = {};

	Object.entries(query).forEach(([key, value]) => {
		const normalizedValue = Array.isArray(value)
			? value.map(String)
			: value?.toString();
		if (!normalizedValue) return;

		// Handle orderBy parameters
		if (key.startsWith('orderBy[') && key.endsWith(']')) {
			const field = key.slice(8, -1);
			orderBy[field] = normalizedValue as 'asc' | 'desc';
			return;
		}

		// Handle filter parameters
		const filterMatch = key.match(/^(\w+)\[(\w+)\]$/);
		if (filterMatch) {
			const [, field, operator] = filterMatch;
			if (field) {
				filter[field] ??= {};
				if (operator) {
					filter[field][operator] = Array.isArray(normalizedValue)
						? normalizedValue.map(parseValue)
						: parseValue(normalizedValue);
				}
			}
		}
	});

	return {
		...(Object.keys(filter).length && { where: filter }),
		...(Object.keys(orderBy).length && { orderBy })
	};
};
