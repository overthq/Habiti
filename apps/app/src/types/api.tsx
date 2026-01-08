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
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
	| T
	| {
			[P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
	  };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	Upload: { input: any; output: any };
};

export type AddDeliveryAddressInput = {
	name?: InputMaybe<Scalars['String']['input']>;
};

export type AddProductOptionInput = {
	description?: InputMaybe<Scalars['String']['input']>;
	name: Scalars['String']['input'];
	productId: Scalars['ID']['input'];
};

export type AddProductReviewInput = {
	body?: InputMaybe<Scalars['String']['input']>;
	productId: Scalars['ID']['input'];
	rating: Scalars['Int']['input'];
};

export type AddStoreManagerInput = {
	managerId: Scalars['ID']['input'];
	storeId: Scalars['ID']['input'];
};

export type AddToCartInput = {
	productId: Scalars['ID']['input'];
	quantity?: InputMaybe<Scalars['Int']['input']>;
	storeId: Scalars['ID']['input'];
};

export type Card = {
	__typename?: 'Card';
	authorizationCode: Scalars['String']['output'];
	bank: Scalars['String']['output'];
	bin: Scalars['String']['output'];
	cardType: Scalars['String']['output'];
	countryCode: Scalars['String']['output'];
	email: Scalars['String']['output'];
	expMonth: Scalars['String']['output'];
	expYear: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	last4: Scalars['String']['output'];
	signature: Scalars['String']['output'];
	user: User;
	userId: Scalars['ID']['output'];
};

export type CardAuthorization = {
	__typename?: 'CardAuthorization';
	access_code: Scalars['String']['output'];
	authorization_url: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	reference: Scalars['String']['output'];
};

export type Cart = {
	__typename?: 'Cart';
	createdAt: Scalars['String']['output'];
	fees: Fees;
	id: Scalars['ID']['output'];
	products: Array<CartProduct>;
	store: Store;
	storeId: Scalars['ID']['output'];
	total: Scalars['Int']['output'];
	updatedAt: Scalars['String']['output'];
	user: User;
	userId: Scalars['ID']['output'];
};

export type CartProduct = {
	__typename?: 'CartProduct';
	cart: Cart;
	cartId: Scalars['ID']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
	quantity: Scalars['Int']['output'];
};

export type CategoriesWhere = {
	every?: InputMaybe<ProductCategoryWhere>;
	none?: InputMaybe<ProductCategoryWhere>;
	some?: InputMaybe<ProductCategoryWhere>;
};

export type CreateCategoryInput = {
	description?: InputMaybe<Scalars['String']['input']>;
	name: Scalars['String']['input'];
};

export type CreateOrderInput = {
	cardId?: InputMaybe<Scalars['ID']['input']>;
	cartId: Scalars['ID']['input'];
	serviceFee: Scalars['Int']['input'];
	transactionFee: Scalars['Int']['input'];
};

export type CreatePayoutInput = {
	amount: Scalars['Int']['input'];
};

export type CreateProductInput = {
	description: Scalars['String']['input'];
	imageFiles?: InputMaybe<Array<Scalars['Upload']['input']>>;
	name: Scalars['String']['input'];
	quantity: Scalars['Int']['input'];
	unitPrice: Scalars['Int']['input'];
};

export type CreateStoreInput = {
	bankAccountNumber?: InputMaybe<Scalars['String']['input']>;
	bankCode?: InputMaybe<Scalars['String']['input']>;
	description: Scalars['String']['input'];
	instagram?: InputMaybe<Scalars['String']['input']>;
	name: Scalars['String']['input'];
	storeImage?: InputMaybe<Scalars['Upload']['input']>;
	twitter?: InputMaybe<Scalars['String']['input']>;
	website?: InputMaybe<Scalars['String']['input']>;
};

export type DeletePushTokenInput = {
	token: Scalars['String']['input'];
	type: PushTokenType;
};

export type DeliveryAddress = {
	__typename?: 'DeliveryAddress';
	id: Scalars['ID']['output'];
	name?: Maybe<Scalars['String']['output']>;
	user: User;
	userId: Scalars['ID']['output'];
};

