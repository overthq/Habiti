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
	type GetStorePayoutsResponse,
	type GetStoreOrdersResponse,
	type GetStoreProductsResponse,
	type GetStoreResponse,
	type GetStoresResponse,
	type StoreFilters,
	type GetOverviewResponse,
	type PayoutFilters,
	type GetPayoutsResponse,
	type GetPayoutResponse,
	type UpdatePayoutBody,
	type UpdatePayoutResponse,
	type BulkActionResponse,
	ProductStatus
} from './types';

export const login = (body: LoginBody) => {
	return api.post<LoginResponse>('/admin/login', body);
};

export const createAdmin = (body: CreateAdminBody) => {
	return api.post<CreateAdminResponse>('/admin/register', body);
};

export const getOrders = (params?: OrderFilters) => {
	return api.get<GetOrdersResponse>('/orders', params);
};

export const getOrder = (id: string) => {
	return api.get<GetOrderResponse>(`/orders/${id}`);
};

export const updateOrder = (id: string, body: UpdateOrderBody) => {
	return api.put<UpdateOrderResponse>(`/orders/${id}`, body);
};

export const cancelOrder = (id: string) => {
	return api.put<UpdateOrderResponse>(`/orders/${id}`, {
		status: OrderStatus.Cancelled
	});
};

export const getProducts = (params?: ProductFilters) => {
	return api.get<GetProductsResponse>('/products', params);
};

export const getProduct = (id: string) => {
	return api.get<GetProductResponse>(`/products/${id}`);
};

export const createProduct = (body: CreateProductBody) => {
	return api.post<Product>('/products', body);
};

export const updateProduct = (id: string, body: UpdateProductBody) => {
	return api.put<Product>(`/products/${id}`, body);
};

export const deleteProduct = (id: string) => {
	return api.delete<void>(`/products/${id}`);
};

export const getProductReviews = (id: string) => {
	return api.get(`/products/${id}/reviews`);
};

export const getUsers = (params?: UserFilters) => {
	return api.get<GetUsersResponse>('/users', params);
};

export const getUser = (id: string) => {
	return api.get<GetUserResponse>(`/users/${id}`);
};

export const updateUser = (id: string, body: UpdateUserBody) => {
	return api.put<GetUserResponse>(`/users/${id}`, body);
};

export const updateStore = (id: string, body: UpdateStoreBody) => {
	return api.put<Store>(`/stores/${id}`, body);
};

export const createStore = (body: CreateStoreBody) => {
	return api.post<Store>('/admin/stores', body);
};

export const deleteStore = (id: string) => {
	return api.delete<void>(`/stores/${id}`);
};

export const getStores = (params?: StoreFilters) => {
	return api.get<GetStoresResponse>('/stores', params);
};

export const getStore = (id: string) => {
	return api.get<GetStoreResponse>(`/stores/${id}`);
};

export const getStoreProducts = (id: string, params?: StoreFilters) => {
	return api.get<GetStoreProductsResponse>(`/stores/${id}/products`, params);
};

export const getStoreOrders = (id: string, params?: StoreFilters) => {
	return api.get<GetStoreOrdersResponse>(`/stores/${id}/orders`, params);
};

export const getStorePayouts = (id: string, params?: StoreFilters) => {
	return api.get<GetStorePayoutsResponse>(`/stores/${id}/payouts`, params);
};

export const getStoreManagers = (id: string, params?: StoreFilters) => {
	return api.get<GetStoreManagersResponse>(`/stores/${id}/managers`, params);
};

export const getOverview = () => {
	return api.get<GetOverviewResponse>('/admin/overview');
};

export const getPayouts = (params?: PayoutFilters) => {
	return api.get<GetPayoutsResponse>('/payouts', params);
};

export const getPayout = (id: string) => {
	return api.get<GetPayoutResponse>(`/payouts/${id}`);
};

export const updatePayout = (id: string, body: UpdatePayoutBody) => {
	return api.patch<UpdatePayoutResponse>(`/payouts/${id}`, body);
};

// Bulk User Operations
export const bulkSuspendUsers = (ids: string[]) => {
	return api.post<BulkActionResponse>('/admin/users/bulk-suspend', { ids });
};

export const bulkUnsuspendUsers = (ids: string[]) => {
	return api.post<BulkActionResponse>('/admin/users/bulk-unsuspend', { ids });
};

export const bulkDeleteUsers = (ids: string[]) => {
	return api.delete<BulkActionResponse>('/admin/users/bulk', { ids });
};

// Bulk Order Operations
export const bulkCancelOrders = (ids: string[]) => {
	return api.post<BulkActionResponse>('/admin/orders/bulk-cancel', { ids });
};

export const bulkUpdateOrderStatus = (ids: string[], status: OrderStatus) => {
	return api.post<BulkActionResponse>('/admin/orders/bulk-status', {
		ids,
		status
	});
};

// Bulk Product Operations
export const bulkDeleteProducts = (ids: string[]) => {
	return api.delete<BulkActionResponse>('/admin/products/bulk', { ids });
};

export const bulkUpdateProductStatus = (
	ids: string[],
	status: ProductStatus
) => {
	return api.post<BulkActionResponse>('/admin/products/bulk-status', {
		ids,
		status
	});
};
