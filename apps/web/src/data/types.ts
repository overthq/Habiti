export interface User {
	id: string;
	name: string;
	email: string;
}

export interface Store {
	id: string;
	name: string;
	imageId?: string;
	image?: Image;
}

export interface Image {
	id: string;
	path: string;
	publicId: string;
}

export interface Product {
	id: string;
	name: string;
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
	user: User;
}

export interface Order {
	id: string;
	userId: string;
	storeId: string;
	products: OrderProduct[];
	total: number;
	user: User;
	store: Store;
	status: string;
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

export interface Card {
	id: string;
	userId: string;
	email: string;
	cardType: string;
	last4: string;
}

export interface DeliveryAddress {
	id: string;
	name: string;
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
	productId: string;
	quantity: number;
}

export interface RegisterBody {
	name: string;
	email: string;
	password: string;
}
