import { gql } from 'urql';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	Upload: any;
};

export type AddDeliveryAddressInput = {
	name?: InputMaybe<Scalars['String']>;
};

export type AddProductOptionInput = {
	description?: InputMaybe<Scalars['String']>;
	name: Scalars['String'];
	productId: Scalars['ID'];
};

export type AddProductReviewInput = {
	body?: InputMaybe<Scalars['String']>;
	productId: Scalars['ID'];
	rating: Scalars['Int'];
};

export type AddProductToCategoryInput = {
	categoryId: Scalars['ID'];
	productId: Scalars['ID'];
};

export type AddStoreManagerInput = {
	managerId: Scalars['ID'];
	storeId: Scalars['ID'];
};

export type AddToCartInput = {
	productId: Scalars['ID'];
	quantity?: InputMaybe<Scalars['Int']>;
	storeId: Scalars['ID'];
};

export type AuthenticateInput = {
	email: Scalars['String'];
	password: Scalars['String'];
};

export type AuthenticateResponse = {
	__typename?: 'AuthenticateResponse';
	accessToken: Scalars['String'];
	userId: Scalars['ID'];
};

export type Card = {
	__typename?: 'Card';
	authorizationCode: Scalars['String'];
	bank: Scalars['String'];
	bin: Scalars['String'];
	cardType: Scalars['String'];
	countryCode: Scalars['String'];
	email: Scalars['String'];
	expMonth: Scalars['String'];
	expYear: Scalars['String'];
	id: Scalars['ID'];
	last4: Scalars['String'];
	signature: Scalars['String'];
	user: User;
	userId: Scalars['ID'];
};

export type CardAuthorization = {
	__typename?: 'CardAuthorization';
	access_code: Scalars['String'];
	authorization_url: Scalars['String'];
	id: Scalars['ID'];
	reference: Scalars['String'];
};

export type Cart = {
	__typename?: 'Cart';
	createdAt: Scalars['String'];
	id: Scalars['ID'];
	products: CartProduct[];
	store: Store;
	storeId: Scalars['ID'];
	total: Scalars['Int'];
	updatedAt: Scalars['String'];
	user: User;
	userId: Scalars['ID'];
};

export type CartProduct = {
	__typename?: 'CartProduct';
	cart: Cart;
	cartId: Scalars['ID'];
	id: Scalars['ID'];
	product: Product;
	productId: Scalars['ID'];
	quantity: Scalars['Int'];
};

export type CreateCartInput = {
	productId: Scalars['ID'];
	quantity: Scalars['Int'];
	storeId: Scalars['ID'];
};

export type CreateCategoryInput = {
	description?: InputMaybe<Scalars['String']>;
	name: Scalars['String'];
};

export type CreateOrderInput = {
	cardId?: InputMaybe<Scalars['ID']>;
	cartId: Scalars['ID'];
	serviceFee: Scalars['Int'];
	transactionFee: Scalars['Int'];
};

export type CreatePayoutInput = {
	amount: Scalars['Int'];
};

export type CreateProductInput = {
	description: Scalars['String'];
	imageFiles: Scalars['Upload'][];
	name: Scalars['String'];
	quantity: Scalars['Int'];
	unitPrice: Scalars['Int'];
};

export type CreateStoreInput = {
	bankAccountNumber?: InputMaybe<Scalars['String']>;
	bankCode?: InputMaybe<Scalars['String']>;
	description: Scalars['String'];
	instagram?: InputMaybe<Scalars['String']>;
	name: Scalars['String'];
	storeImage?: InputMaybe<Scalars['Upload']>;
	twitter?: InputMaybe<Scalars['String']>;
	website?: InputMaybe<Scalars['String']>;
};

export type DeliveryAddress = {
	__typename?: 'DeliveryAddress';
	id: Scalars['ID'];
	name?: Maybe<Scalars['String']>;
	user: User;
	userId: Scalars['ID'];
};

export type EditCategoryInput = {
	description?: InputMaybe<Scalars['String']>;
	name?: InputMaybe<Scalars['String']>;
};

export type EditProductInput = {
	description?: InputMaybe<Scalars['String']>;
	imageFiles: Scalars['Upload'][];
	name?: InputMaybe<Scalars['String']>;
	quantity?: InputMaybe<Scalars['Int']>;
	unitPrice?: InputMaybe<Scalars['Int']>;
};

export type EditProfileInput = {
	email?: InputMaybe<Scalars['String']>;
	name?: InputMaybe<Scalars['String']>;
};

export type EditStoreInput = {
	bankAccountNumber?: InputMaybe<Scalars['String']>;
	bankCode?: InputMaybe<Scalars['String']>;
	description?: InputMaybe<Scalars['String']>;
	imageFile?: InputMaybe<Scalars['Upload']>;
	instagram?: InputMaybe<Scalars['String']>;
	name?: InputMaybe<Scalars['String']>;
	twitter?: InputMaybe<Scalars['String']>;
	website?: InputMaybe<Scalars['String']>;
};

export type Filter = {
	__typename?: 'Filter';
	first?: Maybe<Scalars['Int']>;
	last?: Maybe<Scalars['Int']>;
};

export type Image = {
	__typename?: 'Image';
	createdAt: Scalars['String'];
	id: Scalars['ID'];
	path: Scalars['String'];
	product?: Maybe<Product>;
	productId?: Maybe<Scalars['ID']>;
	publicId: Scalars['String'];
	store?: Maybe<Store>;
	storeId?: Maybe<Scalars['ID']>;
	updatedAt: Scalars['String'];
};

