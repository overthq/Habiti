import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import useRefresh from '../../hooks/useRefresh';
import { MainTabParamList } from '../../types/navigation';
import { OrdersQuery, OrderStatus, useOrdersQuery } from '../../types/api';

interface OrdersContextType {
	data: OrdersQuery;
	fetching: boolean;
	status: OrderStatus | undefined;
	setStatus: (status: OrderStatus) => void;
	refreshing: boolean;
	refresh: () => void;
}

const OrdersContext = React.createContext<OrdersContextType | null>(null);

// It might be easier to do setParams and push the status in that way
// But maybe this gives us more control
// Search implementation should also be a little easier with this approach

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [status, setStatus] = React.useState<OrderStatus>();
	const { params } = useRoute<RouteProp<MainTabParamList, 'Orders'>>();
	const [{ data, fetching }, refetch] = useOrdersQuery({
		variables: { ...(params ? params : {}), status }
	});
	const { refreshing, refresh } = useRefresh({ fetching, refetch });

	return (
		<OrdersContext.Provider
			value={{ data, fetching, status, setStatus, refreshing, refresh }}
		>
			{children}
		</OrdersContext.Provider>
	);
};

export const useOrdersContext = () => {
	const context = React.useContext(OrdersContext);

	if (!context) {
		throw new Error('useOrdersContext must be used within an OrdersProvider');
	}

	return context;
};
