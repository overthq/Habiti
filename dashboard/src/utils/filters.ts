import {
	FilterOrdersFormValues,
	FilterProductsFormValues
} from '../types/forms';
import { Sort } from '../types/api';

export const buildProductsFilterQuery = (values: FilterProductsFormValues) => {
	const { sortBy, minPrice, maxPrice } = values;

	const filter = {
		...(minPrice || maxPrice
			? { unitPrice: { gte: minPrice, lte: maxPrice } }
			: {})
	};

	let orderBy = undefined;

	// FIXME: I only just realized this means we only allow sorting
	// by a singular parameter. We should probably change that.

	if (!!sortBy) {
		orderBy = [
			(
				{
					'created-at-asc': { createdAt: Sort.Asc },
					'created-at-desc': { createdAt: Sort.Desc },
					'updated-at-asc': { updatedAt: Sort.Asc },
					'updated-at-desc': { updatedAt: Sort.Desc },
					'unit-price-asc': { unitPrice: Sort.Asc },
					'unit-price-desc': { unitPrice: Sort.Desc }
				} as const
			)[sortBy]
		];
	}

	return { filter, orderBy };
};

export const buildOrdersFilterQuery = (values: FilterOrdersFormValues) => {
	const { sortBy } = values;

	let orderBy = undefined;

	if (!!sortBy) {
		orderBy = [
			(
				{
					'created-at-asc': { createdAt: Sort.Asc },
					'created-at-desc': { createdAt: Sort.Desc },
					'updated-at-asc': { updatedAt: Sort.Asc },
					'updated-at-desc': { updatedAt: Sort.Desc }
				} as const
			)[sortBy]
		];
	}

	return { orderBy };
};