export type IntWhere = {
	gt?: InputMaybe<Scalars['Int']>;
	gte?: InputMaybe<Scalars['Int']>;
	lt?: InputMaybe<Scalars['Int']>;
	lte?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
	__typename?: 'Mutation';
	_?: Maybe<Scalars['Boolean']>;
	addDeliveryAddress?: Maybe<DeliveryAddress>;
	addProductOption: ProductOption;
	addProductReview: ProductReview;
	addProductToCategory: ProductCategory;
	addStoreManager: StoreManager;
	addToCart: CartProduct;
	addToWatchlist: WatchlistProduct;
	authenticate: AuthenticateResponse;
	createCart: Cart;
	createOrder: Order;
	createPayout: Payout;
	createProduct: Product;
	createProductCategory: StoreProductCategory;
	createStore: Store;
	deleteAccount: User;
	deleteCard: Card;
	deleteCart: Cart;
	deleteImage: Image;
	deleteProduct: Product;
	deleteProductCategory: StoreProductCategory;
	deleteStore: Scalars['ID'];
	deleteUser: User;
	editProduct: Product;
	editProductCategory: StoreProductCategory;
	editProfile: User;
	editStore: Store;
	followStore: StoreFollower;
	register: User;
	removeFromCart: Scalars['ID'];
	removeProductFromCategory: ProductCategory;
	removeStoreManager: StoreManager;
	unfollowStore: StoreFollower;
	updateCartProduct: CartProduct;
	updateOrder: Order;
	verify: VerifyResponse;
	verifyBankAccount: VerifyBankAccountResponse;
};

export type MutationAddDeliveryAddressArgs = {
	input?: InputMaybe<AddDeliveryAddressInput>;
};

export type MutationAddProductOptionArgs = {
	input: AddProductOptionInput;
};

export type MutationAddProductReviewArgs = {
	input: AddProductReviewInput;
};

export type MutationAddProductToCategoryArgs = {
	input: AddProductToCategoryInput;
};

export type MutationAddStoreManagerArgs = {
	input?: InputMaybe<AddStoreManagerInput>;
};

export type MutationAddToCartArgs = {
	input: AddToCartInput;
};

export type MutationAddToWatchlistArgs = {
	productId: Scalars['ID'];
};

export type MutationAuthenticateArgs = {
	input: AuthenticateInput;
};

export type MutationCreateCartArgs = {
	input: CreateCartInput;
};

export type MutationCreateOrderArgs = {
	input: CreateOrderInput;
};

export type MutationCreatePayoutArgs = {
	input: CreatePayoutInput;
};

export type MutationCreateProductArgs = {
	input: CreateProductInput;
};

export type MutationCreateProductCategoryArgs = {
	input: CreateCategoryInput;
};

export type MutationCreateStoreArgs = {
	input: CreateStoreInput;
};

export type MutationDeleteCardArgs = {
	id: Scalars['ID'];
};

export type MutationDeleteCartArgs = {
	cartId: Scalars['ID'];
};

export type MutationDeleteImageArgs = {
	id: Scalars['ID'];
};

export type MutationDeleteProductArgs = {
	id: Scalars['ID'];
};

export type MutationDeleteProductCategoryArgs = {
	categoryId: Scalars['ID'];
};

export type MutationDeleteStoreArgs = {
	id: Scalars['ID'];
};

export type MutationDeleteUserArgs = {
	userId: Scalars['ID'];
};

export type MutationEditProductArgs = {
	id: Scalars['ID'];
	input: EditProductInput;
};

export type MutationEditProductCategoryArgs = {
	categoryId: Scalars['ID'];
	input: EditCategoryInput;
};

export type MutationEditProfileArgs = {
	input: EditProfileInput;
};

export type MutationEditStoreArgs = {
	input: EditStoreInput;
};

export type MutationFollowStoreArgs = {
	storeId: Scalars['ID'];
};

export type MutationRegisterArgs = {
	input: RegisterInput;
};

export type MutationRemoveFromCartArgs = {
	cartId: Scalars['ID'];
	productId: Scalars['ID'];
};

export type MutationRemoveProductFromCategoryArgs = {
	input: RemoveProductFromCategoryInput;
};

export type MutationRemoveStoreManagerArgs = {
	managerId: Scalars['ID'];
};

export type MutationUnfollowStoreArgs = {
	storeId: Scalars['ID'];
};

export type MutationUpdateCartProductArgs = {
	input: UpdateCartProductInput;
};

export type MutationUpdateOrderArgs = {
	input: UpdateOrderInput;
	orderId: Scalars['ID'];
};

export type MutationVerifyArgs = {
	input: VerifyInput;
};

export type MutationVerifyBankAccountArgs = {
	input: VerifyBankAccountInput;
};

export type NewStats = {
	__typename?: 'NewStats';
	daily: Stats;
	monthly: Stats;
	weekly: Stats;
	yearly: Stats;
};

export type Node = {
	id: Scalars['ID'];
};

export type Order = {
	__typename?: 'Order';
	createdAt: Scalars['String'];
	id: Scalars['ID'];
	products: OrderProduct[];
	serviceFee: Scalars['Int'];
	status: OrderStatus;
	store: Store;
	storeId: Scalars['ID'];
	total: Scalars['Int'];
	transactionFee: Scalars['Int'];
	updatedAt: Scalars['String'];
	user: User;
	userId: Scalars['ID'];
};

export type OrderOrderByInput = {
	createdAt?: InputMaybe<Sort>;
	total?: InputMaybe<Sort>;
	updatedAt?: InputMaybe<Sort>;
};

export type OrderProduct = {
	__typename?: 'OrderProduct';
	id: Scalars['ID'];
	order: Order;
	orderId: Scalars['ID'];
	product: Product;
	productId: Scalars['ID'];
	quantity: Scalars['Int'];
	unitPrice: Scalars['Int'];
};

