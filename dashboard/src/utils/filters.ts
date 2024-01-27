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
	// by a singular parameter. We should change that.

	if (!!sortBy) {
		orderBy = [];

		switch (sortBy) {
			case 'created-at-asc':
				orderBy.push({ createdAt: Sort.Asc });
				break;
			case 'created-at-desc':
				orderBy.push({ createdAt: Sort.Desc });
				break;
			case 'updated-at-asc':
				orderBy.push({ updatedAt: Sort.Asc });
				break;
			case 'updated-at-desc':
				orderBy.push({ updatedAt: Sort.Desc });
				break;
			case 'unit-price-asc':
				orderBy.push({ unitPrice: Sort.Asc });
				break;
			case 'unit-price-desc':
				orderBy.push({ unitPrice: Sort.Desc });
				break;
		}
	}

	return { filter, orderBy };
};

export const buildOrdersFilterQuery = (values: FilterOrdersFormValues) => {
	const { sortBy } = values;

	let orderBy = undefined;

	if (!!sortBy) {
		orderBy = [];

		switch (sortBy) {
			case 'created-at-asc':
				orderBy.push({ createdAt: Sort.Asc });
				break;
			case 'created-at-desc':
				orderBy.push({ createdAt: Sort.Desc });
				break;
			case 'updated-at-asc':
				orderBy.push({ updatedAt: Sort.Asc });
				break;
			case 'updated-at-desc':
				orderBy.push({ updatedAt: Sort.Desc });
				break;
		}
	}

	return { orderBy };
};
