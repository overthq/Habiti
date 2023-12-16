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
	phone: Scalars['String']['input'];
};

export type AuthenticateResponse = {
	__typename?: 'AuthenticateResponse';
	message?: Maybe<Scalars['String']['output']>;
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

export type Cart = {
	__typename?: 'Cart';
	createdAt: Scalars['String']['output'];
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
	name: Scalars['String']['input'];
};

export type CreateOrderInput = {
	cardId?: InputMaybe<Scalars['ID']['input']>;
	cartId: Scalars['ID']['input'];
};

export type CreatePayoutInput = {
	amount: Scalars['Int']['input'];
};

export type CreateProductInput = {
	description: Scalars['String']['input'];
	imageFiles: Array<Scalars['Upload']['input']>;
	name: Scalars['String']['input'];
	quantity: Scalars['Int']['input'];
	unitPrice: Scalars['Int']['input'];
};

export type CreateStoreInput = {
	bankAccountNumber?: InputMaybe<Scalars['String']['input']>;
	bankAccountReference?: InputMaybe<Scalars['String']['input']>;
	bankCode?: InputMaybe<Scalars['String']['input']>;
	description: Scalars['String']['input'];
	instagram?: InputMaybe<Scalars['String']['input']>;
	name: Scalars['String']['input'];
	storeImage?: InputMaybe<Scalars['Upload']['input']>;
	twitter?: InputMaybe<Scalars['String']['input']>;
	website?: InputMaybe<Scalars['String']['input']>;
};

export type EditProductInput = {
	description?: InputMaybe<Scalars['String']['input']>;
	imageFiles: Array<Scalars['Upload']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
	quantity?: InputMaybe<Scalars['Int']['input']>;
	unitPrice?: InputMaybe<Scalars['Int']['input']>;
};

export type EditProfileInput = {
	email?: InputMaybe<Scalars['String']['input']>;
	name?: InputMaybe<Scalars['String']['input']>;
	phone?: InputMaybe<Scalars['String']['input']>;
};

export type EditStoreInput = {
	bankAccountNumber?: InputMaybe<Scalars['String']['input']>;
	bankAccountReference?: InputMaybe<Scalars['String']['input']>;
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
	__typename?: 'IntWhere';
	gt?: Maybe<Scalars['Int']['output']>;
	gte?: Maybe<Scalars['Int']['output']>;
	lt?: Maybe<Scalars['Int']['output']>;
	lte?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
	__typename?: 'Mutation';
	_?: Maybe<Scalars['Boolean']['output']>;
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
	storeId: Scalars['ID']['input'];
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
	products: Array<OrderProduct>;
	status: OrderStatus;
	store: Store;
	storeId: Scalars['ID']['output'];
	total: Scalars['Int']['output'];
	updatedAt: Scalars['String']['output'];
	user: User;
	userId: Scalars['ID']['output'];
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
	carts: Array<CartProduct>;
	categories: Array<ProductCategory>;
	createdAt: Scalars['String']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	images: Array<Image>;
	inCart: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	orders: Array<Order>;
	quantity: Scalars['Int']['output'];
	store: Store;
	storeId: Scalars['ID']['output'];
	unitPrice: Scalars['Int']['output'];
	updatedAt: Scalars['String']['output'];
	watchlists: Array<WatchlistProduct>;
};

export type ProductCategory = {
	__typename?: 'ProductCategory';
	category: StoreProductCategory;
	categoryId: Scalars['ID']['output'];
	id: Scalars['ID']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
};

export type Query = {
	__typename?: 'Query';
	_?: Maybe<Scalars['Boolean']['output']>;
	cart: Cart;
	carts: Array<Cart>;
	currentStore: Store;
	currentUser: User;
	order: Order;
	product: Product;
	stats: Stats;
	store: Store;
	storeProducts: Array<Product>;
	stores: Array<Store>;
	user: User;
	users: Array<User>;
	verifyBankAccount: VerifyBankAccountResponse;
};

export type QueryCartArgs = {
	id: Scalars['ID']['input'];
};

export type QueryOrderArgs = {
	id: Scalars['ID']['input'];
};

export type QueryProductArgs = {
	id: Scalars['ID']['input'];
};

export type QueryStatsArgs = {
	period?: InputMaybe<StatPeriod>;
};

export type QueryStoreArgs = {
	id: Scalars['ID']['input'];
};

export type QueryStoreProductsArgs = {
	id: Scalars['ID']['input'];
};

export type QueryUserArgs = {
	id: Scalars['ID']['input'];
};

export type QueryVerifyBankAccountArgs = {
	bankAccountNumber: Scalars['String']['input'];
	bankCode: Scalars['String']['input'];
};

export type RegisterInput = {
	email: Scalars['String']['input'];
	name: Scalars['String']['input'];
	phone: Scalars['String']['input'];
};

export type RemoveProductFromCategoryInput = {
	categoryId: Scalars['ID']['input'];
	productId: Scalars['ID']['input'];
};

export enum StatPeriod {
	Day = 'Day',
	Month = 'Month',
	Week = 'Week',
	Year = 'Year'
}

export type Stats = {
	__typename?: 'Stats';
	id: Scalars['ID']['output'];
	orders: Array<Order>;
	pendingOrderCount: Scalars['Int']['output'];
	products: Array<Product>;
	revenue: Scalars['Int']['output'];
	storeId: Scalars['ID']['output'];
};

export type Store = {
	__typename?: 'Store';
	cartId?: Maybe<Scalars['ID']['output']>;
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
	payedOut: Scalars['Int']['output'];
	payouts: Array<Payout>;
	products: Array<Product>;
	revenue: Scalars['Int']['output'];
	twitter?: Maybe<Scalars['String']['output']>;
	updatedAt: Scalars['String']['output'];
	website?: Maybe<Scalars['String']['output']>;
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
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	products: Array<ProductCategory>;
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
	__typename?: 'StringWhere';
	contains?: Maybe<Scalars['String']['output']>;
};

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
	cards: Array<Card>;
	carts: Array<Cart>;
	createdAt: Scalars['String']['output'];
	email: Scalars['String']['output'];
	followed: Array<StoreFollower>;
	id: Scalars['ID']['output'];
	managed: Array<StoreManager>;
	name: Scalars['String']['output'];
	orders: Array<Order>;
	phone: Scalars['String']['output'];
	updatedAt: Scalars['String']['output'];
	watchlist: Array<WatchlistProduct>;
};