export type EditCategoryInput = {
	description?: InputMaybe<Scalars['String']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type EditProductInput = {
	description?: InputMaybe<Scalars['String']['input']>;
	imageFiles?: InputMaybe<Array<Scalars['Upload']['input']>>;
	name?: InputMaybe<Scalars['String']['input']>;
	quantity?: InputMaybe<Scalars['Int']['input']>;
	unitPrice?: InputMaybe<Scalars['Int']['input']>;
};

export type EditProfileInput = {
	email?: InputMaybe<Scalars['String']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
};

export type EditStoreInput = {
	bankAccountNumber?: InputMaybe<Scalars['String']['input']>;
	bankCode?: InputMaybe<Scalars['String']['input']>;
	description?: InputMaybe<Scalars['String']['input']>;
	imageFile?: InputMaybe<Scalars['Upload']['input']>;
	instagram?: InputMaybe<Scalars['String']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
	twitter?: InputMaybe<Scalars['String']['input']>;
	website?: InputMaybe<Scalars['String']['input']>;
};

export type Fees = {
	__typename?: 'Fees';
	id: Scalars['ID']['output'];
	service: Scalars['Int']['output'];
	total: Scalars['Int']['output'];
	transaction: Scalars['Int']['output'];
};

export type Filter = {
	__typename?: 'Filter';
	first?: Maybe<Scalars['Int']['output']>;
	last?: Maybe<Scalars['Int']['output']>;
};

export type Image = {
	__typename?: 'Image';
	createdAt: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	path: Scalars['String']['output'];
	product?: Maybe<Product>;
	productId?: Maybe<Scalars['ID']['output']>;
	publicId: Scalars['String']['output'];
	store?: Maybe<Store>;
	storeId?: Maybe<Scalars['ID']['output']>;
	updatedAt: Scalars['String']['output'];
};

export type IntWhere = {
	gt?: InputMaybe<Scalars['Int']['input']>;
	gte?: InputMaybe<Scalars['Int']['input']>;
	lt?: InputMaybe<Scalars['Int']['input']>;
	lte?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
	__typename?: 'Mutation';
	_?: Maybe<Scalars['Boolean']['output']>;
	addDeliveryAddress?: Maybe<DeliveryAddress>;
	addProductOption: ProductOption;
	addProductReview: ProductReview;
	addStoreManager: StoreManager;
	addToCart: CartProduct;
	addToWatchlist: WatchlistProduct;
	createOrder: Order;
	createPayout: Payout;
	createProduct: Product;
	createProductCategory: StoreProductCategory;
	createStore: Store;
	deleteAccount: User;
	deleteCard: Card;
	deleteCart: Cart;
	deleteImage: Image;
	deleteImages: Array<Image>;
	deleteProduct: Product;
	deleteProductCategory: StoreProductCategory;
	deletePushToken: UserPushToken;
	deleteStore: Scalars['ID']['output'];
	editProduct: Product;
	editProductCategory: StoreProductCategory;
	editProfile: User;
	editStore: Store;
	followStore: StoreFollower;
	removeFromCart: Scalars['ID']['output'];
	removeStoreManager: StoreManager;
	savePushToken: UserPushToken;
	unfollowStore: StoreFollower;
	updateCartProduct: CartProduct;
	updateOrder: Order;
	updateOrderStatus: Order;
	updateProductCategories: Product;
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

export type MutationAddStoreManagerArgs = {
	input?: InputMaybe<AddStoreManagerInput>;
};

export type MutationAddToCartArgs = {
	input: AddToCartInput;
};

export type MutationAddToWatchlistArgs = {
	productId: Scalars['ID']['input'];
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
	id: Scalars['ID']['input'];
};

export type MutationDeleteCartArgs = {
	cartId: Scalars['ID']['input'];
};

export type MutationDeleteImageArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteImagesArgs = {
	imageIds: Array<Scalars['ID']['input']>;
};

export type MutationDeleteProductArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteProductCategoryArgs = {
	categoryId: Scalars['ID']['input'];
};

export type MutationDeletePushTokenArgs = {
	input: DeletePushTokenInput;
};

export type MutationDeleteStoreArgs = {
	id: Scalars['ID']['input'];
};

export type MutationEditProductArgs = {
	id: Scalars['ID']['input'];
	input: EditProductInput;
};

export type MutationEditProductCategoryArgs = {
	categoryId: Scalars['ID']['input'];
	input: EditCategoryInput;
};

export type MutationEditProfileArgs = {
	input: EditProfileInput;
};

export type MutationEditStoreArgs = {
	input: EditStoreInput;
};

export type MutationFollowStoreArgs = {
	storeId: Scalars['ID']['input'];
};

export type MutationRemoveFromCartArgs = {
	cartId: Scalars['ID']['input'];
	productId: Scalars['ID']['input'];
};

export type MutationRemoveStoreManagerArgs = {
	managerId: Scalars['ID']['input'];
};

export type MutationSavePushTokenArgs = {
	input: SavePushTokenInput;
};

export type MutationUnfollowStoreArgs = {
	storeId: Scalars['ID']['input'];
};

export type MutationUpdateCartProductArgs = {
	input: UpdateCartProductInput;
};

export type MutationUpdateOrderArgs = {
	input: UpdateOrderInput;
	orderId: Scalars['ID']['input'];
};

export type MutationUpdateOrderStatusArgs = {
	orderId: Scalars['ID']['input'];
	status: OrderStatus;
};

export type MutationUpdateProductCategoriesArgs = {
	id: Scalars['ID']['input'];
	input: UpdateProductCategoriesInput;
};

export type MutationVerifyBankAccountArgs = {
	input: VerifyBankAccountInput;
};

export type Node = {
	id: Scalars['ID']['output'];
};

export type Order = {
	__typename?: 'Order';
	createdAt: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	products: Array<OrderProduct>;
	serviceFee: Scalars['Int']['output'];
	status: OrderStatus;
	store: Store;
	storeId: Scalars['ID']['output'];
	total: Scalars['Int']['output'];
	transactionFee: Scalars['Int']['output'];
	updatedAt: Scalars['String']['output'];
	user: User;
	userId: Scalars['ID']['output'];
};

export type OrderConnection = {
	__typename?: 'OrderConnection';
	edges: Array<OrderEdge>;
	pageInfo: PageInfo;
	totalCount: Scalars['Int']['output'];
};

export type OrderEdge = {
	__typename?: 'OrderEdge';
	cursor: Scalars['String']['output'];
	node: Order;
};

export type OrderFilterInput = {
	total?: InputMaybe<IntWhere>;
};

export type OrderOrderByInput = {
	createdAt?: InputMaybe<Sort>;
	total?: InputMaybe<Sort>;
	updatedAt?: InputMaybe<Sort>;
};

export type OrderProduct = {
	__typename?: 'OrderProduct';
	order: Order;
	orderId: Scalars['ID']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
	quantity: Scalars['Int']['output'];
	unitPrice: Scalars['Int']['output'];
};

export enum OrderStatus {
	Cancelled = 'Cancelled',
	Completed = 'Completed',
	PaymentPending = 'PaymentPending',
	Pending = 'Pending'
}

export type PageInfo = {
	__typename?: 'PageInfo';
	endCursor?: Maybe<Scalars['String']['output']>;
	hasNextPage: Scalars['Boolean']['output'];
	hasPreviousPage: Scalars['Boolean']['output'];
	startCursor?: Maybe<Scalars['String']['output']>;
};

export type Payout = {
	__typename?: 'Payout';
	amount: Scalars['Int']['output'];
	createdAt: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	status: PayoutStatus;
	store: Store;
	storeId: Scalars['ID']['output'];
	updatedAt: Scalars['String']['output'];
};

export enum PayoutStatus {
	Failure = 'Failure',
	Pending = 'Pending',
	Success = 'Success'
}

export type Product = {
	__typename?: 'Product';
	carts: Array<CartProduct>;
	categories: Array<ProductCategory>;
	createdAt: Scalars['String']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	images: Array<Image>;
	inCart: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	options: Array<ProductOption>;
	orders: Array<Order>;
	quantity: Scalars['Int']['output'];
	relatedProducts: Array<Product>;
	reviews: Array<ProductReview>;
	store: Store;
	storeId: Scalars['ID']['output'];
	unitPrice: Scalars['Int']['output'];
	updatedAt: Scalars['String']['output'];
	watchlists: Array<WatchlistProduct>;
};

export type ProductOrdersArgs = {
	orderBy?: InputMaybe<Array<OrderOrderByInput>>;
};

export type ProductCategory = {
	__typename?: 'ProductCategory';
	category: StoreProductCategory;
	categoryId: Scalars['ID']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
};

export type ProductCategoryEdge = {
	__typename?: 'ProductCategoryEdge';
	cursor: Scalars['String']['output'];
	node?: Maybe<ProductCategory>;
};

export type ProductCategoryWhere = {
	categoryId?: InputMaybe<StringWhere>;
	productId?: InputMaybe<StringWhere>;
};

export type ProductConnection = {
	__typename?: 'ProductConnection';
	edges: Array<ProductEdge>;
	pageInfo: PageInfo;
	totalCount: Scalars['Int']['output'];
};

export type ProductEdge = {
	__typename?: 'ProductEdge';
	cursor: Scalars['String']['output'];
	node: Product;
};

export type ProductFilterInput = {
	categories?: InputMaybe<CategoriesWhere>;
	name?: InputMaybe<StringWhere>;
	quantity?: InputMaybe<IntWhere>;
	unitPrice?: InputMaybe<IntWhere>;
};

export type ProductOption = {
	__typename?: 'ProductOption';
	description?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
};

export type ProductOrderByInput = {
	createdAt?: InputMaybe<Sort>;
	unitPrice?: InputMaybe<Sort>;
	updatedAt?: InputMaybe<Sort>;
};

export type ProductReview = {
	__typename?: 'ProductReview';
	body?: Maybe<Scalars['String']['output']>;
	createdAt: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
	rating: Scalars['Int']['output'];
	updatedAt: Scalars['String']['output'];
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
	carts: Array<Cart>;
	currentStore: Store;
	currentUser: User;
	node?: Maybe<Node>;
	order: Order;
	orders: OrderConnection;
	product: Product;
	products: ProductConnection;
	search?: Maybe<SearchResults>;
	store: Store;
	storeProductCategory?: Maybe<StoreProductCategory>;
	stores: Array<Store>;
	user: User;
	users: Array<User>;
};

export type QueryCardAuthorizationArgs = {
	orderId?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryCartArgs = {
	id: Scalars['ID']['input'];
};

export type QueryNodeArgs = {
	id: Scalars['ID']['input'];
};

export type QueryOrderArgs = {
	id: Scalars['ID']['input'];
};

export type QueryOrdersArgs = {
	after?: InputMaybe<Scalars['String']['input']>;
	before?: InputMaybe<Scalars['String']['input']>;
	filter?: InputMaybe<OrderFilterInput>;
	first?: InputMaybe<Scalars['Int']['input']>;
	last?: InputMaybe<Scalars['Int']['input']>;
	orderBy?: InputMaybe<Array<OrderOrderByInput>>;
};

export type QueryProductArgs = {
	id: Scalars['ID']['input'];
};

export type QueryProductsArgs = {
	after?: InputMaybe<Scalars['String']['input']>;
	before?: InputMaybe<Scalars['String']['input']>;
	filter?: InputMaybe<ProductFilterInput>;
	first?: InputMaybe<Scalars['Int']['input']>;
	last?: InputMaybe<Scalars['Int']['input']>;
	orderBy?: InputMaybe<Array<ProductOrderByInput>>;
};

export type QuerySearchArgs = {
	searchTerm: Scalars['String']['input'];
};

export type QueryStoreArgs = {
	id: Scalars['ID']['input'];
};

export type QueryStoreProductCategoryArgs = {
	id: Scalars['ID']['input'];
};

export type QueryStoresArgs = {
	filter?: InputMaybe<StoreFilterInput>;
};

export type QueryUserArgs = {
	id: Scalars['ID']['input'];
};

export type SavePushTokenInput = {
	token: Scalars['String']['input'];
	type: PushTokenType;
};

export type SearchResults = {
	__typename?: 'SearchResults';
	products: Array<Product>;
	stores: Array<Store>;
};

export enum Sort {
	Asc = 'asc',
	Desc = 'desc'
}

export type Store = {
	__typename?: 'Store';
	bankAccountNumber?: Maybe<Scalars['String']['output']>;
	bankAccountReference?: Maybe<Scalars['String']['output']>;
	bankCode?: Maybe<Scalars['String']['output']>;
	carts: Array<Cart>;
	categories: Array<StoreProductCategory>;
	createdAt: Scalars['String']['output'];
	description?: Maybe<Scalars['String']['output']>;
	followedByUser: Scalars['Boolean']['output'];
	followers: Array<StoreFollower>;
	id: Scalars['ID']['output'];
	image?: Maybe<Image>;
	instagram?: Maybe<Scalars['String']['output']>;
	managers: Array<StoreManager>;
	name: Scalars['String']['output'];
	orders: Array<Order>;
	paidOut: Scalars['Int']['output'];
	payouts: Array<Payout>;
	products: ProductConnection;
	realizedRevenue: Scalars['Int']['output'];
	twitter?: Maybe<Scalars['String']['output']>;
	unlisted: Scalars['Boolean']['output'];
	unrealizedRevenue: Scalars['Int']['output'];
	updatedAt: Scalars['String']['output'];
	userCart?: Maybe<Cart>;
	website?: Maybe<Scalars['String']['output']>;
};

export type StoreCategoriesArgs = {
	filter?: InputMaybe<StoreProductCategoryFilterInput>;
};

export type StoreOrdersArgs = {
	orderBy?: InputMaybe<Array<OrderOrderByInput>>;
	status?: InputMaybe<OrderStatus>;
};

export type StoreProductsArgs = {
	after?: InputMaybe<Scalars['String']['input']>;
	filter?: InputMaybe<ProductFilterInput>;
	first?: InputMaybe<Scalars['Int']['input']>;
	orderBy?: InputMaybe<Array<ProductOrderByInput>>;
};

export type StoreFilterInput = {
	name?: InputMaybe<StringWhere>;
	unlisted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StoreFollower = {
	__typename?: 'StoreFollower';
	follower: User;
	followerId: Scalars['ID']['output'];
	store: Store;
	storeId: Scalars['ID']['output'];
};

export type StoreManager = {
	__typename?: 'StoreManager';
	manager: User;
	managerId: Scalars['ID']['output'];
	store: Store;
	storeId: Scalars['ID']['output'];
};

export type StoreProductCategory = {
	__typename?: 'StoreProductCategory';
	description?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	products: Array<ProductCategory>;
	store: Store;
	storeId: Scalars['ID']['output'];
};

export type StoreProductCategoryFilterInput = {
	id?: InputMaybe<StringWhere>;
};

export enum StoreStatPeriod {
	Day = 'Day',
	Month = 'Month',
	Week = 'Week',
	Year = 'Year'
}

export type StringWhere = {
	contains?: InputMaybe<Scalars['String']['input']>;
	endsWith?: InputMaybe<Scalars['String']['input']>;
	equals?: InputMaybe<Scalars['String']['input']>;
	mode?: InputMaybe<StringWhereMode>;
	search?: InputMaybe<Scalars['String']['input']>;
	startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum StringWhereMode {
	Default = 'default',
	Insensitive = 'insensitive'
}

export type UpdateCartProductInput = {
	cartId: Scalars['ID']['input'];
	productId: Scalars['ID']['input'];
	quantity: Scalars['Int']['input'];
};

export type UpdateOrderInput = {
	status?: InputMaybe<OrderStatus>;
};

export type UpdateProductCategoriesInput = {
	add: Array<Scalars['ID']['input']>;
	remove: Array<Scalars['ID']['input']>;
};

export type UpdateProductImagesInput = {
	add: Array<Scalars['Upload']['input']>;
	remove: Array<Scalars['ID']['input']>;
};

export type User = {
	__typename?: 'User';
	addresses: Array<DeliveryAddress>;
	cards: Array<Card>;
	carts: Array<Cart>;
	createdAt: Scalars['String']['output'];
	email: Scalars['String']['output'];
	followed: Array<StoreFollower>;
	id: Scalars['ID']['output'];
	managed: Array<StoreManager>;
	name: Scalars['String']['output'];
	orders: Array<Order>;
	pushTokens: Array<UserPushToken>;
	suspended: Scalars['Boolean']['output'];
	updatedAt: Scalars['String']['output'];
	watchlist: Array<WatchlistProduct>;
};

export type UserPushToken = {
	__typename?: 'UserPushToken';
	id: Scalars['ID']['output'];
	token: Scalars['String']['output'];
	type: PushTokenType;
	userId: Scalars['String']['output'];
};

export type VerifyBankAccountInput = {
	bankAccountNumber: Scalars['String']['input'];
	bankCode: Scalars['String']['input'];
};

export type VerifyBankAccountResponse = {
	__typename?: 'VerifyBankAccountResponse';
	accountName: Scalars['String']['output'];
	accountNumber: Scalars['String']['output'];
};

export type WatchlistProduct = {
	__typename?: 'WatchlistProduct';
	id: Scalars['ID']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
	user: User;
	userId: Scalars['ID']['output'];
};

export type CardsQueryVariables = Exact<{ [key: string]: never }>;

export type CardsQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		cards: Array<{
			__typename?: 'Card';
			id: string;
			email: string;
			cardType: string;
			last4: string;
			expMonth: string;
			expYear: string;
			bank: string;
			countryCode: string;
		}>;
	};
};

export type CardAuthorizationQueryVariables = Exact<{
	orderId?: InputMaybe<Scalars['ID']['input']>;
}>;

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

export type DeleteCardMutationVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

export type DeleteCardMutation = {
	__typename?: 'Mutation';
	deleteCard: { __typename?: 'Card'; id: string };
};

export type CartsQueryVariables = Exact<{ [key: string]: never }>;

export type CartsQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		carts: Array<{
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
			products: Array<{
				__typename?: 'CartProduct';
				cartId: string;
				productId: string;
				quantity: number;
			}>;
		}>;
	};
};

export type CartQueryVariables = Exact<{
	cartId: Scalars['ID']['input'];
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
			cards: Array<{
				__typename?: 'Card';
				id: string;
				email: string;
				cardType: string;
				last4: string;
			}>;
		};
		store: { __typename?: 'Store'; id: string; name: string };
		products: Array<{
			__typename?: 'CartProduct';
			cartId: string;
			productId: string;
			quantity: number;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
				quantity: number;
				storeId: string;
				images: Array<{ __typename?: 'Image'; id: string; path: string }>;
			};
		}>;
		fees: {
			__typename?: 'Fees';
			id: string;
			transaction: number;
			service: number;
			total: number;
		};
	};
};

