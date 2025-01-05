import APIService from './api';

export interface ProductFilters {
	filter?: Record<string, any>;
	orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface CreateReviewBody {
	rating: number;
	comment: string;
}

export default class ProductService {
	private api: APIService;

	constructor(api: APIService) {
		this.api = api;
	}

	public getProducts(params?: ProductFilters) {
		return this.api.get('/products', { params });
	}

	public getProduct(id: string) {
		return this.api.get(`/products/${id}`);
	}

	public getProductReviews(id: string) {
		return this.api.get(`/products/${id}/reviews`);
	}

	public createProductReview(id: string, body: CreateReviewBody) {
		return this.api.post(`/products/${id}/reviews`, body);
	}

	public getRelatedProducts(id: string) {
		return this.api.get(`/products/${id}/related`);
	}

	public addProductReview(id: string, body: CreateReviewBody) {
		return this.api.post(`/products/${id}/reviews`, body);
	}

	public updateProductReview(
		id: string,
		reviewId: string,
		body: CreateReviewBody
	) {
		return this.api.patch(`/products/${id}/reviews/${reviewId}`, body);
	}

	public deleteProductReview(id: string, reviewId: string) {
		return this.api.delete(`/products/${id}/reviews/${reviewId}`);
	}
}