export enum OrderStatus {
	Cancelled = 'Cancelled',
	Completed = 'Completed',
	Delivered = 'Delivered',
	Pending = 'Pending',
	Processing = 'Processing'
}

export type PageInfo = {
	__typename?: 'PageInfo';
	endCursor?: Maybe<Scalars['String']>;
	hasNextPage: Scalars['Boolean'];
	hasPreviousPage: Scalars['Boolean'];
	startCursor?: Maybe<Scalars['String']>;
};

export type Payout = {
	__typename?: 'Payout';
	amount: Scalars['Int'];
	createdAt: Scalars['String'];
	id: Scalars['ID'];
	store: Store;
	storeId: Scalars['ID'];
	updatedAt: Scalars['String'];
};

export type Product = {
	__typename?: 'Product';
	carts: CartProduct[];
	categories: ProductCategory[];
	createdAt: Scalars['String'];
	description: Scalars['String'];
	id: Scalars['ID'];
	images: Image[];
	inCart: Scalars['Boolean'];
	name: Scalars['String'];
	options: ProductOption[];
	orders: Order[];
	quantity: Scalars['Int'];
	reviews: ProductReview[];
	store: Store;
	storeId: Scalars['ID'];
	unitPrice: Scalars['Int'];
	updatedAt: Scalars['String'];
	watchlists: WatchlistProduct[];
};

export type ProductOrdersArgs = {
	orderBy?: InputMaybe<OrderOrderByInput[]>;
};

export type ProductCategory = {
	__typename?: 'ProductCategory';
	category: StoreProductCategory;
	categoryId: Scalars['ID'];
	id: Scalars['ID'];
	product: Product;
	productId: Scalars['ID'];
};

export type ProductCategoryEdge = {
	__typename?: 'ProductCategoryEdge';
	cursor: Scalars['String'];
	node?: Maybe<ProductCategory>;
};

export type ProductFilterInput = {
	name?: InputMaybe<StringWhere>;
	quantity?: InputMaybe<IntWhere>;
	unitPrice?: InputMaybe<IntWhere>;
};

export type ProductOption = {
	__typename?: 'ProductOption';
	description?: Maybe<Scalars['String']>;
	id: Scalars['ID'];
	name: Scalars['String'];
	product: Product;
	productId: Scalars['ID'];
};

export type ProductOrderByInput = {
	createdAt?: InputMaybe<Sort>;
	unitPrice?: InputMaybe<Sort>;
	updatedAt?: InputMaybe<Sort>;
};

export type ProductReview = {
	__typename?: 'ProductReview';
	body?: Maybe<Scalars['String']>;
	createdAt: Scalars['String'];
	id: Scalars['ID'];
	product: Product;
	productId: Scalars['ID'];
	rating: Scalars['Int'];
	updatedAt: Scalars['String'];
	user: User;
};

export enum PushTokenType {
	Merchant = 'Merchant',
	Shopper = 'Shopper'
}

export type Query = {
	__typename?: 'Query';
	cardAuthorization: CardAuthorization;
	cart: Cart;
	carts: Cart[];
	currentStore: Store;
	currentUser: User;
	node?: Maybe<Node>;
	order: Order;
	product: Product;
	products: Product[];
	stats: Stats;
	store: Store;
	storeProductCategory?: Maybe<StoreProductCategory>;
	stores: Store[];
	user: User;
	users: User[];
};

export type QueryCartArgs = {
	id: Scalars['ID'];
};

export type QueryNodeArgs = {
	id: Scalars['ID'];
};

export type QueryOrderArgs = {
	id: Scalars['ID'];
};

export type QueryProductArgs = {
	id: Scalars['ID'];
};

export type QueryProductsArgs = {
	filter?: InputMaybe<ProductFilterInput>;
	orderBy?: InputMaybe<ProductOrderByInput[]>;
};

export type QueryStatsArgs = {
	period?: InputMaybe<StatPeriod>;
};

export type QueryStoreArgs = {
	id: Scalars['ID'];
};

export type QueryStoreProductCategoryArgs = {
	id: Scalars['ID'];
};

export type QueryStoresArgs = {
	filter?: InputMaybe<StoreFilterInput>;
};

export type QueryUserArgs = {
	id: Scalars['ID'];
};

export type RegisterInput = {
	email: Scalars['String'];
	name: Scalars['String'];
	password: Scalars['String'];
};

export type RemoveProductFromCategoryInput = {
	categoryId: Scalars['ID'];
	productId: Scalars['ID'];
};

export enum Sort {
	Asc = 'asc',
	Desc = 'desc'
}

export enum StatPeriod {
	Day = 'Day',
	Month = 'Month',
	Week = 'Week',
	Year = 'Year'
}

export type Stats = {
	__typename?: 'Stats';
	id: Scalars['ID'];
	orders: Order[];
	pendingOrderCount: Scalars['Int'];
	products: Product[];
	revenue: Scalars['Int'];
	storeId: Scalars['ID'];
};

export type Store = {
	__typename?: 'Store';
	bankAccountNumber?: Maybe<Scalars['String']>;
	bankAccountReference?: Maybe<Scalars['String']>;
	bankCode?: Maybe<Scalars['String']>;
	cartId?: Maybe<Scalars['ID']>;
	carts: Cart[];
	categories: StoreProductCategory[];
	createdAt: Scalars['String'];
	description?: Maybe<Scalars['String']>;
	followedByUser: Scalars['Boolean'];
	followers: StoreFollower[];
	id: Scalars['ID'];
	image?: Maybe<Image>;
	instagram?: Maybe<Scalars['String']>;
	managers: StoreManager[];
	name: Scalars['String'];
	orders: Order[];
	paidOut: Scalars['Int'];
	payouts: Payout[];
	products: Product[];
	realizedRevenue: Scalars['Int'];
	twitter?: Maybe<Scalars['String']>;
	unrealizedRevenue: Scalars['Int'];
	updatedAt: Scalars['String'];
	website?: Maybe<Scalars['String']>;
};