export type AddToCartMutationVariables = Exact<{
	input: AddToCartInput;
}>;

export type AddToCartMutation = {
	__typename?: 'Mutation';
	addToCart: {
		__typename?: 'CartProduct';
		cartId: string;
		productId: string;
		quantity: number;
	};
};

export type RemoveFromCartMutationVariables = Exact<{
	productId: Scalars['ID']['input'];
	cartId: Scalars['ID']['input'];
}>;

export type RemoveFromCartMutation = {
	__typename?: 'Mutation';
	removeFromCart: string;
};

export type DeleteCartMutationVariables = Exact<{
	cartId: Scalars['ID']['input'];
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
		cart: {
			__typename?: 'Cart';
			id: string;
			products: Array<{
				__typename?: 'CartProduct';
				cartId: string;
				productId: string;
				quantity: number;
			}>;
			fees: {
				__typename?: 'Fees';
				id: string;
				transaction: number;
				service: number;
				total: number;
			};
		};
		product: { __typename?: 'Product'; id: string };
	};
};

export type AddDeliveryAddressMutationVariables = Exact<{
	input: AddDeliveryAddressInput;
}>;

export type AddDeliveryAddressMutation = {
	__typename?: 'Mutation';
	addDeliveryAddress?: { __typename?: 'DeliveryAddress'; id: string } | null;
};

