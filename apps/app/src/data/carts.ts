import APIService from './api';

export interface AddProductToCartBody {
	productId: string;
	storeId: string;
	quantity?: number;
}

export interface UpdateCartProductBody {
	productId: string;
	cartId: string;
	quantity: number;
}

export interface CartFilters {
	storeId?: string;
}

export default class CartService {
	private api: APIService;

	constructor(api: APIService) {
		this.api = api;
	}

	public getCarts() {
		return this.api.get('/users/current/carts');
	}

	public getCart(cartId: string) {
		return this.api.get(`/carts/${cartId}`);
	}

	public addProductToCart(body: AddProductToCartBody) {
		return this.api.post(`/carts/products`, body);
	}

	public removeProductFromCart(cartId: string, productId: string) {
		return this.api.delete(`/carts/${cartId}/products/${productId}`);
	}

	public updateCartProduct(productId: string, body: UpdateCartProductBody) {
		return this.api.patch(`/carts/${body.cartId}/products/${productId}`, body);
	}
}
