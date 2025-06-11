import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
	type CreateAdminBody,
	type LoginBody,
	type UpdateOrderBody,
	type CreateProductBody,
	type UpdateProductBody,
	type UpdateStoreBody,
	type UpdateUserBody,
	type UpdatePayoutBody
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
	updateUser,
	updatePayout
} from './requests';
import { useNavigate } from 'react-router';

export const useLoginMutation = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (body: LoginBody) => login(body),
		onSuccess: data => {
			localStorage.setItem('accessToken', data.accessToken);
			toast.success('Successfully logged in');
			navigate('/stores');
		},
		onError: () => {
			toast.error('Failed to log in');
		}
	});
};

export const useCreateAdminMutation = () => {
	return useMutation({
		mutationFn: (body: CreateAdminBody) => createAdmin(body),
		onSuccess: () => {
			toast.success('Admin created successfully');
		},
		onError: () => {
			toast.error('Failed to create admin');
		}
	});
};

export const useUpdateOrderMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateOrderBody) => updateOrder(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders', id] });
			toast.success('Order updated successfully');
		},
		onError: () => {
			toast.error('Failed to update order');
		}
	});
};

export const useCancelOrderMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => cancelOrder(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders', id] });
			toast.success('Order cancelled successfully');
		},
		onError: () => {
			toast.error('Failed to cancel order');
		}
	});
};

export const useCreateProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateProductBody) => createProduct(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'], exact: true });
			toast.success('Product created successfully');
		},
		onError: () => {
			toast.error('Failed to create product');
		}
	});
};

export const useUpdateProductMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateProductBody) => {
			return updateProduct(id, body);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products', id] });
			toast.success('Product updated successfully');
		},
		onError: () => {
			toast.error('Failed to update product');
		}
	});
};

export const useDeleteProductMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'], exact: true });
			toast.success('Product deleted successfully');
		},
		onError: () => {
			toast.error('Failed to delete product');
		}
	});
};

export const useUpdateStoreMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateStoreBody) => updateStore(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores', id] });
			toast.success('Store updated successfully');
		},
		onError: () => {
			toast.error('Failed to update store');
		}
	});
};

export const useDeleteStoreMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteStore(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'], exact: true });
			toast.success('Store deleted successfully');
		},
		onError: () => {
			toast.error('Failed to delete store');
		}
	});
};

export const useUpdateUserMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateUserBody) => updateUser(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', id] });
			toast.success('User updated successfully');
		},
		onError: () => {
			toast.error('Failed to update user');
		}
	});
};

export const useUpdatePayoutMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdatePayoutBody) => updatePayout(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payouts'] });
			queryClient.invalidateQueries({ queryKey: ['payouts', id] });
			toast.success('Payout updated successfully');
		},
		onError: () => {
			toast.error('Failed to update payout');
		}
	});
};