export type DeliveryAddressesQueryVariables = Exact<{ [key: string]: never }>;

export type DeliveryAddressesQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		addresses: Array<{
			__typename?: 'DeliveryAddress';
			id: string;
			name?: string | null;
		}>;
	};
};

export type HomeQueryVariables = Exact<{ [key: string]: never }>;

export type HomeQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		orders: Array<{
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
			products: Array<{
				__typename?: 'OrderProduct';
				orderId: string;
				productId: string;
				unitPrice: number;
				quantity: number;
				product: { __typename?: 'Product'; id: string; name: string };
			}>;
		}>;
		followed: Array<{
			__typename?: 'StoreFollower';
			storeId: string;
			followerId: string;
			store: {
				__typename?: 'Store';
				id: string;
				name: string;
				image?: { __typename?: 'Image'; id: string; path: string } | null;
			};
		}>;
		watchlist: Array<{
			__typename?: 'WatchlistProduct';
			userId: string;
			productId: string;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
				store: { __typename?: 'Store'; id: string; name: string };
				images: Array<{ __typename?: 'Image'; id: string; path: string }>;
			};
		}>;
	};
};

export type UserOrdersQueryVariables = Exact<{ [key: string]: never }>;

export type UserOrdersQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		orders: Array<{
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
			products: Array<{
				__typename?: 'OrderProduct';
				unitPrice: number;
				quantity: number;
				product: {
					__typename?: 'Product';
					id: string;
					name: string;
					images: Array<{ __typename?: 'Image'; id: string; path: string }>;
				};
			}>;
		}>;
	};
};