export type VerifyBankAccountResponse = {
	__typename?: 'VerifyBankAccountResponse';
	accountName: Scalars['String']['output'];
	accountNumber: Scalars['String']['output'];
};

export type VerifyInput = {
	code: Scalars['String']['input'];
	phone: Scalars['String']['input'];
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
		categories: Array<{
			__typename?: 'StoreProductCategory';
			id: string;
			name: string;
		}>;
	};
};

export type CreateProductCategoryMutationVariables = Exact<{
	input: CreateCategoryInput;
}>;

export type CreateProductCategoryMutation = {
	__typename?: 'Mutation';
	createProductCategory: { __typename?: 'StoreProductCategory'; id: string };
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
		managed: Array<{
			__typename?: 'StoreManager';
			id: string;
			storeId: string;
			managerId: string;
			store: { __typename?: 'Store'; id: string; name: string };
		}>;
	};
};

export type ManagersQueryVariables = Exact<{ [key: string]: never }>;

export type ManagersQuery = {
	__typename?: 'Query';
	currentStore: {
		__typename?: 'Store';
		id: string;
		managers: Array<{
			__typename?: 'StoreManager';
			id: string;
			manager: { __typename?: 'User'; id: string; name: string };
		}>;
	};
};

export type OrdersQueryVariables = Exact<{ [key: string]: never }>;

export type OrdersQuery = {
	__typename?: 'Query';
	currentStore: {
		__typename?: 'Store';
		id: string;
		orders: Array<{
			__typename?: 'Order';
			id: string;
			total: number;
			status: OrderStatus;
			createdAt: string;
			updatedAt: string;
			user: { __typename?: 'User'; id: string; name: string };
			products: Array<{
				__typename?: 'OrderProduct';
				id: string;
				orderId: string;
				productId: string;
				unitPrice: number;
				quantity: number;
				product: { __typename?: 'Product'; id: string; name: string };
			}>;
		}>;
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
		total: number;
		status: OrderStatus;
		createdAt: string;
		updatedAt: string;
		user: { __typename?: 'User'; id: string; name: string };
		products: Array<{
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
				images: Array<{ __typename?: 'Image'; id: string; path: string }>;
			};
		}>;
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
		payouts: Array<{
			__typename?: 'Payout';
			id: string;
			amount: number;
			createdAt: string;
		}>;
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

export type ProductsQueryVariables = Exact<{ [key: string]: never }>;

export type ProductsQuery = {
	__typename?: 'Query';
	currentStore: {
		__typename?: 'Store';
		id: string;
		products: Array<{
			__typename?: 'Product';
			id: string;
			name: string;
			description: string;
			unitPrice: number;
			quantity: number;
			images: Array<{ __typename?: 'Image'; id: string; path: string }>;
		}>;
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
		images: Array<{ __typename?: 'Image'; id: string; path: string }>;
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
		images: Array<{ __typename?: 'Image'; id: string; path: string }>;
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
		images: Array<{ __typename?: 'Image'; id: string; path: string }>;
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
		orders: Array<{
			__typename?: 'Order';
			id: string;
			status: OrderStatus;
			total: number;
			createdAt: string;
			updatedAt: string;
		}>;
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
		revenue: number;
		payedOut: number;
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
		message?: string | null;
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
		phone: string;
		orders: Array<{
			__typename?: 'Order';
			id: string;
			total: number;
			createdAt: string;
			products: Array<{
				__typename?: 'OrderProduct';
				id: string;
				product: { __typename?: 'Product'; id: string; name: string };
			}>;
		}>;
	};
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
export const OrdersDocument = gql`
	query Orders {
		currentStore {
			id
			orders {
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
export const ProductsDocument = gql`
	query Products {
		currentStore {
			id
			products {
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
export const StoreDocument = gql`
	query Store {
		currentStore {
			id
			name
			description
			website
			twitter
			instagram
			revenue
			payedOut
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
			message
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
			phone
			orders {
				id
				products {
					id
					product {
						id
						name
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
