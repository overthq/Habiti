export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	createdAt: string;
	updatedAt: string;
	orders: Order[];
	followed: StoreFollower[];
	cards: Card[];
	deliveryAddresses: DeliveryAddress[];
}

export interface Store {
	id: string;
	name: string;
	description: string;
	image?: Image;
	products: Product[];
	categories: Category[];
	createdAt: string;
	updatedAt: string;
}

export interface Product {
	id: string;
	name: string;
	description: string;
	images: Image[];
	unitPrice: number;
	createdAt: string;
	updatedAt: string;
}

export interface Cart {
	id: string;
	userId: string;
	storeId: string;
	total: number;
	products: CartProduct[];
	store: Store;
	createdAt: string;
	updatedAt: string;
}

export interface Card {
	id: string;
	cardType: string;
	last4: string;
	expMonth: number;
	expYear: number;
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface Order {
	id: string;
	store: Store;
	products: OrderProduct[];
	total: number;
	status: string;
	user: User;
	createdAt: string;
	updatedAt: string;
}

export interface OrderProduct {
	id: string;
	product: Product;
	quantity: number;
	unitPrice: number;
	createdAt: string;
	updatedAt: string;
}

export interface PaymentMethod {
	id: string;
	brand: string;
	last4: string;
	expMonth: number;
	expYear: number;
	createdAt: string;
	updatedAt: string;
}

export interface CartProduct {
	id: string;
	productId: string;
	quantity: number;
	userId: string;
	product: Product;
	createdAt: string;
	updatedAt: string;
}

export interface WatchlistProduct {
	id: string;
	productId: string;
	userId: string;
	product: Product;
	user: User;
	createdAt: string;
	updatedAt: string;
}

export interface Image {
	id: string;
	storeId: string;
	productId: string;
	path: string;
	store: Store;
	product: Product;
	createdAt: string;
	updatedAt: string;
}

export interface StoreManager {
	id: string;
	storeId: string;
	managerId: string;
	store: Store;
	manager: User;
	createdAt: string;
	updatedAt: string;
}

export interface StoreFollower {
	id: string;
	storeId: string;
	followerId: string;
	store: Store;
	follower: User;
	createdAt: string;
	updatedAt: string;
}

export interface Payout {
	id: string;
	storeId: string;
	amount: number;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface StoreProductCategory {
	id: string;
	storeId: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductCategory {
	id: string;
	productId: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductOption {
	id: string;
	productId: string;
	name: string;
	value: string;
	createdAt: string;
	updatedAt: string;
}

export interface DeliveryAddress {
	id: string;
	userId: string;
	street: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProductReview {
	id: string;
	productId: string;
	userId: string;
	rating: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
}

export enum OrderStatus {
	Cancelled = 'Cancelled',
	Pending = 'Pending',
	PaymentPending = 'PaymentPending',
	Completed = 'Completed'
}