export type OrderQueryVariables = Exact<{
	orderId: Scalars['ID']['input'];
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
		products: Array<{
			__typename?: 'OrderProduct';
			orderId: string;
			productId: string;
			unitPrice: number;
			quantity: number;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				images: Array<{ __typename?: 'Image'; id: string; path: string }>;
			};
		}>;
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
		userId: string;
		total: number;
		store: {
			__typename?: 'Store';
			id: string;
			name: string;
			userCart?: {
				__typename?: 'Cart';
				id: string;
				products: Array<{
					__typename?: 'CartProduct';
					cartId: string;
					productId: string;
				}>;
			} | null;
		};
		products: Array<{
			__typename?: 'OrderProduct';
			orderId: string;
			productId: string;
			unitPrice: number;
			quantity: number;
			product: { __typename?: 'Product'; id: string; name: string };
		}>;
	};
};

export type UpdateOrderMutationVariables = Exact<{
	orderId: Scalars['ID']['input'];
	input: UpdateOrderInput;
}>;

export type UpdateOrderMutation = {
	__typename?: 'Mutation';
	updateOrder: { __typename?: 'Order'; id: string; status: OrderStatus };
};

export type StoreProductsQueryVariables = Exact<{
	storeId: Scalars['ID']['input'];
	filter?: InputMaybe<ProductFilterInput>;
	orderBy?: InputMaybe<Array<ProductOrderByInput> | ProductOrderByInput>;
	first?: InputMaybe<Scalars['Int']['input']>;
	after?: InputMaybe<Scalars['String']['input']>;
}>;

