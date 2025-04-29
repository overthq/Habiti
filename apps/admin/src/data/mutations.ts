import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	CreateAdminBody,
	LoginBody,
	UpdateOrderBody,
	CreateProductBody,
	UpdateProductBody,
	UpdateStoreBody,
	UpdateUserBody
} from './types';
import {
	login,
	createAdmin,
	updateOrder,
	cancelOrder,
	createProduct,
	updateProduct,
	deleteProduct,
	updateStore,
	deleteStore,
	updateUser
} from './requests';
import { useNavigate } from 'react-router';

export const useLoginMutation = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (body: LoginBody) => login(body),
		onSuccess: data => {
			localStorage.setItem('accessToken', data.accessToken);
			navigate('/stores');
		}
	});
};

export const useCreateAdminMutation = () => {
	return useMutation({
		mutationFn: (body: CreateAdminBody) => createAdmin(body)
	});
};

export const useUpdateOrderMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateOrderBody) => updateOrder(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['orders', id] });
		}
	});
};

export const useCancelOrderMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => cancelOrder(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			queryClient.invalidateQueries({ queryKey: ['orders', id] });
		}
	});
};

export const useCreateProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateProductBody) => createProduct(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		}
	});
};

export const useUpdateProductMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateProductBody) => updateProduct(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			queryClient.invalidateQueries({ queryKey: ['products', id] });
		}
	});
};

export const useDeleteProductMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		}
	});
};

export const useUpdateStoreMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateStoreBody) => updateStore(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
			queryClient.invalidateQueries({ queryKey: ['stores', id] });
		}
	});
};

export const useDeleteStoreMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteStore(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
		}
	});
};

export const useUpdateUserMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateUserBody) => updateUser(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['users', id] });
		}
	});
};
