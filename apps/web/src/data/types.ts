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
	storeId: string;
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
	createdAt: string;
	updatedAt: string;
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

export interface StoreFollower {
	storeId: string;
	followerId: string;
	createdAt: string;
	updatedAt: string;
	store: Store;
	follower: User;
}

export enum OrderStatus {
	Pending = 'Pending',
	Cancelled = 'Cancelled',
	Completed = 'Completed',
	PaymentPending = 'PaymentPending'
}

export interface StoreViewerContext {
	isFollowing: boolean;
	hasCart: boolean;
}

export interface GetStoreResponse {
	store: Store;
	viewerContext: StoreViewerContext | null;
}

export interface ProductViewerContext {
	cartProduct: CartProduct;
}

export interface GetProductResponse {
	product: Product;
	viewerContext: ProductViewerContext;
}

export interface CartViewerContext {
	cards: Card[];
}

export interface GetCartResponse {
	cart: Cart;
	viewerContext: CartViewerContext;
}
//TODO: Replace "-Body" with "-Args", since some of these might just be params

export interface AuthenticateBody {
	email: string;
	password: string;
}

export interface UpdateCurrentUserBody {
	name?: string;
	email?: string;
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

export interface CreateOrderBody {
	cartId: string;
	cardId?: string | null;
	// FIXME: We shouldn't be passing these from the frontend
	transactionFee: number;
	serviceFee: number;
}

export interface CreateOrderResponse {
	order: Order;
	cardAuthorizationData?: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
}

export interface UpdateCartProductQuantityBody {
	cartId: string;
	productId: string;
	quantity: number;
}

export interface GetRelatedProductsResponse {
	products: Product[];
}
