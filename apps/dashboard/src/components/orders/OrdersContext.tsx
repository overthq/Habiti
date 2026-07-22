import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import OrdersFilterModal from './OrdersFilterModal';
import { useOrdersQuery } from '../../data/queries';
import { Order, OrderFilters } from '../../data/types';
import { OrdersFilters } from './types';

interface OrdersContextType {
	orders: Order[];
	isLoading: boolean;
	refreshing: boolean;
	refresh: () => void;
	openFilterModal: () => void;
}

const OrdersContext = React.createContext<OrdersContextType | null>(null);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const filterModalRef = React.useRef<BottomSheetModal>(null);

	const [filters, setFilters] = React.useReducer(
		(s, p) => ({ ...s, ...p }),
		{} as OrdersFilters
	);

	// TODO: Don't make this a special case.
	const setStatus = React.useCallback((status: OrderStatus | undefined) => {
		setFilters({ status });
	}, []);

	const queryFilters = buildFiltersFromState(filters);
	const { data, isLoading, refetch } = useOrdersQuery(queryFilters);
	const { isRefreshing, onRefresh } = useRefresh({ refetch });

	const openFilterModal = React.useCallback(() => {
		filterModalRef.current?.present();
	}, []);

	const clearFilters = React.useCallback(() => {
		setFilters({
			status: undefined,
			minPrice: undefined,
			maxPrice: undefined,
			categories: undefined,
			sortBy: undefined
		});
	}, []);

	const value = React.useMemo<OrdersContextType>(
		() => ({
			orders: data?.orders ?? [],
			isLoading,
			refreshing: isRefreshing,
			refresh: onRefresh,
			openFilterModal,
			clearFilters
		}),
		[data, isLoading, isRefreshing, onRefresh, openFilterModal]
	);

	return (
		<OrdersContext.Provider value={value}>
			{children}
			<OrdersFilterModal
				modalRef={filterModalRef}
				filters={filters}
				onUpdateFilters={setFilters}
				onClearFilters={clearFilters}
			/>
		</OrdersContext.Provider>
	);
};

const buildFiltersFromState = (filters: OrdersFilters): OrderFilters => {
	const result: OrderFilters = {};

	if (filters.status) {
		result.status = filters.status;
	}

	if (filters.sortBy) {
		result.orderBy = sortByMap[filters.sortBy];
	}

	return result;
};

const sortByMap: Record<
	NonNullable<OrdersFilters['sortBy']>,
	OrderFilters['orderBy']
> = {
	'created-at-desc': { createdAt: 'desc' },
	'total-desc': { total: 'desc' },
	'total-asc': { total: 'asc' }
};

export const useOrdersContext = () => {
	const context = React.use(OrdersContext);

	if (!context) {
		throw new Error('useOrdersContext must be used within an OrdersProvider');
	}

	return context;
};
