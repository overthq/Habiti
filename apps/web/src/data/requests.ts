import axios from 'axios';
import type {
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
	CreateOrderResponse,
	GetProductResponse,
	GetStoreResponse,
	StoreFollower,
	GetCartResponse,
	GetRelatedProductsResponse,
	Product,
	UpdateCurrentUserBody,
	CartProduct,
	LandingHighlightsResponse,
	VerifyCodeBody
} from './types';
import { useAuthStore } from '@/state/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true
});

api.interceptors.request.use(config => {
	const { accessToken } = useAuthStore.getState();

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const { accessToken } = await refreshToken();
				useAuthStore.getState().logIn({ accessToken });

				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				useAuthStore.getState().logOut();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

// Authentication

export const authenticate = async (input: AuthenticateBody) => {
	const response = await api.post('/auth/login', input);
	return response.data;
};

export const register = async (input: RegisterBody) => {
	const response = await api.post('/auth/register', input);
	return response.data;
};

export const verifyCode = async (input: VerifyCodeBody) => {
	const response = await api.post('/auth/verify-code', input);
	return response.data;
};

export const logout = async () => {
	const response = await api.post('/auth/logout');
	return response.data;
};

// Current User

export const getCurrentUser = async () => {
	const response = await api.get('/users/current');
	return response.data;
};

export const updateCurrentUser = async (body: UpdateCurrentUserBody) => {
	const response = await api.put('/users/current', body);
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

export const getStoreProducts = async (
	storeId: string,
	queryParams: URLSearchParams
) => {
	const response = await api.get<{ products: Product[] }>(
		`/stores/${storeId}/products`,
		{ params: queryParams }
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
	const response = await api.get<GetCartResponse>(`/carts/${cartId}`);
	return response.data;
};

export const addToCart = async (body: AddToCartBody) => {
	const response = await api.post<{ cartProduct: CartProduct }>(
		'/carts/products',
		body
	);
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
	const response = await api.put<{ cartProduct: CartProduct }>(
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
	const response = await api.post<CreateOrderResponse>('/orders', body);
	return response.data;
};

// Products

export const getProduct = async (productId: string) => {
	const response = await api.get<GetProductResponse>(`/products/${productId}`);
	return response.data;
};

export const getRelatedProducts = async (productId: string) => {
	const response = await api.get<GetRelatedProductsResponse>(
		`/products/${productId}/related`
	);

	return response.data;
};

// Search

export const globalSearch = async (query: string) => {
	const response = await api.get<{ products: Product[]; stores: Store[] }>(
		`/search?query=${query}`
	);

	return response.data;
};

export const getLandingHighlights = async () => {
	const response = await api.get<LandingHighlightsResponse>(
		'/landing/highlights'
	);

	return response.data;
};

interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
}

let inflightRefresh: Promise<RefreshTokenResponse> | null = null;

export const refreshToken = async () => {
	if (inflightRefresh) {
		return inflightRefresh;
	}

	inflightRefresh = axios
		.post<RefreshTokenResponse>(
			`${API_URL}/auth/refresh`,
			{},
			{ withCredentials: true }
		)
		.then(response => {
			const data = response.data;

			if (!data.accessToken || !data.refreshToken) {
				throw new Error('Invalid refresh token');
			}

			useAuthStore.getState().logIn({ accessToken: data.accessToken });

			return {
				accessToken: data.accessToken,
				refreshToken: data.refreshToken
			};
		})
		.finally(() => {
			inflightRefresh = null;
		});

	return inflightRefresh;
};
