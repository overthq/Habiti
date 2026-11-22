import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

import {
	bulkDeleteAdminOrders,
	bulkDeleteAdminProducts,
	bulkDeleteAdminStores,
	bulkDeleteAdminUsers,
	bulkUpdateAdminOrders,
	bulkUpdateAdminProducts,
	bulkUpdateAdminStores,
	bulkUpdateAdminUsers,
	createAdminProduct,
	createAdminStore,
	createAdminStorePayoutAccount,
	deleteAdminProduct,
	deleteAdminStore,
	deleteAdminStorePayoutAccount,
	loginAdmin,
	logoutAdmin,
	OrderStatus,
	ProductStatus,
	setDefaultAdminStorePayoutAccount,
	updateAdminOrder,
	updateAdminProduct,
	updateAdminStore,
	updateAdminTransaction,
	updateAdminUser,
	verifyAdminBankAccount,
	type AdminCreateProductBody,
	type AdminCreateStoreBody,
	type AdminLoginBody,
	type AdminUpdateUserBody,
	type CreatePayoutAccountBody,
	type UpdateOrderBody,
	type UpdateProductBody,
	type UpdateStoreBody,
	type UpdateTransactionBody,
	type VerifyBankAccountBody
} from '@habiti/data';
import { useNavigate } from '@tanstack/react-router';

export const useLoginMutation = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (body: AdminLoginBody) => loginAdmin(body),
		onSuccess: data => {
			localStorage.setItem('accessToken', data.accessToken);
			toast.success('Successfully logged in');
			navigate({ to: '/stores' });
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
			await logoutAdmin();
			localStorage.removeItem('accessToken');
		},
		onSuccess: () => {
			toast.success('Successfully logged out');
			navigate({ to: '/login' });
		},
		onError: () => {
			// Still clear local state even if server call fails
			localStorage.removeItem('accessToken');
			toast.error('Logged out (session may not be fully revoked)');
			navigate({ to: '/login' });
		}
	});
};

export const useUpdateOrderMutation = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateOrderBody) => updateAdminOrder(id, body),
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
		mutationFn: () => updateAdminOrder(id, { status: OrderStatus.Cancelled }),
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
		mutationFn: (body: AdminCreateProductBody) => createAdminProduct(body),
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
			return updateAdminProduct(id, body);
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
		mutationFn: () => deleteAdminProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'], exact: true });
			navigate({ to: '/products' });
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
		mutationFn: (body: AdminCreateStoreBody) => createAdminStore(body),
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
		mutationFn: (body: UpdateStoreBody) => updateAdminStore(id, body),
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
		mutationFn: () => deleteAdminStore(id),
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
		mutationFn: (body: AdminUpdateUserBody) => updateAdminUser(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', id] });
			toast.success('User updated successfully');
		},
		onError: () => {
			toast.error('Failed to update user');
		}
	});
};

export const useUpdateTransactionMutation = (id: string, storeId?: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateTransactionBody) =>
			updateAdminTransaction(id, body),
		onSuccess: () => {
			if (storeId) {
				queryClient.invalidateQueries({
					queryKey: ['stores', storeId, 'transactions']
				});
			}
			toast.success('Transaction updated successfully');
		},
		onError: () => {
			toast.error('Failed to update transaction');
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
		}) => bulkUpdateAdminUsers(ids, { field, value }),
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
		mutationFn: (ids: string[]) => bulkDeleteAdminUsers(ids),
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
			value: Exclude<OrderStatus, OrderStatus.ReadyForPickup>;
		}) => bulkUpdateAdminOrders(ids, { field, value }),
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
		mutationFn: (ids: string[]) => bulkDeleteAdminOrders(ids),
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
			value: Exclude<ProductStatus, ProductStatus.Archived>;
		}) => bulkUpdateAdminProducts(ids, { field, value }),
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
		mutationFn: (ids: string[]) => bulkDeleteAdminProducts(ids),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			toast.success(`${data.count} product(s) deleted successfully`);
		},
		onError: () => {
			toast.error('Failed to delete products');
		}
	});
};

// Bulk Store Mutations
export const useBulkUpdateStoresMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			ids,
			field,
			value
		}: {
			ids: string[];
			field: 'unlisted';
			value: boolean;
		}) => bulkUpdateAdminStores(ids, { field, value }),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
			toast.success(`${data.count} store(s) updated successfully`);
		},
		onError: () => {
			toast.error('Failed to update stores');
		}
	});
};

export const useBulkDeleteStoresMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => bulkDeleteAdminStores(ids),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['stores'] });
			toast.success(`${data.count} store(s) deleted successfully`);
		},
		onError: () => {
			toast.error('Failed to delete stores');
		}
	});
};

// The payout-account endpoints explain refusals (in-flight payout, failed
// verification) in the response message, which is worth showing as-is.
const apiErrorMessage = (error: unknown, fallback: string) =>
	(isAxiosError<{ message?: string }>(error) &&
		error.response?.data?.message) ||
	fallback;

export const useVerifyBankAccountMutation = () => {
	return useMutation({
		mutationFn: (body: VerifyBankAccountBody) => verifyAdminBankAccount(body),
		onError: error => {
			toast.error(apiErrorMessage(error, 'Failed to verify bank account'));
		}
	});
};

export const useAddStorePayoutAccountMutation = (storeId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreatePayoutAccountBody) =>
			createAdminStorePayoutAccount(storeId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', storeId, 'payout-accounts']
			});
			toast.success('Bank account linked');
		},
		onError: error => {
			toast.error(apiErrorMessage(error, 'Failed to link bank account'));
		}
	});
};

export const useSetDefaultStorePayoutAccountMutation = (storeId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (accountId: string) =>
			setDefaultAdminStorePayoutAccount(storeId, accountId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', storeId, 'payout-accounts']
			});
			toast.success('Default payout account updated');
		},
		onError: error => {
			toast.error(apiErrorMessage(error, 'Failed to update default account'));
		}
	});
};

export const useRemoveStorePayoutAccountMutation = (storeId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (accountId: string) =>
			deleteAdminStorePayoutAccount(storeId, accountId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', storeId, 'payout-accounts']
			});
			toast.success('Payout account removed');
		},
		onError: error => {
			toast.error(apiErrorMessage(error, 'Failed to remove payout account'));
		}
	});
};
