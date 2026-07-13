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
	VerifyCodeBody,
	VerifyCodeResponse,
	CardAuthorizationResponse,
	CreateStoreBody
} from './types';
import { OrderStatus } from './types';
import { openPaystackPopup } from '@/lib/payments';
import { pollUntil } from '@/lib/poll';
import { useAuthStore } from '@/state/auth-store';
import {
	computeRetryDelayMs,
	extractRetryAfterSec,
	shouldAutoRetry,
	sleep
} from './rateLimit';

const API_URL =
	(import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

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
		const isAuthRoute = originalRequest?.url?.startsWith('/auth/');
		const status = error.response?.status;

		// 429: respect Retry-After / RateLimit-Reset. Auto-retry only for
		// short waits with full jitter — anything longer surfaces to the
		// UI. Pinned to one auto-retry per request via `_rateLimitRetry`.
		if (
			status === 429 &&
			!originalRequest._rateLimitRetry &&
			error.response?.headers
		) {
			const delaySec = extractRetryAfterSec(error.response.headers);
			if (shouldAutoRetry(delaySec)) {
				originalRequest._rateLimitRetry = true;
				await sleep(computeRetryDelayMs(delaySec!));
				return api(originalRequest);
			}
			(error as any).retryAfterSeconds = delaySec ?? undefined;
		}

		if (status === 401 && !originalRequest._retry && !isAuthRoute) {
			originalRequest._retry = true;

			try {
				const { accessToken } = await refreshToken();
				useAuthStore.getState().logIn({ accessToken });

				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				// Session is unrecoverable (revoked/expired). Degrade to a
				// fresh guest session so browsing stays usable; only log out
				// if even that fails (offline).
				try {
					const { accessToken } = await startGuestSession();
					originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					return api(originalRequest);
				} catch {
					useAuthStore.getState().logOut();
					return Promise.reject(refreshError);
				}
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
	const response = await api.post<VerifyCodeResponse>(
		'/auth/verify-code',
		input
	);
	return response.data;
};

export const logout = async () => {
	const response = await api.post('/auth/logout');
	return response.data;
};

// Current User

export const getCurrentUser = async () => {
	const response = await api.get<{ user: User }>('/users/current');
	return response.data;
};

export const updateCurrentUser = async (body: UpdateCurrentUserBody) => {
	const response = await api.put('/users/current', body);
	return response.data;
};

export const deleteCurrentUser = async () => {
	const response = await api.delete('/users/current');
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

export const createStore = async (body: CreateStoreBody) => {
	const response = await api.post<{ store: Store }>('/stores', body);
	return response.data;
};

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
	const response = await api.put(
		`/users/current/delivery-addresses/${addressId}`,
		body
	);
	return response.data;
};

export const deleteDeliveryAddress = (addressId: string) => {
	return api.delete(`/users/current/delivery-addresses/${addressId}`);
};

export const getCards = async () => {
	const response = await api.get<{ cards: Card[] }>('/users/current/cards');
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
	const response = await api.get<{ order: Order }>(
		`/users/current/orders/${orderId}`
	);
	return response.data;
};

export const confirmPickup = async (orderId: string) => {
	const response = await api.post<{ order: Order }>(
		`/users/current/orders/${orderId}/confirm-pickup`
	);
	return response.data;
};

export const createOrder = async (body: CreateOrderBody) => {
	const response = await api.post<CreateOrderResponse>(
		'/users/current/orders',
		body
	);
	return response.data;
};

export const createOrderWithPayment = async (body: CreateOrderBody) => {
	const data = await createOrder(body);

	if (data.cardAuthorizationData) {
		openPaystackPopup(data.cardAuthorizationData.access_code);

		await pollUntil(
			() => getOrder(data.order.id),
			result => result.order.status !== OrderStatus.PaymentPending
		);
	}

	return data;
};

export const getCardAuthorization = async (orderId: string) => {
	const response = await api.post<CardAuthorizationResponse>(
		'/users/current/cards/authorize',
		{ orderId }
	);
	return response.data;
};

export const completeOrderPayment = async (orderId: string) => {
	const data = await getCardAuthorization(orderId);
	openPaystackPopup(data.access_code);

	return pollUntil(
		() => getOrder(orderId),
		result => result.order.status !== OrderStatus.PaymentPending
	);
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

// Cards

export const deleteCard = async (cardId: string) => {
	const response = await api.delete(`/users/current/cards/${cardId}`);

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

export const startGuestSession = async (): Promise<RefreshTokenResponse> => {
	const response = await axios.post<RefreshTokenResponse>(
		`${API_URL}/auth/anonymous`,
		{},
		{ withCredentials: true }
	);

	const data = response.data;

	if (!data.accessToken || !data.refreshToken) {
		throw new Error('Could not start a guest session');
	}

	useAuthStore.getState().logIn({ accessToken: data.accessToken });

	return {
		accessToken: data.accessToken,
		refreshToken: data.refreshToken
	};
};

/**
 * Guarantee a usable session: resume the stored one if possible, otherwise
 * start a fresh anonymous (guest) session. The web app never requires the
 * user to authenticate just to browse — auth is only prompted in-context
 * (viewing orders, placing an order).
 */
export const ensureSession = async (): Promise<RefreshTokenResponse> => {
	try {
		return await refreshToken();
	} catch {
		return startGuestSession();
	}
};

/**
 * Log out: revoke the session server-side (best effort, via the refresh
 * cookie), then roll straight into a new guest session so the app stays
 * usable. Only falls back to the logged-out state if the guest session
 * cannot be created (e.g. offline).
 */
export const performLogout = async (): Promise<void> => {
	try {
		await logout();
	} catch {
		// Best effort — the cookie is replaced by the new guest session
		// below either way, and the server prunes expired sessions.
	}

	try {
		await startGuestSession();
	} catch {
		useAuthStore.getState().logOut();
	}
};