export type StoreOrdersArgs = {
	orderBy?: InputMaybe<OrderOrderByInput[]>;
};

export type StoreProductsArgs = {
	filter?: InputMaybe<ProductFilterInput>;
	orderBy?: InputMaybe<ProductOrderByInput[]>;
};

export type StoreFilterInput = {
	name?: InputMaybe<StringWhere>;
};

export type StoreFollower = {
	__typename?: 'StoreFollower';
	follower: User;
	followerId: Scalars['ID'];
	id: Scalars['ID'];
	store: Store;
	storeId: Scalars['ID'];
};

export type StoreManager = {
	__typename?: 'StoreManager';
	id: Scalars['ID'];
	manager: User;
	managerId: Scalars['ID'];
	store: Store;
	storeId: Scalars['ID'];
};

export type StoreProductCategory = {
	__typename?: 'StoreProductCategory';
	description?: Maybe<Scalars['String']>;
	id: Scalars['ID'];
	name: Scalars['String'];
	products: ProductCategory[];
	store: Store;
	storeId: Scalars['ID'];
};

export enum StoreStatPeriod {
	Day = 'Day',
	Month = 'Month',
	Week = 'Week',
	Year = 'Year'
}

export type StringWhere = {
	contains?: InputMaybe<Scalars['String']>;
	endsWith?: InputMaybe<Scalars['String']>;
	mode?: InputMaybe<StringWhereMode>;
	search?: InputMaybe<Scalars['String']>;
	startsWith?: InputMaybe<Scalars['String']>;
};

export enum StringWhereMode {
	Default = 'default',
	Insensitive = 'insensitive'
}

export type UpdateCartProductInput = {
	cartId: Scalars['ID'];
	productId: Scalars['ID'];
	quantity: Scalars['Int'];
};

export type UpdateOrderInput = {
	status?: InputMaybe<OrderStatus>;
};

export type User = {
	__typename?: 'User';
	cards: Card[];
	carts: Cart[];
	createdAt: Scalars['String'];
	email: Scalars['String'];
	followed: StoreFollower[];
	id: Scalars['ID'];
	managed: StoreManager[];
	name: Scalars['String'];
	orders: Order[];
	pushTokens: UserPushToken[];
	updatedAt: Scalars['String'];
	watchlist: WatchlistProduct[];
};

export type UserPushToken = {
	__typename?: 'UserPushToken';
	id: Scalars['ID'];
	token: Scalars['String'];
	type: PushTokenType;
	userId: Scalars['String'];
};

export type VerifyBankAccountInput = {
	bankAccountNumber: Scalars['String'];
	bankCode: Scalars['String'];
};

export type VerifyBankAccountResponse = {
	__typename?: 'VerifyBankAccountResponse';
	accountName: Scalars['String'];
	accountNumber: Scalars['String'];
};

export type VerifyInput = {
	code: Scalars['String'];
	email: Scalars['String'];
};

export type VerifyResponse = {
	__typename?: 'VerifyResponse';
	accessToken: Scalars['String'];
	userId: Scalars['ID'];
};

export type WatchlistProduct = {
	__typename?: 'WatchlistProduct';
	id: Scalars['ID'];
	product: Product;
	productId: Scalars['ID'];
	user: User;
	userId: Scalars['ID'];
};

export type CardsQueryVariables = Exact<{ [key: string]: never }>;

export type CardsQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		cards: {
			__typename?: 'Card';
			id: string;
			email: string;
			cardType: string;
			last4: string;
			expMonth: string;
			expYear: string;
			bank: string;
			countryCode: string;
		}[];
	};
};

export type CardAuthorizationQueryVariables = Exact<{ [key: string]: never }>;

export type CardAuthorizationQuery = {
	__typename?: 'Query';
	cardAuthorization: {
		__typename?: 'CardAuthorization';
		id: string;
		authorization_url: string;
		access_code: string;
		reference: string;
	};
};

export type CartsQueryVariables = Exact<{ [key: string]: never }>;

export type CartsQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		carts: {
			__typename?: 'Cart';
			id: string;
			userId: string;
			storeId: string;
			total: number;
			store: {
				__typename?: 'Store';
				id: string;
				name: string;
				image?: { __typename?: 'Image'; id: string; path: string } | null;
			};
			products: {
				__typename?: 'CartProduct';
				id: string;
				quantity: number;
			}[];
		}[];
	};
};

export type CartQueryVariables = Exact<{
	cartId: Scalars['ID'];
}>;

export type CartQuery = {
	__typename?: 'Query';
	cart: {
		__typename?: 'Cart';
		id: string;
		userId: string;
		storeId: string;
		total: number;
		user: {
			__typename?: 'User';
			id: string;
			cards: {
				__typename?: 'Card';
				id: string;
				email: string;
				cardType: string;
				last4: string;
			}[];
		};
		store: { __typename?: 'Store'; id: string; name: string };
		products: {
			__typename?: 'CartProduct';
			id: string;
			cartId: string;
			productId: string;
			quantity: number;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
				storeId: string;
				images: { __typename?: 'Image'; id: string; path: string }[];
			};
		}[];
	};
};

export type AddToCartMutationVariables = Exact<{
	input: AddToCartInput;
}>;

export type AddToCartMutation = {
	__typename?: 'Mutation';
	addToCart: {
		__typename?: 'CartProduct';
		id: string;
		cartId: string;
		productId: string;
		quantity: number;
	};
};

