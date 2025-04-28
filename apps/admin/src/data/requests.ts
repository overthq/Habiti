import { api } from './api';
import {
	LoginBody,
	LoginResponse,
	CreateAdminBody,
	CreateAdminResponse,
	OrderFilters,
	GetOrdersResponse,
	GetOrderResponse,
	UpdateOrderBody,
	UpdateOrderResponse,
	OrderStatus,
	ProductFilters,
	GetProductsResponse,
	GetProductResponse,
	CreateProductBody,
	UpdateProductBody,
	Product,
	GetUsersResponse,
	GetUserResponse,
	UpdateUserBody,
	UpdateStoreBody,
	Store,
	GetStoreManagersResponse,
	GetStorePayoutsResponse,
	GetStoreOrdersResponse,
	GetStoreProductsResponse,
	GetStoreResponse,
	GetStoresResponse,
	StoreFilters,
	GetOverviewResponse
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
	return api.patch<UpdateOrderResponse>(`/orders/${id}`, body);
};

export const cancelOrder = (id: string) => {
	return api.patch<UpdateOrderResponse>(`/orders/${id}`, {
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
	return api.patch<Product>(`/products/${id}`, body);
};

export const deleteProduct = (id: string) => {
	return api.delete<void>(`/products/${id}`);
};

export const getProductReviews = (id: string) => {
	return api.get(`/products/${id}/reviews`);
};

export const getUsers = () => {
	return api.get<GetUsersResponse>('/users');
};

export const getUser = (id: string) => {
	return api.get<GetUserResponse>(`/users/${id}`);
};

export const updateUser = (id: string, body: UpdateUserBody) => {
	return api.patch<GetUserResponse>(`/users/${id}`, body);
};

export const updateStore = (id: string, body: UpdateStoreBody) => {
	return api.patch<Store>(`/stores/${id}`, body);
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