export type StoreProductsQuery = {
	__typename?: 'Query';
	store: {
		__typename?: 'Store';
		id: string;
		name: string;
		products: {
			__typename?: 'ProductConnection';
			edges: Array<{
				__typename?: 'ProductEdge';
				cursor: string;
				node: {
					__typename?: 'Product';
					id: string;
					name: string;
					description: string;
					unitPrice: number;
					storeId: string;
					images: Array<{ __typename?: 'Image'; id: string; path: string }>;
				};
			}>;
			pageInfo: {
				__typename?: 'PageInfo';
				hasNextPage: boolean;
				hasPreviousPage: boolean;
				startCursor?: string | null;
				endCursor?: string | null;
			};
		};
	};
};

export type ProductQueryVariables = Exact<{
	productId: Scalars['ID']['input'];
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
		store: {
			__typename?: 'Store';
			id: string;
			userCart?: {
				__typename?: 'Cart';
				id: string;
				products: Array<{
					__typename?: 'CartProduct';
					cartId: string;
					productId: string;
					quantity: number;
				}>;
			} | null;
		};
		images: Array<{ __typename?: 'Image'; id: string; path: string }>;
		reviews: Array<{
			__typename?: 'ProductReview';
			id: string;
			body?: string | null;
			rating: number;
			createdAt: string;
			user: { __typename?: 'User'; id: string; name: string };
		}>;
		relatedProducts: Array<{
			__typename?: 'Product';
			id: string;
			name: string;
			unitPrice: number;
			images: Array<{ __typename?: 'Image'; id: string; path: string }>;
		}>;
	};
};

