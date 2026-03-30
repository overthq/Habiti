import { api } from './api';
import {
	type LoginBody,
	type LoginResponse,
	type CreateAdminBody,
	type CreateAdminResponse,
	type OrderFilters,
	type GetOrdersResponse,
	type GetOrderResponse,
	type UpdateOrderBody,
	type UpdateOrderResponse,
	OrderStatus,
	type ProductFilters,
	type GetProductsResponse,
	type GetProductResponse,
	type CreateProductBody,
	type UpdateProductBody,
	type Product,
	type UserFilters,
	type GetUsersResponse,
	type GetUserResponse,
	type UpdateUserBody,
	type UpdateStoreBody,
	type CreateStoreBody,
	type Store,
	type GetStoreManagersResponse,
	type GetStoreOrdersResponse,
	type GetStoreProductsResponse,
	type GetStoreResponse,
	type GetStoresResponse,
	type StoreFilters,
	type GetOverviewResponse,
	type UpdateTransactionBody,
	type UpdateTransactionResponse,
	type BulkActionResponse,
	type GetStoreTransactionsResponse,
	type TransactionFilters,
	ProductStatus
} from './types';

export const login = (body: LoginBody) => {
	return api.post<LoginResponse>('/admin/login', body);
};

export const logout = () => {
	return api.post<{ message: string }>('/admin/logout', {});
};

export const createAdmin = (body: CreateAdminBody) => {
	return api.post<CreateAdminResponse>('/admin/register', body);
};

export const getOrders = (params?: OrderFilters) => {
	return api.get<GetOrdersResponse>('/admin/orders', params);
};

export const getOrder = (id: string) => {
	return api.get<GetOrderResponse>(`/admin/orders/${id}`);
};

export const updateOrder = (id: string, body: UpdateOrderBody) => {
	return api.put<UpdateOrderResponse>(`/admin/orders/${id}`, body);
};

export const cancelOrder = (id: string) => {
	return api.put<UpdateOrderResponse>(`/admin/orders/${id}`, {
		status: OrderStatus.Cancelled
	});
};

export const getProducts = (params?: ProductFilters) => {
	return api.get<GetProductsResponse>('/admin/products', params);
};

export const getProduct = (id: string) => {
	return api.get<GetProductResponse>(`/admin/products/${id}`);
};

export const createProduct = (body: CreateProductBody) => {
	return api.post<Product>('/admin/products', body);
};

export const updateProduct = (id: string, body: UpdateProductBody) => {
	return api.put<Product>(`/admin/products/${id}`, body);
};

export const deleteProduct = (id: string) => {
	return api.delete<void>(`/admin/products/${id}`);
};

export const getProductReviews = (id: string) => {
	return api.get(`/admin/products/${id}/reviews`);
};

export const getUsers = (params?: UserFilters) => {
	return api.get<GetUsersResponse>('/admin/users', params);
};

export const getUser = (id: string) => {
	return api.get<GetUserResponse>(`/admin/users/${id}`);
};

export const updateUser = (id: string, body: UpdateUserBody) => {
	return api.put<GetUserResponse>(`/admin/users/${id}`, body);
};

export const updateStore = (id: string, body: UpdateStoreBody) => {
	return api.put<Store>(`/admin/stores/${id}`, body);
};

export const createStore = (body: CreateStoreBody) => {
	return api.post<Store>('/admin/stores', body);
};

export const deleteStore = (id: string) => {
	return api.delete<void>(`/admin/stores/${id}`);
};

export const getStores = (params?: StoreFilters) => {
	return api.get<GetStoresResponse>('/admin/stores', params);
};

export const getStore = (id: string) => {
	return api.get<GetStoreResponse>(`/admin/stores/${id}`);
};

export const getStoreProducts = (id: string, params?: StoreFilters) => {
	return api.get<GetStoreProductsResponse>(
		`/admin/stores/${id}/products`,
		params
	);
};

export const getStoreOrders = (id: string, params?: StoreFilters) => {
	return api.get<GetStoreOrdersResponse>(`/admin/stores/${id}/orders`, params);
};

export const getStoreTransactions = (
	id: string,
	params?: TransactionFilters
) => {
	return api.get<GetStoreTransactionsResponse>(
		`/admin/stores/${id}/transactions`,
		params
	);
};

export const getStoreManagers = (id: string, params?: StoreFilters) => {
	return api.get<GetStoreManagersResponse>(
		`/admin/stores/${id}/managers`,
		params
	);
};

export const getOverview = () => {
	return api.get<GetOverviewResponse>('/admin/overview');
};

export const updateTransaction = (id: string, body: UpdateTransactionBody) => {
	return api.patch<UpdateTransactionResponse>(
		`/admin/transactions/${id}`,
		body
	);
};

// Bulk User Operations
export const bulkUpdateUsers = (
	ids: string[],
	field: 'suspended',
	value: boolean
) => {
	return api.post<BulkActionResponse>('/admin/users/bulk', {
		ids,
		field,
		value
	});
};

export const bulkDeleteUsers = (ids: string[]) => {
	return api.delete<BulkActionResponse>('/admin/users/bulk', { ids });
};

// Bulk Order Operations
export const bulkUpdateOrders = (
	ids: string[],
	field: 'status',
	value: OrderStatus
) => {
	return api.post<BulkActionResponse>('/admin/orders/bulk', {
		ids,
		field,
		value
	});
};

export const bulkDeleteOrders = (ids: string[]) => {
	return api.delete<BulkActionResponse>('/admin/orders/bulk', { ids });
};

// Bulk Product Operations
export const bulkUpdateProducts = (
	ids: string[],
	field: 'status',
	value: ProductStatus
) => {
	return api.post<BulkActionResponse>('/admin/products/bulk', {
		ids,
		field,
		value
	});
};

export const bulkDeleteProducts = (ids: string[]) => {
	return api.delete<BulkActionResponse>('/admin/products/bulk', { ids });
};

// Bulk Store Operations
export const bulkUpdateStores = (
	ids: string[],
	field: 'unlisted',
	value: boolean
) => {
	return api.post<BulkActionResponse>('/admin/stores/bulk', {
		ids,
		field,
		value
	});
};

export const bulkDeleteStores = (ids: string[]) => {
	return api.delete<BulkActionResponse>('/admin/stores/bulk', { ids });
};
