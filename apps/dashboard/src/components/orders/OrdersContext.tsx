import React from 'react';
import { useOrdersQuery } from '../../data/queries';
import { Order, OrderFilters } from '../../data/types';
import { OrdersFilters } from './types';
import { useOrdersFilterStore } from '../../state/filters';
import { useSheet } from '../../navigation/Sheets';
import useRefresh from '../../hooks/useRefresh';

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
	const { openSheet } = useSheet();
	const filters = useOrdersFilterStore(state => state.filters);

	const queryFilters = buildFiltersFromState(filters);
	const { data, isLoading, refetch } = useOrdersQuery(queryFilters);
	const { isRefreshing, onRefresh } = useRefresh({ refetch });

	const openFilterModal = React.useCallback(() => {
		openSheet('ordersFilter');
	}, [openSheet]);

	const value = React.useMemo<OrdersContextType>(
		() => ({
			orders: data?.orders ?? [],
			isLoading,
			refreshing: isRefreshing,
			refresh: onRefresh,
			openFilterModal
		}),
		[data, isLoading, isRefreshing, onRefresh, openFilterModal]
	);

	return (
		<OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
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
