import { Sort } from '../types/api';

type StringFilter = {
	equals?: string;
	in?: string[];
	notIn?: string[];
	contains?: string;
	startsWith?: string;
	endsWith?: string;
	mode?: 'insensitive';
};

type IntFilter = {
	equals?: number;
	in?: number[];
	notIn?: number[];
	lt?: number;
	lte?: number;
	gt?: number;
	gte?: number;
};

type ProductFilter = {
	name?: StringFilter;
	description?: StringFilter;
	unitPrice?: IntFilter;
	quantity?: IntFilter;
};

type ProductOrderBy = {
	createdAt?: Sort;
	updatedAt?: Sort;
	unitPrice?: Sort;
};

type OrderFilter = {
	total?: IntFilter;
};

type OrderOrderBy = {
	total?: Sort;
	createdAt?: Sort;
	updatedAt?: Sort;
};

export const buildQuery = <
	T extends Record<string, any>,
	U extends Record<string, Sort>
>({
	filter,
	orderBy
}: {
	filter?: T;
	orderBy?: U;
}) => {
	const params = new URLSearchParams();

	// Handle filters
	if (filter) {
		Object.entries(filter).forEach(([field, conditions]) => {
			Object.entries(conditions || {}).forEach(([operator, value]) => {
				if (value !== undefined) {
					if (Array.isArray(value)) {
						value.forEach(v =>
							params.append(`${field}[${operator}]`, v.toString())
						);
					} else {
						params.append(`${field}[${operator}]`, value.toString());
					}
				}
			});
		});
	}

	// Handle ordering
	if (orderBy) {
		Object.entries(orderBy).forEach(([field, direction]) => {
			if (direction) {
				params.append(`orderBy[${field}]`, direction);
			}
		});
	}

	return params.toString();
};

export const buildProductQuery = (params: {
	filter?: ProductFilter;
	orderBy?: ProductOrderBy;
}) => buildQuery(params);

export const buildOrderQuery = (params: {
	filter?: OrderFilter;
	orderBy?: OrderOrderBy;
}) => buildQuery(params);
