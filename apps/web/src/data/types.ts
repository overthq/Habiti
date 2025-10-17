import { Vast_Shadow } from 'next/font/google';

export interface User {
	id: string;
	name: string;
	email: string;
	cards: Card[];
}

export interface Store {
	id: string;
	name: string;
	description?: string;
	imageId?: string;
	image?: Image;
	products: Product[];
	followedByUser: boolean;
}

export interface Image {
	id: string;
	path: string;
	publicId: string;
}

export interface Product {
	id: string;
	name: string;
	description: string;
	unitPrice: number;
	quantity: number;
	store: Store;
	images: Image[];
}

export interface Cart {
	id: string;
	userId: string;
	storeId: string;
	store: Store;
	products: CartProduct[];
	total: number;
	fees: {
		transaction: number;
		service: number;
		total: number;
	};
	user: User;
}

export interface Card {
	id: string;
}

export interface Order {
	id: string;
	userId: string;
	storeId: string;
	products: OrderProduct[];
	total: number;
	user: User;
	store: Store;
	status: OrderStatus;
	transactionFee: number;
	serviceFee: number;
	createdAt: string;
	updatedAt: string;
}

export interface OrderProduct {
	id: string;
	orderId: string;
	productId: string;
	product: Product;
	quantity: number;
	unitPrice: number;
}

export interface CartProduct {
	cartId: string;
	productId: string;
	cart: Cart;
	product: Product;
	quantity: number;
}

export interface StoreProduct {
	storeId: string;
	productId: string;
	product: Product;
}

export interface Card {
	id: string;
	userId: string;
	email: string;
	cardType: string;
	last4: string;
}

export interface ProductReview {
	id: string;
	userId: string;
	productId: string;
	body?: string;
	rating: number;
	createdAt: string;
	updatedAt: string;
	user: User;
	product: Product;
}

export interface DeliveryAddress {
	id: string;
	name: string;
}

export enum OrderStatus {
	Pending = 'Pending',
	Cancelled = 'Cancelled',
	Completed = 'Completed',
	PaymentPending = 'PaymentPending'
}

export interface AuthenticateBody {
	email: string;
	password: string;
}

export interface UpdateUserBody {
	name: string;
	email: string;
}

export interface AddDeliveryAddressBody {
	name: string;
}

export interface UpdateDeliveryAddressBody {
	name?: string;
}

export interface AddToCartBody {
	storeId: string; // FIXME: Maybe not necessary?
	productId: string;
	quantity: number;
}

export interface RegisterBody {
	name: string;
	email: string;
	password: string;
}

export interface GetProductResponse {
	product: Product;
	followed: boolean;
}

export interface CreateOrderBody {
	cartId: string;
	cardId: string;
	// FIXME: We shouldn't be passing these from the frontend
	transactionFee: number;
	serviceFee: number;
}
