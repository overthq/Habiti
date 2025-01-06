import { useMutation, useQueryClient } from '@tanstack/react-query';

import dataService from '../services';
import { UpdateStoreBody } from '../services/stores';

export const useUpdateStoreMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateStoreBody) =>
			dataService.stores.updateStore(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
			queryClient.invalidateQueries({ queryKey: ['stores', id] });
		}
	});
};

export const useDeleteStoreMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => dataService.stores.deleteStore(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};
