type SortBy = `${'created-at' | 'updated-at' | 'unit-price'}-${'asc' | 'desc'}`;

export interface FilterProductsFormValues {
	sortBy?: SortBy;
	minPrice?: number;
	maxPrice?: number;
	categories: string[];
	inStock?: boolean;
}
