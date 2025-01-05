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

export const hydrateQuery = (query: Request['query']) => {
	const filter: Record<string, FilterOperators> = {};
	const orderBy: Record<string, 'asc' | 'desc'> = {};

	// Process each query parameter
	Object.entries(query).forEach(([key, value]) => {
		// Normalize the value to string or string[]
		const normalizedValue = Array.isArray(value)
			? value.map(v => v.toString())
			: value?.toString();

		if (!normalizedValue) return;

		// Handle orderBy parameters
		if (key.startsWith('orderBy[')) {
			const field = key.slice(8, -1);
			orderBy[field] = normalizedValue as 'asc' | 'desc';
			return;
		}

		// Rest of the function remains the same...
		const filterMatch = key.match(/^(\w+)\[(\w+)\]$/);
		if (filterMatch) {
			const [, field, operator] = filterMatch;
			if (!field || !operator) return;

			if (!filter[field]) {
				filter[field] = {};
			}

			if (Array.isArray(normalizedValue)) {
				filter[field][operator] = normalizedValue.map(v =>
					!isNaN(Number(v)) ? Number(v) : v
				);
			} else {
				filter[field][operator] = !isNaN(Number(normalizedValue))
					? Number(normalizedValue)
					: normalizedValue;
			}
		}
	});

	return {
		...(Object.keys(filter).length > 0 && { where: filter }),
		...(Object.keys(orderBy).length > 0 && { orderBy })
	};
};