export type WatchlistQueryVariables = Exact<{ [key: string]: never }>;

export type WatchlistQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		watchlist: Array<{
			__typename?: 'WatchlistProduct';
			userId: string;
			productId: string;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
				store: { __typename?: 'Store'; id: string; name: string };
				images: Array<{ __typename?: 'Image'; id: string; path: string }>;
			};
		}>;
	};
};

export type AddToWatchlistMutationVariables = Exact<{
	productId: Scalars['ID']['input'];
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
	searchTerm: Scalars['String']['input'];
}>;

export type SearchQuery = {
	__typename?: 'Query';
	stores: Array<{
		__typename?: 'Store';
		id: string;
		name: string;
		image?: { __typename?: 'Image'; id: string; path: string } | null;
	}>;
	products: {
		__typename?: 'ProductConnection';
		edges: Array<{
			__typename?: 'ProductEdge';
			cursor: string;
			node: {
				__typename?: 'Product';
				id: string;
				name: string;
				images: Array<{ __typename?: 'Image'; id: string; path: string }>;
			};
		}>;
		pageInfo: {
			__typename?: 'PageInfo';
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			startCursor?: string | null;
			endCursor?: string | null;
		};
	};
};

export type StoresQueryVariables = Exact<{ [key: string]: never }>;

export type StoresQuery = {
	__typename?: 'Query';
	stores: Array<{
		__typename?: 'Store';
		id: string;
		name: string;
		unlisted: boolean;
		image?: { __typename?: 'Image'; id: string; path: string } | null;
	}>;
};

export type StoreQueryVariables = Exact<{
	storeId: Scalars['ID']['input'];
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
		unlisted: boolean;
		followedByUser: boolean;
		image?: { __typename?: 'Image'; id: string; path: string } | null;
		categories: Array<{
			__typename?: 'StoreProductCategory';
			id: string;
			name: string;
		}>;
		userCart?: {
			__typename?: 'Cart';
			id: string;
			products: Array<{
				__typename?: 'CartProduct';
				cartId: string;
				productId: string;
			}>;
		} | null;
	};
};

export type FollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID']['input'];
}>;

export type FollowStoreMutation = {
	__typename?: 'Mutation';
	followStore: {
		__typename?: 'StoreFollower';
		storeId: string;
		followerId: string;
	};
};

export type UnfollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID']['input'];
}>;

export type UnfollowStoreMutation = {
	__typename?: 'Mutation';
	unfollowStore: {
		__typename?: 'StoreFollower';
		storeId: string;
		followerId: string;
	};
};

export type StoresFollowedQueryVariables = Exact<{ [key: string]: never }>;

export type StoresFollowedQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		followed: Array<{
			__typename?: 'StoreFollower';
			storeId: string;
			followerId: string;
			store: {
				__typename?: 'Store';
				id: string;
				name: string;
				followedByUser: boolean;
				image?: { __typename?: 'Image'; id: string; path: string } | null;
			};
		}>;
	};
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		name: string;
		email: string;
		pushTokens: Array<{
			__typename?: 'UserPushToken';
			id: string;
			token: string;
			type: PushTokenType;
		}>;
	};
};

export type EditProfileMutationVariables = Exact<{
	input: EditProfileInput;
}>;

export type EditProfileMutation = {
	__typename?: 'Mutation';
	editProfile: { __typename?: 'User'; id: string; name: string; email: string };
};

export type SavePushTokenMutationVariables = Exact<{
	input: SavePushTokenInput;
}>;

export type SavePushTokenMutation = {
	__typename?: 'Mutation';
	savePushToken: {
		__typename?: 'UserPushToken';
		id: string;
		token: string;
		type: PushTokenType;
	};
};

