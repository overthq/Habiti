import axios from 'axios';
import env from '../../env';
import useStore from '../state';
import { refreshAuthTokens } from '../utils/refreshManager';
import {
	AuthenticateBody,
	RegisterBody,
	Store,
	Product,
	ProductReview,
	ProductFilters,
	CreateProductBody,
	GetManagedStoresResponse,
	Payout,
	Order,
	OrderFilters,
	User,
	CreateStoreBody,
	CreatePayoutBody,
	UpdateOrderArgs,
	UpdateCurrentStoreBody,
	UpdateProductCategoriesArgs,
	CreateProductCategoryBody,
	UpdateProductCategoryArgs,
	StoreProductCategory,
	VerifyBankAccountBody,
	StoreOverview,
	CustomerInfo
} from './types';

const api = axios.create({
	baseURL: env.apiUrl,
	withCredentials: true
});

api.interceptors.request.use(config => {
	const { accessToken, activeStore } = useStore.getState();

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	if (activeStore) {
		config.headers['x-market-store-id'] = activeStore;
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
				const { accessToken } = await refreshAuthTokens();

				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				useStore.getState().logOut();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export const authenticate = async (input: AuthenticateBody) => {
	const response = await api.post('/auth/login', input);
	return response.data;
};

export const register = async (input: RegisterBody) => {
	const response = await api.post('/auth/register', input);
	return response.data;
};

export const uploadImage = async (uri: string) => {
	const filename = uri.split('/').pop() ?? 'image.jpg';
	const match = /\.(\w+)$/.exec(filename);
	const type = match ? `image/${match[1]}` : 'image/jpeg';

	const formData = new FormData();
	formData.append('images', { uri, name: filename, type } as any);

	const response = await api.post('/uploads/images', formData, {
		headers: { 'Content-Type': 'multipart/form-data' }
	});

	return response.data.images[0] as { url: string; publicId: string };
};

// Current Store

export const getCurrentStore = async (): Promise<{ store: Store }> => {
	const response = await api.get('/stores/current');
	return response.data;
};

export const createStore = async (body: CreateStoreBody) => {
	const response = await api.post<{ store: Store }>('/stores', body);
	return response.data;
};

export const updateCurrentStore = async (body: UpdateCurrentStoreBody) => {
	const response = await api.put<{ store: Store }>('/stores/current', body);
	return response.data;
};

export const getManagedStores = async () => {
	const response = await api.get<GetManagedStoresResponse>(
		'/users/current/managed-stores'
	);
	return response.data;
};

export const deleteStore = async (storeId: string) => {
	await api.delete(`/stores/${storeId}`);
};

export const getStoreManagers = async () => {
	const response = await api.get<{ managers: User[] }>(
		'/stores/current/managers'
	);
	return response.data;
};

export const getProducts = async (filters?: ProductFilters) => {
	const response = await api.get<{ products: Product[] }>(
		'/stores/current/products',
		{ params: filters }
	);

	return response.data;
};

export const getProduct = async (productId: string) => {
	const response = await api.get<{ product: Product }>(
		`/stores/current/products/${productId}`
	);
	return response.data;
};

export const getOrders = async (filters?: OrderFilters) => {
	const response = await api.get<{ orders: Order[] }>(
		'/stores/current/orders',
		{ params: filters }
	);

	return response.data;
};

export const getOrder = async (orderId: string) => {
	const response = await api.get<{ order: Order }>(
		`/stores/current/orders/${orderId}`
	);
	return response.data;
};

export const updateOrder = async (
	orderId: string,
	body: UpdateOrderArgs['body']
) => {
	const response = await api.put<{ order: Order }>(
		`/stores/current/orders/${orderId}`,
		body
	);
	return response.data;
};

export const getProductReviews = async (
	productId: string
): Promise<{ reviews: ProductReview[] }> => {
	const response = await api.get(
		`/stores/current/products/${productId}/reviews`
	);
	return response.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
	await api.delete(`/stores/current/products/${productId}`);
};

export const getCategories = async () => {
	const response = await api.get<{ categories: StoreProductCategory[] }>(
		`/stores/current/categories`
	);
	return response.data;
};

interface UpdateProductInput {
	name?: string;
	description?: string;
	price?: number;
	images?: string[];
	categoryId?: string;
}

export const updateProduct = async (
	productId: string,
	input: UpdateProductInput
): Promise<Product> => {
	const response = await api.put(
		`/stores/current/products/${productId}`,
		input
	);
	return response.data;
};

export const createProduct = async (body: CreateProductBody) => {
	const response = await api.post(`/stores/current/products`, body);

	return response.data;
};

export const getPayouts = async () => {
	const response = await api.get<{ payouts: Payout[] }>(
		'/stores/current/payouts'
	);
	return response.data;
};

export const getPayout = async (payoutId: string) => {
	const response = await api.get<{ payout: Payout }>(
		'/stores/current/payouts/' + payoutId
	);
	return response.data;
};

export const createPayout = async (body: CreatePayoutBody) => {
	const response = await api.post('/stores/current/payouts', body);
	return response.data;
};

export const createProductCategory = async (
	body: CreateProductCategoryBody
) => {
	const response = await api.post('/stores/current/categories', body);
	return response.data;
};

export const updateProductCategory = async (
	categoryId: string,
	body: UpdateProductCategoryArgs['body']
) => {
	const response = await api.put(
		`/stores/current/categories/${categoryId}`,
		body
	);
	return response.data;
};

export const deleteProductCategory = async (categoryId: string) => {
	await api.delete(`/stores/current/categories/${categoryId}`);
};

export const updateProductCategories = async (
	productId: string,
	body: UpdateProductCategoriesArgs['body']
) => {
	const response = await api.put(
		`/stores/current/products/${productId}/categories`,
		body
	);
	return response.data;
};

interface VerifyBankAccountResponse {
	accountNumber: string;
	accountName: string;
}

export const getStoreOverview = async () => {
	const response = await api.get<StoreOverview>('/stores/current/overview');
	return response.data;
};

export const verifyBankAccount = async (body: VerifyBankAccountBody) => {
	const response = await api.post<VerifyBankAccountResponse>(
		'/stores/current/verify-bank-account',
		body
	);
	return response.data;
};

export const getCustomer = async (userId: string) => {
	const response = await api.get<{ user: CustomerInfo }>(
		`/stores/current/customers/${userId}`
	);
	return response.data;
};