export type RemoveFromCartMutationVariables = Exact<{
	productId: Scalars['ID'];
	cartId: Scalars['ID'];
}>;

export type RemoveFromCartMutation = {
	__typename?: 'Mutation';
	removeFromCart: string;
};

export type CreateCartMutationVariables = Exact<{
	input: CreateCartInput;
}>;

export type CreateCartMutation = {
	__typename?: 'Mutation';
	createCart: {
		__typename?: 'Cart';
		id: string;
		userId: string;
		storeId: string;
		total: number;
		store: { __typename?: 'Store'; id: string; name: string };
		products: {
			__typename?: 'CartProduct';
			cartId: string;
			productId: string;
			cart: { __typename?: 'Cart'; id: string };
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
			};
		}[];
	};
};

export type DeleteCartMutationVariables = Exact<{
	cartId: Scalars['ID'];
}>;

export type DeleteCartMutation = {
	__typename?: 'Mutation';
	deleteCart: { __typename?: 'Cart'; id: string };
};

export type UpdateCartProductMutationVariables = Exact<{
	input: UpdateCartProductInput;
}>;

export type UpdateCartProductMutation = {
	__typename?: 'Mutation';
	updateCartProduct: {
		__typename?: 'CartProduct';
		cartId: string;
		productId: string;
		quantity: number;
		cart: { __typename?: 'Cart'; id: string };
		product: { __typename?: 'Product'; id: string };
	};
};

export type HomeQueryVariables = Exact<{ [key: string]: never }>;

export type HomeQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		orders: {
			__typename?: 'Order';
			id: string;
			total: number;
			status: OrderStatus;
			createdAt: string;
			store: {
				__typename?: 'Store';
				id: string;
				name: string;
				image?: { __typename?: 'Image'; id: string; path: string } | null;
			};
			products: {
				__typename?: 'OrderProduct';
				id: string;
				unitPrice: number;
				quantity: number;
				product: { __typename?: 'Product'; id: string; name: string };
			}[];
		}[];
		followed: {
			__typename?: 'StoreFollower';
			id: string;
			storeId: string;
			followerId: string;
			store: {
				__typename?: 'Store';
				id: string;
				name: string;
				image?: { __typename?: 'Image'; id: string; path: string } | null;
			};
		}[];
		watchlist: {
			__typename?: 'WatchlistProduct';
			id: string;
			userId: string;
			productId: string;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
				store: { __typename?: 'Store'; id: string; name: string };
				images: { __typename?: 'Image'; id: string; path: string }[];
			};
		}[];
	};
};

export type UserOrdersQueryVariables = Exact<{ [key: string]: never }>;

export type UserOrdersQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		orders: {
			__typename?: 'Order';
			id: string;
			status: OrderStatus;
			total: number;
			createdAt: string;
			store: {
				__typename?: 'Store';
				id: string;
				name: string;
				image?: { __typename?: 'Image'; id: string; path: string } | null;
			};
			products: {
				__typename?: 'OrderProduct';
				id: string;
				unitPrice: number;
				quantity: number;
				product: { __typename?: 'Product'; id: string; name: string };
			}[];
		}[];
	};
};

export type OrderQueryVariables = Exact<{
	orderId: Scalars['ID'];
}>;

export type OrderQuery = {
	__typename?: 'Query';
	order: {
		__typename?: 'Order';
		id: string;
		total: number;
		status: OrderStatus;
		createdAt: string;
		store: {
			__typename?: 'Store';
			id: string;
			name: string;
			image?: { __typename?: 'Image'; id: string; path: string } | null;
		};
		products: {
			__typename?: 'OrderProduct';
			id: string;
			orderId: string;
			productId: string;
			unitPrice: number;
			quantity: number;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				images: { __typename?: 'Image'; id: string; path: string }[];
			};
		}[];
	};
};

export type CreateOrderMutationVariables = Exact<{
	input: CreateOrderInput;
}>;

export type CreateOrderMutation = {
	__typename?: 'Mutation';
	createOrder: {
		__typename?: 'Order';
		id: string;
		total: number;
		store: { __typename?: 'Store'; id: string; name: string };
		products: {
			__typename?: 'OrderProduct';
			id: string;
			unitPrice: number;
			quantity: number;
			product: { __typename?: 'Product'; id: string; name: string };
		}[];
	};
};

export type StoreProductsQueryVariables = Exact<{
	storeId: Scalars['ID'];
	filter?: InputMaybe<ProductFilterInput>;
	orderBy?: InputMaybe<ProductOrderByInput[] | ProductOrderByInput>;
}>;

export type StoreProductsQuery = {
	__typename?: 'Query';
	store: {
		__typename?: 'Store';
		id: string;
		name: string;
		products: {
			__typename?: 'Product';
			id: string;
			name: string;
			description: string;
			unitPrice: number;
			storeId: string;
			images: { __typename?: 'Image'; id: string; path: string }[];
		}[];
	};
};

export type ProductQueryVariables = Exact<{
	productId: Scalars['ID'];
}>;

export type ProductQuery = {
	__typename?: 'Query';
	product: {
		__typename?: 'Product';
		id: string;
		name: string;
		description: string;
		unitPrice: number;
		storeId: string;
		inCart: boolean;
		store: { __typename?: 'Store'; id: string; cartId?: string | null };
		images: { __typename?: 'Image'; id: string; path: string }[];
		reviews: {
			__typename?: 'ProductReview';
			id: string;
			body?: string | null;
			rating: number;
			createdAt: string;
			user: { __typename?: 'User'; id: string; name: string };
		}[];
	};
};

export type WatchlistQueryVariables = Exact<{ [key: string]: never }>;

