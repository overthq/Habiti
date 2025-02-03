import { APIService } from './api';

export interface Product {
	id: string;
	name: string;
	description: string;
	unitPrice: number;
	quantity: number;
	images: {
		id: string;
		path: string;
	}[];
	storeId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductFilters {
	filter?: Record<string, string | number>;
	orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface CreateProductBody {
	name: string;
	description: string;
	unitPrice: number;
	quantity: number;
	storeId: string;
}

export interface UpdateProductBody {
	name?: string;
	description?: string;
	unitPrice?: number;
	quantity?: number;
}

interface GetProductsResponse {
	products: Product[];
}

interface GetProductResponse {
	product: Product;
}

export class ProductService {
	constructor(private readonly api: APIService) {}

	async getProducts(params?: ProductFilters) {
		return this.api.get<GetProductsResponse>('/products', params);
	}

	async getProduct(id: string) {
		return this.api.get<GetProductResponse>(`/products/${id}`);
	}

	async createProduct(body: CreateProductBody) {
		return this.api.post<Product>('/products', body);
	}

	async updateProduct(id: string, body: UpdateProductBody) {
		return this.api.patch<Product>(`/products/${id}`, body);
	}

	async deleteProduct(id: string) {
		return this.api.delete<void>(`/products/${id}`);
	}

	async getProductReviews(id: string) {
		return this.api.get(`/products/${id}/reviews`);
	}
}
