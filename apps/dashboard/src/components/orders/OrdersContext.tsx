import React from 'react';
import useRefresh from '../../hooks/useRefresh';
import {
	OrdersQuery,
	OrdersQueryVariables,
	OrderStatus,
	Sort,
	useOrdersQuery
} from '../../types/api';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import OrdersFilterModal from './OrdersFilterModal';

interface OrdersContextType {
	data: OrdersQuery;
	fetching: boolean;
	status: OrderStatus | undefined;
	setStatus: (status: OrderStatus) => void;
	refreshing: boolean;
	refresh: () => void;
	openFilterModal: () => void;
	clearFilters: () => void;
}

const OrdersContext = React.createContext<OrdersContextType | null>(null);

// Search implementation should also be a little easier with this approach

export interface OrdersFilters {
	status?: OrderStatus;
	minPrice?: number;
	maxPrice?: number;
	categories?: string[];
	sortBy?: 'created-at-desc' | 'total-desc' | 'total-asc';
}

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const filterModalRef = React.useRef<BottomSheetModal>(null);

	const [filters, setFilters] = React.useReducer(
		(s, p) => ({ ...s, ...p }),
		{} as OrdersFilters
	);

	// TODO: Don't make this a special case.
	const setStatus = React.useCallback((status: OrderStatus) => {
		setFilters({ status });
	}, []);

	const [{ data, fetching }, refetch] = useOrdersQuery({
		variables: buildVariablesFromFilters(filters)
	});
	const { refreshing, refresh } = useRefresh({ fetching, refetch });

	const openFilterModal = React.useCallback(() => {
		filterModalRef.current?.present();
	}, []);

	const clearFilters = React.useCallback(() => {
		setFilters({});
	}, []);

	return (
		<OrdersContext.Provider
			value={{
				data,
				fetching,
				status: filters.status,
				setStatus,
				refreshing,
				refresh,
				openFilterModal,
				clearFilters
			}}
		>
			{children}
			<OrdersFilterModal
				modalRef={filterModalRef}
				filters={filters}
				onUpdateFilters={setFilters}
			/>
		</OrdersContext.Provider>
	);
};

const buildVariablesFromFilters = (filters: OrdersFilters) => {
	let params: OrdersQueryVariables = {};

	if (filters.status) {
		params.status = filters.status;
	}

	if (filters.sortBy) {
		params.orderBy = [sortByMap[filters.sortBy]];
	}

	return params;
};

const sortByMap = {
	'created-at-desc': { createdAt: Sort.Desc },
	'total-desc': { total: Sort.Desc },
	'total-asc': { total: Sort.Asc }
} as const;

export const useOrdersContext = () => {
	const context = React.useContext(OrdersContext);

	if (!context) {
		throw new Error('useOrdersContext must be used within an OrdersProvider');
	}

	return context;
};
