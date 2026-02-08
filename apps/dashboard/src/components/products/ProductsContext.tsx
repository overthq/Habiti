import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useProductsQuery } from '../../data/queries';
import { Product, ProductFilters } from '../../data/types';
import ProductsFilterModal from './ProductsFilterModal';

// TODO:
// - Break types up properly to prevent circular dependencies
// - In the future, it might make sense to have the initial params
//   build the first filter state. But just passing the params to the query
//   is probably the cleanest solution. I'm trying to avoid a major backend
//   refactor for now.
// - Use zustand to handle filters.

interface ProductsContextType {
	products: Product[];
	isLoading: boolean;
	refreshing: boolean;
	refresh: () => void;
	openFilterModal: () => void;
	clearFilters: () => void;
}

export interface ProductsFilters {
	categoryId?: string;
	sortBy?: 'created-at-desc' | 'unit-price-desc' | 'unit-price-asc';
}

const ProductsContext = React.createContext<ProductsContextType | null>(null);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const filterModalRef = React.useRef<BottomSheetModal>(null);

	const [filters, setFilters] = React.useReducer(
		(s, p) => ({ ...s, ...p }),
		{} as ProductsFilters
	);

	const queryFilters = buildFiltersFromState(filters);
	const { data, isLoading, isRefetching, refetch, error } =
		useProductsQuery(queryFilters);

	const refresh = React.useCallback(() => {
		refetch();
	}, [refetch]);

	const clearFilters = React.useCallback(() => {
		setFilters({
			categoryId: undefined,
			sortBy: undefined
		});
	}, []);

	const openFilterModal = React.useCallback(() => {
		filterModalRef.current?.present();
	}, []);

	return (
		<ProductsContext.Provider
			value={{
				products: data?.products ?? [],
				isLoading,
				refreshing: isRefetching,
				refresh,
				openFilterModal,
				clearFilters
			}}
		>
			{children}
			<ProductsFilterModal
				modalRef={filterModalRef}
				filters={filters}
				onUpdateFilters={setFilters}
				onClearFilters={clearFilters}
			/>
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
	const context = React.useContext(ProductsContext);

	if (!context) {
		throw new Error(
			'useProductsContext must be used within a ProductsProvider'
		);
	}

	return context;
};
