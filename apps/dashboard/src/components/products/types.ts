export interface ProductsFilters {
	categoryId?: string;
	sortBy?: 'created-at-desc' | 'unit-price-desc' | 'unit-price-asc';
	search?: string;
}
