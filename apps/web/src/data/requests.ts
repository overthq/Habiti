import axios from 'axios';
import type {
	UpdateUserBody,
	AddDeliveryAddressBody,
	UpdateDeliveryAddressBody,
	AddToCartBody,
	RegisterBody,
	Cart,
	Order,
	Store,
	User,
	Card,
	AuthenticateBody,
	CreateOrderBody,
	UpdateCartProductQuantityBody,
	GetProductResponse,
	GetStoreResponse,
	StoreFollower
} from './types';
import { useAuthStore } from '@/state/auth-store';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
});

api.interceptors.request.use(config => {
	const { accessToken } = useAuthStore.getState();

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

// Authentication

export const authenticate = async (input: AuthenticateBody) => {
	const response = await api.post('/auth/login', input);
	return response.data;
};

export const register = async (input: RegisterBody) => {
	const response = await api.post('/auth/register', input);
	return response.data;
};

// Current User

export const getCurrentUser = async () => {
	const response = await api.get('/users/current');
	return response.data;
};

export const updateCurrentUser = async (body: UpdateUserBody) => {
	const response = await api.patch('/users/current', body);
	return response.data;
};

export const getFollowedStores = async () => {
	const response = await api.get<{ stores: Store[] }>(
		'/users/current/followed-stores'
	);

	return response.data;
};

export const getOrders = async () => {
	const response = await api.get<{ orders: Order[] }>('/users/current/orders');
	return response.data;
};

export const getCarts = async () => {
	const response = await api.get<{ carts: Cart[] }>('/users/current/carts');
	return response.data;
};

// Stores

export const getStore = async (storeId: string) => {
	const response = await api.get<GetStoreResponse>(`/stores/${storeId}`);
	return response.data;
};

export const followStore = async (storeId: string) => {
	const response = await api.post<{ follower: StoreFollower }>(
		`/stores/${storeId}/follow`
	);
	return response.data;
};

export const unfollowStore = async (storeId: string) => {
	const response = await api.post<{ follower: StoreFollower }>(
		`/stores/${storeId}/unfollow`
	);
	return response.data;
};

export const addDeliveryAddress = async (body: AddDeliveryAddressBody) => {
	const response = await api.post('/users/current/delivery-addresses', body);
	return response.data;
};

export const updateDeliveryAddress = async (
	addressId: string,
	body: UpdateDeliveryAddressBody
) => {
	const response = await api.put(`/delivery-addresses/${addressId}`, body);
	return response.data;
};

export const deleteDeliveryAddress = (addressId: string) => {
	return api.delete(`/delivery-addresses/${addressId}`);
};

export const getCards = async () => {
	const response = await api.get<{ cards: Card[] }>('/users/current/cards');
	return response.data;
};

export const getUser = async (userId: string) => {
	const response = await api.get<{ user: User }>(`/users/${userId}`);
	return response.data;
};

// Carts

export const getCart = async (cartId: string) => {
	const response = await api.get<{ cart: Cart }>(`/carts/${cartId}`);
	return response.data;
};

export const addToCart = async (body: AddToCartBody) => {
	const response = await api.post<{ cart: Cart }>('/carts/products', body);
	return response.data;
};

export const removeFromCart = async (cartId: string, productId: string) => {
	const response = await api.delete<{ cart: Cart }>(
		`/carts/${cartId}/products/${productId}`
	);
	return response.data;
};

export const updateCartProductQuantity = async ({
	cartId,
	productId,
	quantity
}: UpdateCartProductQuantityBody) => {
	const response = await api.put<{ cart: Cart }>(
		`/carts/${cartId}/products/${productId}`,
		{ quantity }
	);
	return response.data;
};

// Orders

export const getOrder = async (orderId: string) => {
	const response = await api.get<{ order: Order }>(`/orders/${orderId}`);
	return response.data;
};

export const createOrder = async (body: CreateOrderBody) => {
	const response = await api.post<{ order: Order }>('/orders', body);
	return response.data;
};

// Products

export const getProduct = async (productId: string) => {
	const response = await api.get<GetProductResponse>(`/products/${productId}`);
	return response.data;
};
