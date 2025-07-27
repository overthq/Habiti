import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import useRefresh from '../../hooks/useRefresh';
import { ProductsStackParamList } from '../../types/navigation';
import { ProductsQuery, Sort, useProductsQuery } from '../../types/api';
import ProductsFilterModal from './ProductsFilterModal';

// TODO:
// - Break types up properly to prevent circular dependencies
// - In the future, it might make sense to have the initial params
//   build the first filter state. But just passing the params to the query
//   is probably the cleanest solution. I'm trying to avoid a major backend
//   refactor for now.
// - Use zustand to handle filters.

interface ProductsContextType {
	data: ProductsQuery;
	fetching: boolean;
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

	const [{ data, fetching }, refetch] = useProductsQuery({
		variables: buildVariablesFromFilters(filters)
	});

	const { refreshing, refresh } = useRefresh({ fetching, refetch });

	const clearFilters = React.useCallback(() => {
		setFilters({});
	}, []);

	const openFilterModal = React.useCallback(() => {
		filterModalRef.current?.present();
	}, []);

	return (
		<ProductsContext.Provider
			value={{
				data,
				fetching,
				refreshing,
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
			/>
		</ProductsContext.Provider>
	);
};

const buildVariablesFromFilters = (filters: ProductsFilters) => {
	let params: ProductsStackParamList['ProductsList'] = {};

	if (filters.categoryId) {
		params = {
			...params,
			filter: {
				...params.filter,
				categories: {
					some: { categoryId: { equals: filters.categoryId } }
				}
			}
		};
	}

	if (filters.sortBy) {
		params.orderBy = [sortByMap[filters.sortBy]];
	}

	return params;
};

const sortByMap = {
	'created-at-desc': { createdAt: Sort.Desc },
	'unit-price-desc': { unitPrice: Sort.Desc },
	'unit-price-asc': { unitPrice: Sort.Asc }
} as const;

export const useProductsContext = () => {
	const context = React.useContext(ProductsContext);

	if (!context) {
		throw new Error(
			'useProductsContext must be used within a ProductsProvider'
		);
	}

	return context;
};