export type WatchlistQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		watchlist: {
			__typename?: 'WatchlistProduct';
			userId: string;
			productId: string;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
				store: { __typename?: 'Store'; id: string; name: string };
				images: { __typename?: 'Image'; id: string; path: string }[];
			};
		}[];
	};
};

export type AddToWatchlistMutationVariables = Exact<{
	productId: Scalars['ID'];
}>;

export type AddToWatchlistMutation = {
	__typename?: 'Mutation';
	addToWatchlist: {
		__typename?: 'WatchlistProduct';
		userId: string;
		productId: string;
	};
};

export type SearchQueryVariables = Exact<{
	searchTerm: Scalars['String'];
}>;

export type SearchQuery = {
	__typename?: 'Query';
	stores: {
		__typename?: 'Store';
		id: string;
		name: string;
		image?: { __typename?: 'Image'; id: string; path: string } | null;
	}[];
	products: {
		__typename?: 'Product';
		id: string;
		name: string;
		images: { __typename?: 'Image'; id: string; path: string }[];
	}[];
};

export type StoresQueryVariables = Exact<{ [key: string]: never }>;

export type StoresQuery = {
	__typename?: 'Query';
	stores: {
		__typename?: 'Store';
		id: string;
		name: string;
		image?: { __typename?: 'Image'; id: string; path: string } | null;
	}[];
};

export type StoreQueryVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type StoreQuery = {
	__typename?: 'Query';
	store: {
		__typename?: 'Store';
		id: string;
		name: string;
		description?: string | null;
		website?: string | null;
		twitter?: string | null;
		instagram?: string | null;
		followedByUser: boolean;
		image?: { __typename?: 'Image'; id: string; path: string } | null;
		categories: {
			__typename?: 'StoreProductCategory';
			id: string;
			name: string;
		}[];
	};
};

export type FollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type FollowStoreMutation = {
	__typename?: 'Mutation';
	followStore: { __typename?: 'StoreFollower'; id: string };
};

export type UnfollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type UnfollowStoreMutation = {
	__typename?: 'Mutation';
	unfollowStore: { __typename?: 'StoreFollower'; id: string };
};

export type StoresFollowedQueryVariables = Exact<{ [key: string]: never }>;

export type StoresFollowedQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		followed: {
			__typename?: 'StoreFollower';
			id: string;
			storeId: string;
			followerId: string;
			store: {
				__typename?: 'Store';
				id: string;
				name: string;
				image?: { __typename?: 'Image'; id: string; path: string } | null;
			};
		}[];
	};
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
	__typename?: 'Query';
	currentUser: { __typename?: 'User'; id: string; name: string; email: string };
};

export type RegisterMutationVariables = Exact<{
	input: RegisterInput;
}>;

export type RegisterMutation = {
	__typename?: 'Mutation';
	register: { __typename?: 'User'; id: string };
};

export type AuthenticateMutationVariables = Exact<{
	input: AuthenticateInput;
}>;

export type AuthenticateMutation = {
	__typename?: 'Mutation';
	authenticate: {
		__typename?: 'AuthenticateResponse';
		accessToken: string;
		userId: string;
	};
};

export type VerifyMutationVariables = Exact<{
	input: VerifyInput;
}>;

export type VerifyMutation = {
	__typename?: 'Mutation';
	verify: {
		__typename?: 'VerifyResponse';
		accessToken: string;
		userId: string;
	};
};

export type EditProfileMutationVariables = Exact<{
	input: EditProfileInput;
}>;

export type EditProfileMutation = {
	__typename?: 'Mutation';
	editProfile: { __typename?: 'User'; id: string; name: string; email: string };
};

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteAccountMutation = {
	__typename?: 'Mutation';
	deleteAccount: { __typename?: 'User'; id: string };
};

export const CardsDocument = gql`
	query Cards {
		currentUser {
			id
			cards {
				id
				email
				cardType
				last4
				expMonth
				expYear
				bank
				countryCode
			}
		}
	}
`;

export function useCardsQuery(
	options?: Omit<Urql.UseQueryArgs<CardsQueryVariables>, 'query'>
) {
	return Urql.useQuery<CardsQuery, CardsQueryVariables>({
		query: CardsDocument,
		...options
	});
}
export const CardAuthorizationDocument = gql`
	query CardAuthorization {
		cardAuthorization {
			id
			authorization_url
			access_code
			reference
		}
	}
`;

export function useCardAuthorizationQuery(
	options?: Omit<Urql.UseQueryArgs<CardAuthorizationQueryVariables>, 'query'>
) {
	return Urql.useQuery<CardAuthorizationQuery, CardAuthorizationQueryVariables>(
		{ query: CardAuthorizationDocument, ...options }
	);
}
export const CartsDocument = gql`
	query Carts {
		currentUser {
			id
			carts {
				id
				userId
				storeId
				store {
					id
					name
					image {
						id
						path
					}
				}
				products {
					id
					quantity
				}
				total
			}
		}
	}
`;

export function useCartsQuery(
	options?: Omit<Urql.UseQueryArgs<CartsQueryVariables>, 'query'>
) {
	return Urql.useQuery<CartsQuery, CartsQueryVariables>({
		query: CartsDocument,
		...options
	});
}
export const CartDocument = gql`
	query Cart($cartId: ID!) {
		cart(id: $cartId) {
			id
			userId
			user {
				id
				cards {
					id
					email
					cardType
					last4
				}
			}
			storeId
			store {
				id
				name
			}
			products {
				id
				cartId
				productId
				product {
					id
					name
					unitPrice
					storeId
					images {
						id
						path
					}
				}
				quantity
			}
			total
		}
	}
`;

