import { useMutation, useQueryClient } from '@tanstack/react-query';

import dataService from '../services';
import { CreateProductBody, UpdateProductBody } from '../services/products';

export const useCreateProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateProductBody) =>
			dataService.products.createProduct(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		}
	});
};

export const useUpdateProductMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateProductBody) =>
			dataService.products.updateProduct(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			queryClient.invalidateQueries({ queryKey: ['products', id] });
		}
	});
};

export const useDeleteProductMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => dataService.products.deleteProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		}
	});
};
