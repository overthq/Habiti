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

export type AddProductToCategoryInput = {
	categoryId: Scalars['ID']['input'];
	productId: Scalars['ID']['input'];
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

export type AuthenticateInput = {
	email: Scalars['String']['input'];
	password: Scalars['String']['input'];
};

export type AuthenticateResponse = {
	__typename?: 'AuthenticateResponse';
	accessToken: Scalars['String']['output'];
	userId: Scalars['ID']['output'];
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
	id: Scalars['ID']['output'];
	products: CartProduct[];
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
	id: Scalars['ID']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
	quantity: Scalars['Int']['output'];
};

export type CreateCartInput = {
	productId: Scalars['ID']['input'];
	quantity: Scalars['Int']['input'];
	storeId: Scalars['ID']['input'];
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
	imageFiles: Scalars['Upload']['input'][];
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
	imageFiles: Scalars['Upload']['input'][];
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
	deleteStore: Scalars['ID']['output'];
	deleteUser: User;
	editProduct: Product;
	editProductCategory: StoreProductCategory;
	editProfile: User;
	editStore: Store;
	followStore: StoreFollower;
	register: User;
	removeFromCart: Scalars['ID']['output'];
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
	productId: Scalars['ID']['input'];
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
	id: Scalars['ID']['input'];
};

export type MutationDeleteCartArgs = {
	cartId: Scalars['ID']['input'];
};

export type MutationDeleteImageArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteProductArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteProductCategoryArgs = {
	categoryId: Scalars['ID']['input'];
};

export type MutationDeleteStoreArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteUserArgs = {
	userId: Scalars['ID']['input'];
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

export type MutationRegisterArgs = {
	input: RegisterInput;
};

export type MutationRemoveFromCartArgs = {
	cartId: Scalars['ID']['input'];
	productId: Scalars['ID']['input'];
};

export type MutationRemoveProductFromCategoryArgs = {
	input: RemoveProductFromCategoryInput;
};

export type MutationRemoveStoreManagerArgs = {
	managerId: Scalars['ID']['input'];
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
	id: Scalars['ID']['output'];
};

export type Order = {
	__typename?: 'Order';
	createdAt: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	products: OrderProduct[];
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

export type OrderOrderByInput = {
	createdAt?: InputMaybe<Sort>;
	total?: InputMaybe<Sort>;
	updatedAt?: InputMaybe<Sort>;
};

export type OrderProduct = {
	__typename?: 'OrderProduct';
	id: Scalars['ID']['output'];
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
	Delivered = 'Delivered',
	Pending = 'Pending',
	Processing = 'Processing'
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
	store: Store;
	storeId: Scalars['ID']['output'];
	updatedAt: Scalars['String']['output'];
};

export type Product = {
	__typename?: 'Product';
	carts: CartProduct[];
	categories: ProductCategory[];
	createdAt: Scalars['String']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	images: Image[];
	inCart: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	options: ProductOption[];
	orders: Order[];
	quantity: Scalars['Int']['output'];
	reviews: ProductReview[];
	store: Store;
	storeId: Scalars['ID']['output'];
	unitPrice: Scalars['Int']['output'];
	updatedAt: Scalars['String']['output'];
	watchlists: WatchlistProduct[];
};

export type ProductOrdersArgs = {
	orderBy?: InputMaybe<OrderOrderByInput[]>;
};

export type ProductCategory = {
	__typename?: 'ProductCategory';
	category: StoreProductCategory;
	categoryId: Scalars['ID']['output'];
	id: Scalars['ID']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
};

export type ProductCategoryEdge = {
	__typename?: 'ProductCategoryEdge';
	cursor: Scalars['String']['output'];
	node?: Maybe<ProductCategory>;
};

export type ProductFilterInput = {
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
	id: Scalars['ID']['input'];
};

export type QueryNodeArgs = {
	id: Scalars['ID']['input'];
};

export type QueryOrderArgs = {
	id: Scalars['ID']['input'];
};

export type QueryProductArgs = {
	id: Scalars['ID']['input'];
};

export type QueryProductsArgs = {
	filter?: InputMaybe<ProductFilterInput>;
	orderBy?: InputMaybe<ProductOrderByInput[]>;
};

export type QueryStatsArgs = {
	period?: InputMaybe<StatPeriod>;
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

export type RegisterInput = {
	email: Scalars['String']['input'];
	name: Scalars['String']['input'];
	password: Scalars['String']['input'];
};

export type RemoveProductFromCategoryInput = {
	categoryId: Scalars['ID']['input'];
	productId: Scalars['ID']['input'];
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
	id: Scalars['ID']['output'];
	orders: Order[];
	pendingOrderCount: Scalars['Int']['output'];
	products: Product[];
	revenue: Scalars['Int']['output'];
	storeId: Scalars['ID']['output'];
};

export type Store = {
	__typename?: 'Store';
	bankAccountNumber?: Maybe<Scalars['String']['output']>;
	bankAccountReference?: Maybe<Scalars['String']['output']>;
	bankCode?: Maybe<Scalars['String']['output']>;
	cartId?: Maybe<Scalars['ID']['output']>;
	carts: Cart[];
	categories: StoreProductCategory[];
	createdAt: Scalars['String']['output'];
	description?: Maybe<Scalars['String']['output']>;
	followedByUser: Scalars['Boolean']['output'];
	followers: StoreFollower[];
	id: Scalars['ID']['output'];
	image?: Maybe<Image>;
	instagram?: Maybe<Scalars['String']['output']>;
	managers: StoreManager[];
	name: Scalars['String']['output'];
	orders: Order[];
	paidOut: Scalars['Int']['output'];
	payouts: Payout[];
	products: Product[];
	realizedRevenue: Scalars['Int']['output'];
	twitter?: Maybe<Scalars['String']['output']>;
	unrealizedRevenue: Scalars['Int']['output'];
	updatedAt: Scalars['String']['output'];
	website?: Maybe<Scalars['String']['output']>;
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
	followerId: Scalars['ID']['output'];
	id: Scalars['ID']['output'];
	store: Store;
	storeId: Scalars['ID']['output'];
};

export type StoreManager = {
	__typename?: 'StoreManager';
	id: Scalars['ID']['output'];
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
	products: ProductCategory[];
	store: Store;
	storeId: Scalars['ID']['output'];
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

export type User = {
	__typename?: 'User';
	cards: Card[];
	carts: Cart[];
	createdAt: Scalars['String']['output'];
	email: Scalars['String']['output'];
	followed: StoreFollower[];
	id: Scalars['ID']['output'];
	managed: StoreManager[];
	name: Scalars['String']['output'];
	orders: Order[];
	pushTokens: UserPushToken[];
	updatedAt: Scalars['String']['output'];
	watchlist: WatchlistProduct[];
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

export type VerifyInput = {
	code: Scalars['String']['input'];
	email: Scalars['String']['input'];
};

export type VerifyResponse = {
	__typename?: 'VerifyResponse';
	accessToken: Scalars['String']['output'];
	userId: Scalars['ID']['output'];
};

export type WatchlistProduct = {
	__typename?: 'WatchlistProduct';
	id: Scalars['ID']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
	user: User;
	userId: Scalars['ID']['output'];
};

export type CategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type CategoriesQuery = {
	__typename?: 'Query';
	currentStore: {
		__typename?: 'Store';
		id: string;
		categories: {
			__typename?: 'StoreProductCategory';
			id: string;
			name: string;
		}[];
	};
};

export type CategoryQueryVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

export type CategoryQuery = {
	__typename?: 'Query';
	storeProductCategory?: {
		__typename?: 'StoreProductCategory';
		id: string;
		name: string;
		description?: string | null;
	} | null;
};

export type CreateProductCategoryMutationVariables = Exact<{
	input: CreateCategoryInput;
}>;

export type CreateProductCategoryMutation = {
	__typename?: 'Mutation';
	createProductCategory: { __typename?: 'StoreProductCategory'; id: string };
};

export type EditProductCategoryMutationVariables = Exact<{
	categoryId: Scalars['ID']['input'];
	input: EditCategoryInput;
}>;

export type EditProductCategoryMutation = {
	__typename?: 'Mutation';
	editProductCategory: {
		__typename?: 'StoreProductCategory';
		id: string;
		name: string;
		description?: string | null;
	};
};

export type DeleteProductCategoryMutationVariables = Exact<{
	categoryId: Scalars['ID']['input'];
}>;

export type DeleteProductCategoryMutation = {
	__typename?: 'Mutation';
	deleteProductCategory: { __typename?: 'StoreProductCategory'; id: string };
};

export type AddProductToCategoryMutationVariables = Exact<{
	input: AddProductToCategoryInput;
}>;

export type AddProductToCategoryMutation = {
	__typename?: 'Mutation';
	addProductToCategory: { __typename?: 'ProductCategory'; id: string };
};

export type RemoveProductFromCategoryMutationVariables = Exact<{
	input: RemoveProductFromCategoryInput;
}>;

export type RemoveProductFromCategoryMutation = {
	__typename?: 'Mutation';
	removeProductFromCategory: { __typename?: 'ProductCategory'; id: string };
};

export type ManagedStoresQueryVariables = Exact<{ [key: string]: never }>;

export type ManagedStoresQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		managed: {
			__typename?: 'StoreManager';
			id: string;
			storeId: string;
			managerId: string;
			store: { __typename?: 'Store'; id: string; name: string };
		}[];
	};
};

export type ManagersQueryVariables = Exact<{ [key: string]: never }>;

export type ManagersQuery = {
	__typename?: 'Query';
	currentStore: {
		__typename?: 'Store';
		id: string;
		managers: {
			__typename?: 'StoreManager';
			id: string;
			manager: { __typename?: 'User'; id: string; name: string };
		}[];
	};
};

export type AddStoreManagerMutationVariables = Exact<{
	input: AddStoreManagerInput;
}>;

export type AddStoreManagerMutation = {
	__typename?: 'Mutation';
	addStoreManager: { __typename?: 'StoreManager'; id: string; storeId: string };
};

export type RemoveStoreManagerMutationVariables = Exact<{
	managerId: Scalars['ID']['input'];
}>;

export type RemoveStoreManagerMutation = {
	__typename?: 'Mutation';
	removeStoreManager: {
		__typename?: 'StoreManager';
		id: string;
		storeId: string;
	};
};

export type OrdersQueryVariables = Exact<{
	orderBy?: InputMaybe<OrderOrderByInput[] | OrderOrderByInput>;
}>;

export type OrdersQuery = {
	__typename?: 'Query';
	currentStore: {
		__typename?: 'Store';
		id: string;
		orders: {
			__typename?: 'Order';
			id: string;
			total: number;
			status: OrderStatus;
			createdAt: string;
			updatedAt: string;
			user: { __typename?: 'User'; id: string; name: string };
			products: {
				__typename?: 'OrderProduct';
				id: string;
				orderId: string;
				productId: string;
				unitPrice: number;
				quantity: number;
				product: { __typename?: 'Product'; id: string; name: string };
			}[];
		}[];
	};
};

export type OrderQueryVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

export type OrderQuery = {
	__typename?: 'Query';
	order: {
		__typename?: 'Order';
		id: string;
		transactionFee: number;
		serviceFee: number;
		total: number;
		status: OrderStatus;
		createdAt: string;
		updatedAt: string;
		user: { __typename?: 'User'; id: string; name: string };
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

export type UpdateOrderMutationVariables = Exact<{
	orderId: Scalars['ID']['input'];
	input: UpdateOrderInput;
}>;

export type UpdateOrderMutation = {
	__typename?: 'Mutation';
	updateOrder: { __typename?: 'Order'; id: string };
};

export type StorePayoutsQueryVariables = Exact<{ [key: string]: never }>;

export type StorePayoutsQuery = {
	__typename?: 'Query';
	currentStore: {
		__typename?: 'Store';
		id: string;
		unrealizedRevenue: number;
		realizedRevenue: number;
		paidOut: number;
		payouts: {
			__typename?: 'Payout';
			id: string;
			amount: number;
			createdAt: string;
		}[];
	};
};

export type CreatePayoutMutationVariables = Exact<{
	input: CreatePayoutInput;
}>;

export type CreatePayoutMutation = {
	__typename?: 'Mutation';
	createPayout: {
		__typename?: 'Payout';
		id: string;
		amount: number;
		createdAt: string;
	};
};

export type VerifyBankAccountMutationVariables = Exact<{
	input: VerifyBankAccountInput;
}>;

export type VerifyBankAccountMutation = {
	__typename?: 'Mutation';
	verifyBankAccount: {
		__typename?: 'VerifyBankAccountResponse';
		accountName: string;
	};
};

export type ProductsQueryVariables = Exact<{
	filter?: InputMaybe<ProductFilterInput>;
	orderBy?: InputMaybe<ProductOrderByInput[] | ProductOrderByInput>;
}>;

export type ProductsQuery = {
	__typename?: 'Query';
	currentStore: {
		__typename?: 'Store';
		id: string;
		products: {
			__typename?: 'Product';
			id: string;
			name: string;
			description: string;
			unitPrice: number;
			quantity: number;
			images: { __typename?: 'Image'; id: string; path: string }[];
		}[];
	};
};

export type ProductQueryVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

export type ProductQuery = {
	__typename?: 'Query';
	product: {
		__typename?: 'Product';
		id: string;
		name: string;
		description: string;
		unitPrice: number;
		quantity: number;
		images: { __typename?: 'Image'; id: string; path: string }[];
		options: { __typename?: 'ProductOption'; id: string; name: string }[];
	};
};

export type CreateProductMutationVariables = Exact<{
	input: CreateProductInput;
}>;

export type CreateProductMutation = {
	__typename?: 'Mutation';
	createProduct: {
		__typename?: 'Product';
		id: string;
		name: string;
		description: string;
		unitPrice: number;
		quantity: number;
		images: { __typename?: 'Image'; id: string; path: string }[];
	};
};

export type EditProductMutationVariables = Exact<{
	id: Scalars['ID']['input'];
	input: EditProductInput;
}>;

export type EditProductMutation = {
	__typename?: 'Mutation';
	editProduct: {
		__typename?: 'Product';
		id: string;
		name: string;
		description: string;
		unitPrice: number;
		quantity: number;
		images: { __typename?: 'Image'; id: string; path: string }[];
	};
};

export type StatsQueryVariables = Exact<{
	period: StatPeriod;
}>;

export type StatsQuery = {
	__typename?: 'Query';
	stats: {
		__typename?: 'Stats';
		id: string;
		revenue: number;
		pendingOrderCount: number;
		orders: {
			__typename?: 'Order';
			id: string;
			status: OrderStatus;
			total: number;
			createdAt: string;
			updatedAt: string;
		}[];
	};
};

export type CreateStoreMutationVariables = Exact<{
	input: CreateStoreInput;
}>;

export type CreateStoreMutation = {
	__typename?: 'Mutation';
	createStore: { __typename?: 'Store'; id: string };
};

export type EditStoreMutationVariables = Exact<{
	input: EditStoreInput;
}>;

export type EditStoreMutation = {
	__typename?: 'Mutation';
	editStore: {
		__typename?: 'Store';
		id: string;
		name: string;
		description?: string | null;
		website?: string | null;
		twitter?: string | null;
		instagram?: string | null;
		image?: { __typename?: 'Image'; id: string; path: string } | null;
	};
};

export type DeleteStoreMutationVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

export type DeleteStoreMutation = {
	__typename?: 'Mutation';
	deleteStore: string;
};

export type StoreQueryVariables = Exact<{ [key: string]: never }>;

export type StoreQuery = {
	__typename?: 'Query';
	currentStore: {
		__typename?: 'Store';
		id: string;
		name: string;
		description?: string | null;
		website?: string | null;
		twitter?: string | null;
		instagram?: string | null;
		realizedRevenue: number;
		unrealizedRevenue: number;
		paidOut: number;
		bankAccountNumber?: string | null;
		bankCode?: string | null;
		bankAccountReference?: string | null;
		image?: { __typename?: 'Image'; id: string; path: string } | null;
	};
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

export type RegisterMutationVariables = Exact<{
	input: RegisterInput;
}>;

export type RegisterMutation = {
	__typename?: 'Mutation';
	register: { __typename?: 'User'; id: string };
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

export type CustomerInfoQueryVariables = Exact<{
	userId: Scalars['ID']['input'];
}>;

export type CustomerInfoQuery = {
	__typename?: 'Query';
	user: {
		__typename?: 'User';
		id: string;
		name: string;
		email: string;
		orders: {
			__typename?: 'Order';
			id: string;
			total: number;
			createdAt: string;
			products: {
				__typename?: 'OrderProduct';
				id: string;
				product: {
					__typename?: 'Product';
					id: string;
					name: string;
					images: { __typename?: 'Image'; id: string; path: string }[];
				};
			}[];
		}[];
	};
};

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteAccountMutation = {
	__typename?: 'Mutation';
	deleteAccount: { __typename?: 'User'; id: string };
};

export const CategoriesDocument = gql`
	query Categories {
		currentStore {
			id
			categories {
				id
				name
			}
		}
	}
`;

export function useCategoriesQuery(
	options?: Omit<Urql.UseQueryArgs<CategoriesQueryVariables>, 'query'>
) {
	return Urql.useQuery<CategoriesQuery, CategoriesQueryVariables>({
		query: CategoriesDocument,
		...options
	});
}
export const CategoryDocument = gql`
	query Category($id: ID!) {
		storeProductCategory(id: $id) {
			id
			name
			description
		}
	}
`;

export function useCategoryQuery(
	options: Omit<Urql.UseQueryArgs<CategoryQueryVariables>, 'query'>
) {
	return Urql.useQuery<CategoryQuery, CategoryQueryVariables>({
		query: CategoryDocument,
		...options
	});
}
export const CreateProductCategoryDocument = gql`
	mutation CreateProductCategory($input: CreateCategoryInput!) {
		createProductCategory(input: $input) {
			id
		}
	}
`;

export function useCreateProductCategoryMutation() {
	return Urql.useMutation<
		CreateProductCategoryMutation,
		CreateProductCategoryMutationVariables
	>(CreateProductCategoryDocument);
}
export const EditProductCategoryDocument = gql`
	mutation EditProductCategory($categoryId: ID!, $input: EditCategoryInput!) {
		editProductCategory(categoryId: $categoryId, input: $input) {
			id
			name
			description
		}
	}
`;

export function useEditProductCategoryMutation() {
	return Urql.useMutation<
		EditProductCategoryMutation,
		EditProductCategoryMutationVariables
	>(EditProductCategoryDocument);
}
export const DeleteProductCategoryDocument = gql`
	mutation DeleteProductCategory($categoryId: ID!) {
		deleteProductCategory(categoryId: $categoryId) {
			id
		}
	}
`;

export function useDeleteProductCategoryMutation() {
	return Urql.useMutation<
		DeleteProductCategoryMutation,
		DeleteProductCategoryMutationVariables
	>(DeleteProductCategoryDocument);
}
export const AddProductToCategoryDocument = gql`
	mutation AddProductToCategory($input: AddProductToCategoryInput!) {
		addProductToCategory(input: $input) {
			id
		}
	}
`;

export function useAddProductToCategoryMutation() {
	return Urql.useMutation<
		AddProductToCategoryMutation,
		AddProductToCategoryMutationVariables
	>(AddProductToCategoryDocument);
}
export const RemoveProductFromCategoryDocument = gql`
	mutation RemoveProductFromCategory($input: RemoveProductFromCategoryInput!) {
		removeProductFromCategory(input: $input) {
			id
		}
	}
`;

export function useRemoveProductFromCategoryMutation() {
	return Urql.useMutation<
		RemoveProductFromCategoryMutation,
		RemoveProductFromCategoryMutationVariables
	>(RemoveProductFromCategoryDocument);
}
export const ManagedStoresDocument = gql`
	query ManagedStores {
		currentUser {
			id
			managed {
				id
				storeId
				managerId
				store {
					id
					name
				}
			}
		}
	}
`;

export function useManagedStoresQuery(
	options?: Omit<Urql.UseQueryArgs<ManagedStoresQueryVariables>, 'query'>
) {
	return Urql.useQuery<ManagedStoresQuery, ManagedStoresQueryVariables>({
		query: ManagedStoresDocument,
		...options
	});
}
export const ManagersDocument = gql`
	query Managers {
		currentStore {
			id
			managers {
				id
				manager {
					id
					name
				}
			}
		}
	}
`;

export function useManagersQuery(
	options?: Omit<Urql.UseQueryArgs<ManagersQueryVariables>, 'query'>
) {
	return Urql.useQuery<ManagersQuery, ManagersQueryVariables>({
		query: ManagersDocument,
		...options
	});
}
export const AddStoreManagerDocument = gql`
	mutation AddStoreManager($input: AddStoreManagerInput!) {
		addStoreManager(input: $input) {
			id
			storeId
		}
	}
`;

export function useAddStoreManagerMutation() {
	return Urql.useMutation<
		AddStoreManagerMutation,
		AddStoreManagerMutationVariables
	>(AddStoreManagerDocument);
}
export const RemoveStoreManagerDocument = gql`
	mutation RemoveStoreManager($managerId: ID!) {
		removeStoreManager(managerId: $managerId) {
			id
			storeId
		}
	}
`;

export function useRemoveStoreManagerMutation() {
	return Urql.useMutation<
		RemoveStoreManagerMutation,
		RemoveStoreManagerMutationVariables
	>(RemoveStoreManagerDocument);
}
export const OrdersDocument = gql`
	query Orders($orderBy: [OrderOrderByInput!]) {
		currentStore {
			id
			orders(orderBy: $orderBy) {
				id
				user {
					id
					name
				}
				products {
					id
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
				updatedAt
			}
		}
	}
`;

export function useOrdersQuery(
	options?: Omit<Urql.UseQueryArgs<OrdersQueryVariables>, 'query'>
) {
	return Urql.useQuery<OrdersQuery, OrdersQueryVariables>({
		query: OrdersDocument,
		...options
	});
}
export const OrderDocument = gql`
	query Order($id: ID!) {
		order(id: $id) {
			id
			user {
				id
				name
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
			transactionFee
			serviceFee
			total
			status
			createdAt
			updatedAt
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
export const UpdateOrderDocument = gql`
	mutation UpdateOrder($orderId: ID!, $input: UpdateOrderInput!) {
		updateOrder(orderId: $orderId, input: $input) {
			id
		}
	}
`;

export function useUpdateOrderMutation() {
	return Urql.useMutation<UpdateOrderMutation, UpdateOrderMutationVariables>(
		UpdateOrderDocument
	);
}
export const StorePayoutsDocument = gql`
	query StorePayouts {
		currentStore {
			id
			unrealizedRevenue
			realizedRevenue
			paidOut
			payouts {
				id
				amount
				createdAt
			}
		}
	}
`;

export function useStorePayoutsQuery(
	options?: Omit<Urql.UseQueryArgs<StorePayoutsQueryVariables>, 'query'>
) {
	return Urql.useQuery<StorePayoutsQuery, StorePayoutsQueryVariables>({
		query: StorePayoutsDocument,
		...options
	});
}
export const CreatePayoutDocument = gql`
	mutation CreatePayout($input: CreatePayoutInput!) {
		createPayout(input: $input) {
			id
			amount
			createdAt
		}
	}
`;

export function useCreatePayoutMutation() {
	return Urql.useMutation<CreatePayoutMutation, CreatePayoutMutationVariables>(
		CreatePayoutDocument
	);
}
export const VerifyBankAccountDocument = gql`
	mutation VerifyBankAccount($input: VerifyBankAccountInput!) {
		verifyBankAccount(input: $input) {
			accountName
		}
	}
`;

export function useVerifyBankAccountMutation() {
	return Urql.useMutation<
		VerifyBankAccountMutation,
		VerifyBankAccountMutationVariables
	>(VerifyBankAccountDocument);
}
export const ProductsDocument = gql`
	query Products(
		$filter: ProductFilterInput
		$orderBy: [ProductOrderByInput!]
	) {
		currentStore {
			id
			products(filter: $filter, orderBy: $orderBy) {
				id
				name
				description
				unitPrice
				quantity
				images {
					id
					path
				}
			}
		}
	}
`;

export function useProductsQuery(
	options?: Omit<Urql.UseQueryArgs<ProductsQueryVariables>, 'query'>
) {
	return Urql.useQuery<ProductsQuery, ProductsQueryVariables>({
		query: ProductsDocument,
		...options
	});
}
export const ProductDocument = gql`
	query Product($id: ID!) {
		product(id: $id) {
			id
			name
			description
			unitPrice
			quantity
			images {
				id
				path
			}
			options {
				id
				name
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
export const CreateProductDocument = gql`
	mutation CreateProduct($input: CreateProductInput!) {
		createProduct(input: $input) {
			id
			name
			description
			unitPrice
			quantity
			images {
				id
				path
			}
		}
	}
`;

export function useCreateProductMutation() {
	return Urql.useMutation<
		CreateProductMutation,
		CreateProductMutationVariables
	>(CreateProductDocument);
}
export const EditProductDocument = gql`
	mutation EditProduct($id: ID!, $input: EditProductInput!) {
		editProduct(id: $id, input: $input) {
			id
			name
			description
			unitPrice
			quantity
			images {
				id
				path
			}
		}
	}
`;

export function useEditProductMutation() {
	return Urql.useMutation<EditProductMutation, EditProductMutationVariables>(
		EditProductDocument
	);
}
export const StatsDocument = gql`
	query Stats($period: StatPeriod!) {
		stats(period: $period) {
			id
			orders {
				id
				status
				total
				createdAt
				updatedAt
			}
			revenue
			pendingOrderCount
		}
	}
`;

export function useStatsQuery(
	options: Omit<Urql.UseQueryArgs<StatsQueryVariables>, 'query'>
) {
	return Urql.useQuery<StatsQuery, StatsQueryVariables>({
		query: StatsDocument,
		...options
	});
}
export const CreateStoreDocument = gql`
	mutation CreateStore($input: CreateStoreInput!) {
		createStore(input: $input) {
			id
		}
	}
`;

export function useCreateStoreMutation() {
	return Urql.useMutation<CreateStoreMutation, CreateStoreMutationVariables>(
		CreateStoreDocument
	);
}
export const EditStoreDocument = gql`
	mutation EditStore($input: EditStoreInput!) {
		editStore(input: $input) {
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
		}
	}
`;

export function useEditStoreMutation() {
	return Urql.useMutation<EditStoreMutation, EditStoreMutationVariables>(
		EditStoreDocument
	);
}
export const DeleteStoreDocument = gql`
	mutation DeleteStore($id: ID!) {
		deleteStore(id: $id)
	}
`;

export function useDeleteStoreMutation() {
	return Urql.useMutation<DeleteStoreMutation, DeleteStoreMutationVariables>(
		DeleteStoreDocument
	);
}
export const StoreDocument = gql`
	query Store {
		currentStore {
			id
			name
			description
			website
			twitter
			instagram
			realizedRevenue
			unrealizedRevenue
			paidOut
			bankAccountNumber
			bankCode
			bankAccountReference
			image {
				id
				path
			}
		}
	}
`;

export function useStoreQuery(
	options?: Omit<Urql.UseQueryArgs<StoreQueryVariables>, 'query'>
) {
	return Urql.useQuery<StoreQuery, StoreQueryVariables>({
		query: StoreDocument,
		...options
	});
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
export const CustomerInfoDocument = gql`
	query CustomerInfo($userId: ID!) {
		user(id: $userId) {
			id
			name
			email
			orders {
				id
				products {
					id
					product {
						id
						name
						images {
							id
							path
						}
					}
				}
				total
				createdAt
			}
		}
	}
`;

export function useCustomerInfoQuery(
	options: Omit<Urql.UseQueryArgs<CustomerInfoQueryVariables>, 'query'>
) {
	return Urql.useQuery<CustomerInfoQuery, CustomerInfoQueryVariables>({
		query: CustomerInfoDocument,
		...options
	});
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
