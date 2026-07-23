import React from 'react';
import { useProductsQuery } from '../../data/queries';
import { Product, ProductFilters } from '../../data/types';
import { ProductsFilters } from './types';
import { useProductsFilterStore } from '../../state/filters';
import { useSheet } from '../../navigation/Sheets';

interface ProductsContextType {
	products: Product[];
	isLoading: boolean;
	refreshing: boolean;
	refresh: () => void;
	openFilterModal: () => void;
	clearFilters: () => void;
	search: string;
	setSearch: (value: string) => void;
}

const ProductsContext = React.createContext<ProductsContextType | null>(null);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const { openSheet } = useSheet();
	const filters = useProductsFilterStore(state => state.filters);
	const clearFilters = useProductsFilterStore(state => state.clearFilters);
	const [search, setSearch] = React.useState('');

	const queryFilters = buildFiltersFromState({ ...filters, search });
	const { data, isLoading, isRefetching, refetch } =
		useProductsQuery(queryFilters);

	const refresh = React.useCallback(() => {
		refetch();
	}, [refetch]);

	const openFilterModal = React.useCallback(() => {
		openSheet('productsFilter');
	}, [openSheet]);

	const value = React.useMemo<ProductsContextType>(
		() => ({
			products: data?.products ?? [],
			isLoading,
			refreshing: isRefetching,
			refresh,
			openFilterModal,
			clearFilters,
			search,
			setSearch
		}),
		[
			data,
			isLoading,
			isRefetching,
			refresh,
			openFilterModal,
			clearFilters,
			search
		]
	);

	return (
		<ProductsContext.Provider value={value}>
			{children}
		</ProductsContext.Provider>
	);
};

const buildFiltersFromState = (filters: ProductsFilters): ProductFilters => {
	const result: ProductFilters = {};

	if (filters.categoryId) {
		result.categoryId = filters.categoryId;
	}

	if (filters.sortBy) {
		result.orderBy = sortByMap[filters.sortBy];
	}

	if (filters.search) {
		result.search = filters.search;
	}

	return result;
};

const sortByMap: Record<
	NonNullable<ProductsFilters['sortBy']>,
	ProductFilters['orderBy']
> = {
	'created-at-desc': { createdAt: 'desc' },
	'unit-price-desc': { unitPrice: 'desc' },
	'unit-price-asc': { unitPrice: 'asc' }
};

export const useProductsContext = () => {
	const context = React.use(ProductsContext);

	if (!context) {
		throw new Error(
			'useProductsContext must be used within a ProductsProvider'
		);
	}

	return context;
};
