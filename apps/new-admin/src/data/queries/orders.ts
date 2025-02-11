import { useQuery } from '@tanstack/react-query';

import dataService from '../services';
import { OrderFilters } from '../services/orders';

export const useOrdersQuery = (params?: OrderFilters) => {
	return useQuery({
		queryKey: ['orders', params],
		queryFn: () => dataService.orders.getOrders(params)
	});
};

export const useOrderQuery = (id: string) => {
	return useQuery({
		queryKey: ['orders', id],
		queryFn: () => dataService.orders.getOrder(id),
		enabled: !!id
	});
};
