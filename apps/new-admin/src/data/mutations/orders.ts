import { useMutation, useQueryClient } from '@tanstack/react-query';

import dataService from '../services';
import { UpdateOrderBody } from '../services/orders';

export const useUpdateOrderMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateOrderBody) =>
			dataService.orders.updateOrder(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['orders', id] });
		}
	});
};

export const useCancelOrderMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => dataService.orders.cancelOrder(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['orders', id] });
		}
	});
};