export function useCartQuery(
	options: Omit<Urql.UseQueryArgs<CartQueryVariables>, 'query'>
) {
	return Urql.useQuery<CartQuery, CartQueryVariables>({
		query: CartDocument,
		...options
	});
}
export const AddToCartDocument = gql`
	mutation AddToCart($input: AddToCartInput!) {
		addToCart(input: $input) {
			id
			cartId
			productId
			quantity
		}
	}
`;

export function useAddToCartMutation() {
	return Urql.useMutation<AddToCartMutation, AddToCartMutationVariables>(
		AddToCartDocument
	);
}
export const RemoveFromCartDocument = gql`
	mutation RemoveFromCart($productId: ID!, $cartId: ID!) {
		removeFromCart(productId: $productId, cartId: $cartId)
	}
`;

export function useRemoveFromCartMutation() {
	return Urql.useMutation<
		RemoveFromCartMutation,
		RemoveFromCartMutationVariables
	>(RemoveFromCartDocument);
}
export const CreateCartDocument = gql`
	mutation CreateCart($input: CreateCartInput!) {
		createCart(input: $input) {
			id
			userId
			storeId
			store {
				id
				name
			}
			products {
				cartId
				productId
				cart {
					id
				}
				product {
					id
					name
					unitPrice
				}
			}
			total
		}
	}
`;

export function useCreateCartMutation() {
	return Urql.useMutation<CreateCartMutation, CreateCartMutationVariables>(
		CreateCartDocument
	);
}
export const DeleteCartDocument = gql`
	mutation DeleteCart($cartId: ID!) {
		deleteCart(cartId: $cartId) {
			id
		}
	}
`;

export function useDeleteCartMutation() {
	return Urql.useMutation<DeleteCartMutation, DeleteCartMutationVariables>(
		DeleteCartDocument
	);
}
export const UpdateCartProductDocument = gql`
	mutation UpdateCartProduct($input: UpdateCartProductInput!) {
		updateCartProduct(input: $input) {
			cartId
			productId
			quantity
			cart {
				id
			}
			product {
				id
			}
		}
	}
`;

export function useUpdateCartProductMutation() {
	return Urql.useMutation<
		UpdateCartProductMutation,
		UpdateCartProductMutationVariables
	>(UpdateCartProductDocument);
}
export const HomeDocument = gql`
	query Home {
		currentUser {
			id
			orders {
				id
				store {
					id
					name
					image {
						id
						path
					}
				}
				products {
					id
					product {
						id
						name
					}
					unitPrice
					quantity
				}
				total
				status
				createdAt
			}
			followed {
				id
				storeId
				followerId
				store {
					id
					name
					image {
						id
						path
					}
				}
			}
			watchlist {
				id
				userId
				productId
				product {
					id
					name
					unitPrice
					store {
						id
						name
					}
					images {
						id
						path
					}
				}
			}
		}
	}
`;

export function useHomeQuery(
	options?: Omit<Urql.UseQueryArgs<HomeQueryVariables>, 'query'>
) {
	return Urql.useQuery<HomeQuery, HomeQueryVariables>({
		query: HomeDocument,
		...options
	});
}
export const UserOrdersDocument = gql`
	query UserOrders {
		currentUser {
			id
			orders {
				id
				store {
					id
					name
					image {
						id
						path
					}
				}
				products {
					id
					product {
						id
						name
					}
					unitPrice
					quantity
				}
				status
				total
				createdAt
			}
		}
	}
`;

export function useUserOrdersQuery(
	options?: Omit<Urql.UseQueryArgs<UserOrdersQueryVariables>, 'query'>
) {
	return Urql.useQuery<UserOrdersQuery, UserOrdersQueryVariables>({
		query: UserOrdersDocument,
		...options
	});
}
export const OrderDocument = gql`
	query Order($orderId: ID!) {
		order(id: $orderId) {
			id
			store {
				id
				name
				image {
					id
					path
				}
			}
			products {
				id
				orderId
				productId
				product {
					id
					name
					images {
						id
						path
					}
				}
				unitPrice
				quantity
			}
			total
			status
			createdAt
		}
	}
`;

export function useOrderQuery(
	options: Omit<Urql.UseQueryArgs<OrderQueryVariables>, 'query'>
) {
	return Urql.useQuery<OrderQuery, OrderQueryVariables>({
		query: OrderDocument,
		...options
	});
}
export const CreateOrderDocument = gql`
	mutation CreateOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			id
			store {
				id
				name
			}
			products {
				id
				product {
					id
					name
				}
				unitPrice
				quantity
			}
			total
		}
	}
`;

export function useCreateOrderMutation() {
	return Urql.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(
		CreateOrderDocument
	);
}
export const StoreProductsDocument = gql`
	query StoreProducts(
		$storeId: ID!
		$filter: ProductFilterInput
		$orderBy: [ProductOrderByInput!]
	) {
		store(id: $storeId) {
			id
			name
			products(filter: $filter, orderBy: $orderBy) {
				id
				name
				description
				unitPrice
				storeId
				images {
					id
					path
				}
			}
		}
	}
`;

export function useStoreProductsQuery(
	options: Omit<Urql.UseQueryArgs<StoreProductsQueryVariables>, 'query'>
) {
	return Urql.useQuery<StoreProductsQuery, StoreProductsQueryVariables>({
		query: StoreProductsDocument,
		...options
	});
}
export const ProductDocument = gql`
	query Product($productId: ID!) {
		product(id: $productId) {
			id
			name
			description
			unitPrice
			storeId
			store {
				id
				cartId
			}
			images {
				id
				path
			}
			reviews {
				id
				body
				rating
				createdAt
				user {
					id
					name
				}
			}
			inCart
		}
	}
`;