export type DeletePushTokenMutationVariables = Exact<{
	input: DeletePushTokenInput;
}>;

export type DeletePushTokenMutation = {
	__typename?: 'Mutation';
	deletePushToken: {
		__typename?: 'UserPushToken';
		id: string;
		token: string;
		type: PushTokenType;
	};
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
	query CardAuthorization($orderId: ID) {
		cardAuthorization(orderId: $orderId) {
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
export const DeleteCardDocument = gql`
	mutation DeleteCard($id: ID!) {
		deleteCard(id: $id) {
			id
		}
	}
`;

export function useDeleteCardMutation() {
	return Urql.useMutation<DeleteCardMutation, DeleteCardMutationVariables>(
		DeleteCardDocument
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
					cartId
					productId
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
				cartId
				productId
				product {
					id
					name
					unitPrice
					quantity
					storeId
					images {
						id
						path
					}
				}
				quantity
			}
			total
			fees {
				id
				transaction
				service
				total
			}
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
				products {
					cartId
					productId
					quantity
				}
				fees {
					id
					transaction
					service
					total
				}
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
export const AddDeliveryAddressDocument = gql`
	mutation AddDeliveryAddress($input: AddDeliveryAddressInput!) {
		addDeliveryAddress(input: $input) {
			id
		}
	}
`;

export function useAddDeliveryAddressMutation() {
	return Urql.useMutation<
		AddDeliveryAddressMutation,
		AddDeliveryAddressMutationVariables
	>(AddDeliveryAddressDocument);
}
export const DeliveryAddressesDocument = gql`
	query DeliveryAddresses {
		currentUser {
			addresses {
				id
				name
			}
		}
	}
`;

export function useDeliveryAddressesQuery(
	options?: Omit<Urql.UseQueryArgs<DeliveryAddressesQueryVariables>, 'query'>
) {
	return Urql.useQuery<DeliveryAddressesQuery, DeliveryAddressesQueryVariables>(
		{ query: DeliveryAddressesDocument, ...options }
	);
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
					orderId
					productId
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
			userId
			store {
				id
				name
				userCart {
					id
					products {
						cartId
						productId
					}
				}
			}
			products {
				orderId
				productId
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
export const UpdateOrderDocument = gql`
	mutation UpdateOrder($orderId: ID!, $input: UpdateOrderInput!) {
		updateOrder(orderId: $orderId, input: $input) {
			id
			status
		}
	}
`;

export function useUpdateOrderMutation() {
	return Urql.useMutation<UpdateOrderMutation, UpdateOrderMutationVariables>(
		UpdateOrderDocument
	);
}
export const StoreProductsDocument = gql`
	query StoreProducts(
		$storeId: ID!
		$filter: ProductFilterInput
		$orderBy: [ProductOrderByInput!]
		$first: Int
		$after: String
	) {
		store(id: $storeId) {
			id
			name
			products(
				filter: $filter
				orderBy: $orderBy
				first: $first
				after: $after
			) {
				edges {
					cursor
					node {
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
				pageInfo {
					hasNextPage
					hasPreviousPage
					startCursor
					endCursor
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
				userCart {
					id
					products {
						cartId
						productId
						quantity
					}
				}
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
			relatedProducts {
				id
				name
				unitPrice
				images {
					id
					path
				}
			}
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
		products(
			filter: { name: { contains: $searchTerm, mode: insensitive } }
			first: 10
		) {
			edges {
				cursor
				node {
					id
					name
					images {
						id
						path
					}
				}
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
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
			unlisted
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
			unlisted
			image {
				id
				path
			}
			categories {
				id
				name
			}
			followedByUser
			userCart {
				id
				products {
					cartId
					productId
				}
			}
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
			storeId
			followerId
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
			storeId
			followerId
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
				storeId
				followerId
				store {
					id
					name
					image {
						id
						path
					}
					followedByUser
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
			pushTokens {
				id
				token
				type
			}
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
export const SavePushTokenDocument = gql`
	mutation SavePushToken($input: SavePushTokenInput!) {
		savePushToken(input: $input) {
			id
			token
			type
		}
	}
`;

export function useSavePushTokenMutation() {
	return Urql.useMutation<
		SavePushTokenMutation,
		SavePushTokenMutationVariables
	>(SavePushTokenDocument);
}
export const DeletePushTokenDocument = gql`
	mutation DeletePushToken($input: DeletePushTokenInput!) {
		deletePushToken(input: $input) {
			id
			token
			type
		}
	}
`;

export function useDeletePushTokenMutation() {
	return Urql.useMutation<
		DeletePushTokenMutation,
		DeletePushTokenMutationVariables
	>(DeletePushTokenDocument);
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
