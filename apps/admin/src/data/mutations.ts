import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
	type CreateAdminBody,
	type LoginBody,
	type UpdateOrderBody,
	type CreateProductBody,
	type UpdateProductBody,
	type CreateStoreBody,
	type UpdateStoreBody,
	type UpdateUserBody,
	type UpdatePayoutBody,
	OrderStatus,
	ProductStatus
} from './types';
import {
	login,
	logout,
	createAdmin,
	updateOrder,
	cancelOrder,
	createProduct,
	updateProduct,
	deleteProduct,
	createStore,
	updateStore,
	deleteStore,
	updateUser,
	updatePayout,
	bulkUpdateUsers,
	bulkDeleteUsers,
	bulkUpdateOrders,
	bulkDeleteOrders,
	bulkUpdateProducts,
	bulkDeleteProducts
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

export const useLogoutMutation = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async () => {
			await logout();
			localStorage.removeItem('accessToken');
		},
		onSuccess: () => {
			toast.success('Successfully logged out');
			navigate('/login');
		},
		onError: () => {
			// Still clear local state even if server call fails
			localStorage.removeItem('accessToken');
			toast.error('Logged out (session may not be fully revoked)');
			navigate('/login');
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

export const useCreateProductMutation = (storeId?: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateProductBody) => createProduct(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'], exact: true });
			if (storeId) {
				queryClient.invalidateQueries({
					queryKey: ['stores', storeId, 'products']
				});
			}
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
	const navigate = useNavigate();

	return useMutation({
		mutationFn: () => deleteProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'], exact: true });
			navigate('/products');
			toast.success('Product deleted successfully');
		},
		onError: () => {
			toast.error('Failed to delete product');
		}
	});
};

export const useCreateStoreMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateStoreBody) => createStore(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores'], exact: true });
			toast.success('Store created successfully');
		},
		onError: () => {
			toast.error('Failed to create store');
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

// Bulk User Mutations
export const useBulkUpdateUsersMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			ids,
			field,
			value
		}: {
			ids: string[];
			field: 'suspended';
			value: boolean;
		}) => bulkUpdateUsers(ids, field, value),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			toast.success(`${data.count} user(s) updated successfully`);
		},
		onError: () => {
			toast.error('Failed to update users');
		}
	});
};

export const useBulkDeleteUsersMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => bulkDeleteUsers(ids),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			toast.success(`${data.count} user(s) deleted successfully`);
		},
		onError: () => {
			toast.error('Failed to delete users');
		}
	});
};

// Bulk Order Mutations
export const useBulkUpdateOrdersMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			ids,
			field,
			value
		}: {
			ids: string[];
			field: 'status';
			value: OrderStatus;
		}) => bulkUpdateOrders(ids, field, value),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			toast.success(`${data.count} order(s) updated successfully`);
		},
		onError: () => {
			toast.error('Failed to update orders');
		}
	});
};

export const useBulkDeleteOrdersMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => bulkDeleteOrders(ids),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
			toast.success(`${data.count} order(s) deleted successfully`);
		},
		onError: () => {
			toast.error('Failed to delete orders');
		}
	});
};

// Bulk Product Mutations
export const useBulkUpdateProductsMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			ids,
			field,
			value
		}: {
			ids: string[];
			field: 'status';
			value: ProductStatus;
		}) => bulkUpdateProducts(ids, field, value),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			toast.success(`${data.count} product(s) updated successfully`);
		},
		onError: () => {
			toast.error('Failed to update products');
		}
	});
};

export const useBulkDeleteProductsMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => bulkDeleteProducts(ids),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			toast.success(`${data.count} product(s) deleted successfully`);
		},
		onError: () => {
			toast.error('Failed to delete products');
		}
	});
};
