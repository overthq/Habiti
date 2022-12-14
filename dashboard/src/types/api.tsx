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
	phone: Scalars['String'];
};

export type AuthenticateResponse = {
	__typename?: 'AuthenticateResponse';
	message?: Maybe<Scalars['String']>;
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

export type Cart = {
	__typename?: 'Cart';
	createdAt: Scalars['String'];
	id: Scalars['ID'];
	products: Array<CartProduct>;
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

export type CreateOrderInput = {
	cardId?: InputMaybe<Scalars['ID']>;
	cartId: Scalars['ID'];
};

export type CreateProductInput = {
	description: Scalars['String'];
	imageFiles: Array<Scalars['Upload']>;
	name: Scalars['String'];
	quantity: Scalars['Int'];
	storeId: Scalars['ID'];
	unitPrice: Scalars['Int'];
};

export type CreateStoreInput = {
	description: Scalars['String'];
	instagram?: InputMaybe<Scalars['String']>;
	name: Scalars['String'];
	storeImage?: InputMaybe<Scalars['Upload']>;
	twitter?: InputMaybe<Scalars['String']>;
	website?: InputMaybe<Scalars['String']>;
};

export type EditProductInput = {
	description?: InputMaybe<Scalars['String']>;
	imageFiles: Array<Scalars['Upload']>;
	name?: InputMaybe<Scalars['String']>;
	quantity?: InputMaybe<Scalars['Int']>;
	unitPrice?: InputMaybe<Scalars['Int']>;
};

export type EditProfileInput = {
	email?: InputMaybe<Scalars['String']>;
	name?: InputMaybe<Scalars['String']>;
	phone?: InputMaybe<Scalars['String']>;
};

export type EditStoreInput = {
	description?: InputMaybe<Scalars['String']>;
	imageFile?: InputMaybe<Scalars['Upload']>;
	instagram?: InputMaybe<Scalars['String']>;
	name?: InputMaybe<Scalars['String']>;
	twitter?: InputMaybe<Scalars['String']>;
	website?: InputMaybe<Scalars['String']>;
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

export type Mutation = {
	__typename?: 'Mutation';
	_?: Maybe<Scalars['Boolean']>;
	addStoreManager: StoreManager;
	addToCart: CartProduct;
	addToWatchlist: WatchlistProduct;
	authenticate: AuthenticateResponse;
	createCart: Cart;
	createOrder: Order;
	createProduct: Product;
	createStore: Store;
	deleteAccount: User;
	deleteCard: Card;
	deleteCart: Scalars['ID'];
	deleteImage: Image;
	deleteProduct: Product;
	deleteStore: Scalars['ID'];
	deleteUser: Scalars['ID'];
	editProduct: Product;
	editProfile: User;
	editStore: Store;
	followStore: StoreFollower;
	register: User;
	removeFromCart: Scalars['ID'];
	removeStoreManager: StoreManager;
	unfollowStore: StoreFollower;
	updateCartProduct: CartProduct;
	updateOrder: Order;
	verify: VerifyResponse;
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

export type MutationCreateProductArgs = {
	input: CreateProductInput;
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

export type MutationEditProfileArgs = {
	input: EditProfileInput;
};

export type MutationEditStoreArgs = {
	id: Scalars['ID'];
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

export type MutationRemoveStoreManagerArgs = {
	managerId: Scalars['ID'];
	storeId: Scalars['ID'];
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

export type NewStats = {
	__typename?: 'NewStats';
	daily: Stats;
	monthly: Stats;
	weekly: Stats;
	yearly: Stats;
};

export type Order = {
	__typename?: 'Order';
	createdAt: Scalars['String'];
	id: Scalars['ID'];
	products: Array<OrderProduct>;
	status: OrderStatus;
	store: Store;
	storeId: Scalars['ID'];
	total: Scalars['Int'];
	updatedAt: Scalars['String'];
	user: User;
	userId: Scalars['ID'];
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

export type Product = {
	__typename?: 'Product';
	carts: Array<CartProduct>;
	createdAt: Scalars['String'];
	description: Scalars['String'];
	id: Scalars['ID'];
	images: Array<Image>;
	inCart: Scalars['Boolean'];
	name: Scalars['String'];
	orders: Array<Order>;
	quantity: Scalars['Int'];
	store: Store;
	storeId: Scalars['ID'];
	unitPrice: Scalars['Int'];
	updatedAt: Scalars['String'];
	watchlists: Array<WatchlistProduct>;
};

export type Query = {
	__typename?: 'Query';
	_?: Maybe<Scalars['Boolean']>;
	cart: Cart;
	carts: Array<Cart>;
	currentUser: User;
	order: Order;
	product: Product;
	stats: Stats;
	store: Store;
	storeProducts: Array<Product>;
	stores: Array<Store>;
	user: User;
	users: Array<User>;
};

export type QueryCartArgs = {
	id: Scalars['ID'];
};

export type QueryOrderArgs = {
	id: Scalars['ID'];
};

export type QueryProductArgs = {
	id: Scalars['ID'];
};

export type QueryStatsArgs = {
	period?: InputMaybe<StatPeriod>;
	storeId: Scalars['ID'];
};

export type QueryStoreArgs = {
	id: Scalars['ID'];
};

export type QueryStoreProductsArgs = {
	id: Scalars['ID'];
};

export type QueryUserArgs = {
	id: Scalars['ID'];
};

export type RegisterInput = {
	email: Scalars['String'];
	name: Scalars['String'];
	phone: Scalars['String'];
};

export enum StatPeriod {
	Day = 'Day',
	Month = 'Month',
	Week = 'Week',
	Year = 'Year'
}

export type Stats = {
	__typename?: 'Stats';
	id: Scalars['ID'];
	orders: Array<Order>;
	pendingOrderCount: Scalars['Int'];
	products: Array<Product>;
	revenue: Scalars['Int'];
	storeId: Scalars['ID'];
};

export type Store = {
	__typename?: 'Store';
	cartId?: Maybe<Scalars['ID']>;
	carts: Array<Cart>;
	createdAt: Scalars['String'];
	description?: Maybe<Scalars['String']>;
	followedByUser: Scalars['Boolean'];
	followers: Array<StoreFollower>;
	id: Scalars['ID'];
	image?: Maybe<Image>;
	instagram?: Maybe<Scalars['String']>;
	managers: Array<StoreManager>;
	name: Scalars['String'];
	orders: Array<Order>;
	products: Array<Product>;
	twitter?: Maybe<Scalars['String']>;
	updatedAt: Scalars['String'];
	website?: Maybe<Scalars['String']>;
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

export enum StoreStatPeriod {
	Day = 'Day',
	Month = 'Month',
	Week = 'Week',
	Year = 'Year'
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
	cards: Array<Card>;
	carts: Array<Cart>;
	createdAt: Scalars['String'];
	email: Scalars['String'];
	followed: Array<StoreFollower>;
	id: Scalars['ID'];
	managed: Array<StoreManager>;
	name: Scalars['String'];
	orders: Array<Order>;
	phone: Scalars['String'];
	updatedAt: Scalars['String'];
	watchlist: Array<WatchlistProduct>;
};

export type VerifyInput = {
	code: Scalars['String'];
	phone: Scalars['String'];
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

export type ManagedStoresQueryVariables = Exact<{
	userId: Scalars['ID'];
}>;

export type ManagedStoresQuery = {
	__typename?: 'Query';
	user: {
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

export type OrdersQueryVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type OrdersQuery = {
	__typename?: 'Query';
	store: {
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
	id: Scalars['ID'];
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
	orderId: Scalars['ID'];
	input: UpdateOrderInput;
}>;

export type UpdateOrderMutation = {
	__typename?: 'Mutation';
	updateOrder: { __typename?: 'Order'; id: string };
};

export type ProductsQueryVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type ProductsQuery = {
	__typename?: 'Query';
	store: {
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
	id: Scalars['ID'];
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
	id: Scalars['ID'];
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
	storeId: Scalars['ID'];
	period: StatPeriod;
}>;

export type StatsQuery = {
	__typename?: 'Query';
	stats: {
		__typename?: 'Stats';
		id: string;
		revenue: number;
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
	storeId: Scalars['ID'];
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
	userId: Scalars['ID'];
}>;

export type CustomerInfoQuery = {
	__typename?: 'Query';
	user: {
		__typename?: 'User';
		id: string;
		name: string;
		phone: string;
		orders: Array<{ __typename?: 'Order'; id: string; total: number }>;
	};
};

export const ManagedStoresDocument = gql`
	query ManagedStores($userId: ID!) {
		user(id: $userId) {
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
	options: Omit<Urql.UseQueryArgs<ManagedStoresQueryVariables>, 'query'>
) {
	return Urql.useQuery<ManagedStoresQuery, ManagedStoresQueryVariables>({
		query: ManagedStoresDocument,
		...options
	});
}
export const OrdersDocument = gql`
	query Orders($storeId: ID!) {
		store(id: $storeId) {
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
	options: Omit<Urql.UseQueryArgs<OrdersQueryVariables>, 'query'>
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
export const ProductsDocument = gql`
	query Products($storeId: ID!) {
		store(id: $storeId) {
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
	options: Omit<Urql.UseQueryArgs<ProductsQueryVariables>, 'query'>
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
	query Stats($storeId: ID!, $period: StatPeriod!) {
		stats(storeId: $storeId, period: $period) {
			id
			orders {
				id
				status
				total
				createdAt
				updatedAt
			}
			revenue
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
	mutation EditStore($storeId: ID!, $input: EditStoreInput!) {
		editStore(id: $storeId, input: $input) {
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
				total
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
