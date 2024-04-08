type SortSuffix = 'asc' | 'desc';

type GeneralPrefix = 'created-at' | 'updated-at';

type ProductSortBy = `${GeneralPrefix | 'unit-price'}-${SortSuffix}`;

type OrderSortBy = `${GeneralPrefix | 'total'}-${SortSuffix}`;

export interface FilterProductsFormValues {
	sortBy?: ProductSortBy;
	minPrice?: number;
	maxPrice?: number;
	categories: string[];
	inStock?: boolean;
}

export interface FilterOrdersFormValues {
	sortBy?: OrderSortBy;
}

export interface EditPayoutInfoFormValues {
	accountNumber: string;
	bank: string;
}