export function useProductQuery(
	options: Omit<Urql.UseQueryArgs<ProductQueryVariables>, 'query'>
) {
	return Urql.useQuery<ProductQuery, ProductQueryVariables>({
		query: ProductDocument,
		...options
	});
}
export const WatchlistDocument = gql`
	query Watchlist {
		currentUser {
			id
			watchlist {
				userId
				productId
				product {
					id
					name
					unitPrice
					store {
						id
						name
					}
					images {
						id
						path
					}
				}
			}
		}
	}
`;

export function useWatchlistQuery(
	options?: Omit<Urql.UseQueryArgs<WatchlistQueryVariables>, 'query'>
) {
	return Urql.useQuery<WatchlistQuery, WatchlistQueryVariables>({
		query: WatchlistDocument,
		...options
	});
}
export const AddToWatchlistDocument = gql`
	mutation AddToWatchlist($productId: ID!) {
		addToWatchlist(productId: $productId) {
			userId
			productId
		}
	}
`;

export function useAddToWatchlistMutation() {
	return Urql.useMutation<
		AddToWatchlistMutation,
		AddToWatchlistMutationVariables
	>(AddToWatchlistDocument);
}
export const SearchDocument = gql`
	query Search($searchTerm: String!) {
		stores(filter: { name: { contains: $searchTerm, mode: insensitive } }) {
			id
			name
			image {
				id
				path
			}
		}
		products(filter: { name: { contains: $searchTerm, mode: insensitive } }) {
			id
			name
			images {
				id
				path
			}
		}
	}
`;

export function useSearchQuery(
	options: Omit<Urql.UseQueryArgs<SearchQueryVariables>, 'query'>
) {
	return Urql.useQuery<SearchQuery, SearchQueryVariables>({
		query: SearchDocument,
		...options
	});
}
export const StoresDocument = gql`
	query Stores {
		stores {
			id
			name
			image {
				id
				path
			}
		}
	}
`;

export function useStoresQuery(
	options?: Omit<Urql.UseQueryArgs<StoresQueryVariables>, 'query'>
) {
	return Urql.useQuery<StoresQuery, StoresQueryVariables>({
		query: StoresDocument,
		...options
	});
}
export const StoreDocument = gql`
	query Store($storeId: ID!) {
		store(id: $storeId) {
			id
			name
			description
			website
			twitter
			instagram
			image {
				id
				path
			}
			categories {
				id
				name
			}
			followedByUser
		}
	}
`;

export function useStoreQuery(
	options: Omit<Urql.UseQueryArgs<StoreQueryVariables>, 'query'>
) {
	return Urql.useQuery<StoreQuery, StoreQueryVariables>({
		query: StoreDocument,
		...options
	});
}
export const FollowStoreDocument = gql`
	mutation FollowStore($storeId: ID!) {
		followStore(storeId: $storeId) {
			id
		}
	}
`;

export function useFollowStoreMutation() {
	return Urql.useMutation<FollowStoreMutation, FollowStoreMutationVariables>(
		FollowStoreDocument
	);
}
export const UnfollowStoreDocument = gql`
	mutation UnfollowStore($storeId: ID!) {
		unfollowStore(storeId: $storeId) {
			id
		}
	}
`;

export function useUnfollowStoreMutation() {
	return Urql.useMutation<
		UnfollowStoreMutation,
		UnfollowStoreMutationVariables
	>(UnfollowStoreDocument);
}
export const StoresFollowedDocument = gql`
	query StoresFollowed {
		currentUser {
			id
			followed {
				id
				storeId
				followerId
				store {
					id
					name
					image {
						id
						path
					}
				}
			}
		}
	}
`;

export function useStoresFollowedQuery(
	options?: Omit<Urql.UseQueryArgs<StoresFollowedQueryVariables>, 'query'>
) {
	return Urql.useQuery<StoresFollowedQuery, StoresFollowedQueryVariables>({
		query: StoresFollowedDocument,
		...options
	});
}
export const CurrentUserDocument = gql`
	query CurrentUser {
		currentUser {
			id
			name
			email
		}
	}
`;

export function useCurrentUserQuery(
	options?: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'>
) {
	return Urql.useQuery<CurrentUserQuery, CurrentUserQueryVariables>({
		query: CurrentUserDocument,
		...options
	});
}
export const RegisterDocument = gql`
	mutation Register($input: RegisterInput!) {
		register(input: $input) {
			id
		}
	}
`;

export function useRegisterMutation() {
	return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
		RegisterDocument
	);
}
export const AuthenticateDocument = gql`
	mutation Authenticate($input: AuthenticateInput!) {
		authenticate(input: $input) {
			accessToken
			userId
		}
	}
`;

export function useAuthenticateMutation() {
	return Urql.useMutation<AuthenticateMutation, AuthenticateMutationVariables>(
		AuthenticateDocument
	);
}
export const VerifyDocument = gql`
	mutation Verify($input: VerifyInput!) {
		verify(input: $input) {
			accessToken
			userId
		}
	}
`;

export function useVerifyMutation() {
	return Urql.useMutation<VerifyMutation, VerifyMutationVariables>(
		VerifyDocument
	);
}
export const EditProfileDocument = gql`
	mutation EditProfile($input: EditProfileInput!) {
		editProfile(input: $input) {
			id
			name
			email
		}
	}
`;

export function useEditProfileMutation() {
	return Urql.useMutation<EditProfileMutation, EditProfileMutationVariables>(
		EditProfileDocument
	);
}
export const DeleteAccountDocument = gql`
	mutation DeleteAccount {
		deleteAccount {
			id
		}
	}
`;

export function useDeleteAccountMutation() {
	return Urql.useMutation<
		DeleteAccountMutation,
		DeleteAccountMutationVariables
	>(DeleteAccountDocument);
}
