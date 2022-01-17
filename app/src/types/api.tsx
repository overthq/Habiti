import gql from 'graphql-tag';
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
	/** The `Upload` scalar type represents a file upload. */
	Upload: any;
};

export type AddProductToCartInput = {
	cartId: Scalars['ID'];
	productId: Scalars['ID'];
	quantity?: InputMaybe<Scalars['Int']>;
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
	product?: Maybe<CartProduct>;
	products: Array<CartProduct>;
	store: Store;
	storeId: Scalars['ID'];
	total: Scalars['Int'];
	updatedAt: Scalars['String'];
	user: User;
	userId: Scalars['ID'];
};

export type CartProductArgs = {
	id: Scalars['ID'];
};

export type CartProduct = {
	__typename?: 'CartProduct';
	cart: Cart;
	cartId: Scalars['ID'];
	product: Product;
	productId: Scalars['ID'];
	quantity: Scalars['Int'];
};

export type CreateCartInput = {
	productId: Scalars['ID'];
	quantity: Scalars['Int'];
	storeId: Scalars['ID'];
};

export type CreateProductInput = {
	description: Scalars['String'];
	name: Scalars['String'];
	quantity: Scalars['Int'];
	storeId: Scalars['ID'];
	unitPrice: Scalars['Int'];
};

export type CreateStoreInput = {
	description: Scalars['String'];
	imageFile?: InputMaybe<Scalars['Upload']>;
	instagram?: InputMaybe<Scalars['String']>;
	name: Scalars['String'];
	twitter?: InputMaybe<Scalars['String']>;
	website?: InputMaybe<Scalars['String']>;
};

export type EditProductInput = {
	description?: InputMaybe<Scalars['String']>;
	imageFile?: InputMaybe<Scalars['Upload']>;
	name?: InputMaybe<Scalars['String']>;
	quantity?: InputMaybe<Scalars['Int']>;
	unitPrice?: InputMaybe<Scalars['Int']>;
};

export type EditProfileInput = {
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
	store?: Maybe<Store>;
	storeId?: Maybe<Scalars['ID']>;
	updatedAt: Scalars['String'];
};

export type Mutation = {
	__typename?: 'Mutation';
	_?: Maybe<Scalars['Boolean']>;
	addToCart: Product;
	addToWatchlist: WatchlistProduct;
	createCart: Cart;
	createOrder: Order;
	createProduct: Product;
	createStore: Store;
	deleteCard: Card;
	deleteCart: Scalars['ID'];
	deleteImage: Image;
	deleteStore: Scalars['ID'];
	deleteUser: Scalars['ID'];
	editProduct: Product;
	editProfile: User;
	editStore: Store;
	followStore: Store;
	removeFromCart: Product;
	unfollowStore: Store;
	updateCartProduct: CartProduct;
};

export type MutationAddToCartArgs = {
	input: AddProductToCartInput;
};

export type MutationAddToWatchlistArgs = {
	productId: Scalars['ID'];
};

export type MutationCreateCartArgs = {
	input: CreateCartInput;
};

export type MutationCreateOrderArgs = {
	cartId: Scalars['ID'];
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

export type MutationRemoveFromCartArgs = {
	cartId: Scalars['ID'];
	productId: Scalars['ID'];
};

export type MutationUnfollowStoreArgs = {
	storeId: Scalars['ID'];
};

export type MutationUpdateCartProductArgs = {
	input: UpdateCartProductInput;
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
	order: Order;
	orderId: Scalars['ID'];
	product: Product;
	productId: Scalars['ID'];
	quantity: Scalars['Int'];
	unitPrice: Scalars['Int'];
};

export enum OrderStatus {
	Cancelled = 'Cancelled',
	Delivered = 'Delivered',
	Pending = 'Pending'
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
	currentUser: User;
	order: Order;
	product: Product;
	store: Store;
	storeProducts: Array<Product>;
	stores: Array<Store>;
	user: User;
	userCart?: Maybe<Cart>;
	userCarts: Array<Cart>;
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

export type QueryStoreArgs = {
	id: Scalars['ID'];
};

export type QueryStoreProductsArgs = {
	id: Scalars['ID'];
};

export type QueryUserArgs = {
	id: Scalars['ID'];
};

export type QueryUserCartArgs = {
	storeId: Scalars['ID'];
};

export type QueryUserCartsArgs = {
	userId: Scalars['ID'];
};

export type Store = {
	__typename?: 'Store';
	cartForUser?: Maybe<Cart>;
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
	store: Store;
	storeId: Scalars['ID'];
};

export type StoreManager = {
	__typename?: 'StoreManager';
	manager: User;
	managerId: Scalars['ID'];
	store: Store;
	storeId: Scalars['ID'];
};

export type UpdateCartProductInput = {
	cartId: Scalars['ID'];
	productId: Scalars['ID'];
	quantity: Scalars['Int'];
};

export type User = {
	__typename?: 'User';
	cards: Array<Card>;
	carts: Array<Cart>;
	createdAt: Scalars['String'];
	followed: Array<StoreFollower>;
	id: Scalars['ID'];
	managed: Array<StoreManager>;
	name: Scalars['String'];
	orders: Array<Order>;
	phone: Scalars['String'];
	updatedAt: Scalars['String'];
	watchlist: Array<WatchlistProduct>;
};

export type WatchlistProduct = {
	__typename?: 'WatchlistProduct';
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
				image?:
					| { __typename?: 'Image'; id: string; path: string }
					| null
					| undefined;
			};
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
				};
			}>;
		}>;
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
				storeId: string;
				images: Array<{ __typename?: 'Image'; id: string; path: string }>;
			};
		}>;
	};
};

export type AddToCartMutationVariables = Exact<{
	input: AddProductToCartInput;
}>;

export type AddToCartMutation = {
	__typename?: 'Mutation';
	addToCart: {
		__typename?: 'Product';
		id: string;
		storeId: string;
		inCart: boolean;
	};
};

export type RemoveFromCartMutationVariables = Exact<{
	productId: Scalars['ID'];
	cartId: Scalars['ID'];
}>;

export type RemoveFromCartMutation = {
	__typename?: 'Mutation';
	removeFromCart: {
		__typename?: 'Product';
		id: string;
		storeId: string;
		inCart: boolean;
	};
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
		products: Array<{
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
		}>;
	};
};

export type DeleteCartMutationVariables = Exact<{
	cartId: Scalars['ID'];
}>;

export type DeleteCartMutation = {
	__typename?: 'Mutation';
	deleteCart: string;
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

export type UserOrdersQueryVariables = Exact<{ [key: string]: never }>;

export type UserOrdersQuery = {
	__typename?: 'Query';
	currentUser: {
		__typename?: 'User';
		id: string;
		orders: Array<{
			__typename?: 'Order';
			id: string;
			total: number;
			createdAt: string;
			store: {
				__typename?: 'Store';
				id: string;
				name: string;
				image?:
					| { __typename?: 'Image'; id: string; path: string }
					| null
					| undefined;
			};
			products: Array<{
				__typename?: 'OrderProduct';
				unitPrice: number;
				quantity: number;
				product: { __typename?: 'Product'; id: string; name: string };
			}>;
		}>;
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
		createdAt: string;
		store: {
			__typename?: 'Store';
			id: string;
			name: string;
			image?:
				| { __typename?: 'Image'; id: string; path: string }
				| null
				| undefined;
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
	cartId: Scalars['ID'];
}>;

export type CreateOrderMutation = {
	__typename?: 'Mutation';
	createOrder: {
		__typename?: 'Order';
		id: string;
		total: number;
		store: { __typename?: 'Store'; id: string; name: string };
		products: Array<{
			__typename?: 'OrderProduct';
			unitPrice: number;
			quantity: number;
			product: { __typename?: 'Product'; id: string; name: string };
		}>;
	};
};

export type StoreProductsQueryVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type StoreProductsQuery = {
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
			storeId: string;
			images: Array<{ __typename?: 'Image'; id: string; path: string }>;
		}>;
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
		store: {
			__typename?: 'Store';
			id: string;
			cartForUser?:
				| {
						__typename?: 'Cart';
						id: string;
						userId: string;
						storeId: string;
						store: { __typename?: 'Store'; id: string; name: string };
				  }
				| null
				| undefined;
		};
		images: Array<{ __typename?: 'Image'; id: string; path: string }>;
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
	productId: Scalars['ID'];
}>;

export type AddToWatchlistMutation = {
	__typename?: 'Mutation';
	addToWatchlist: {
		__typename?: 'WatchlistProduct';
		userId: string;
		productId: string;
		user: {
			__typename?: 'User';
			watchlist: Array<{
				__typename?: 'WatchlistProduct';
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
};

export type StoresQueryVariables = Exact<{ [key: string]: never }>;

export type StoresQuery = {
	__typename?: 'Query';
	stores: Array<{
		__typename?: 'Store';
		id: string;
		name: string;
		image?:
			| { __typename?: 'Image'; id: string; path: string }
			| null
			| undefined;
	}>;
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
		description?: string | null | undefined;
		website?: string | null | undefined;
		twitter?: string | null | undefined;
		instagram?: string | null | undefined;
		followedByUser: boolean;
		image?:
			| { __typename?: 'Image'; id: string; path: string }
			| null
			| undefined;
	};
};

export type FollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type FollowStoreMutation = {
	__typename?: 'Mutation';
	followStore: { __typename?: 'Store'; id: string; followedByUser: boolean };
};

export type UnfollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type UnfollowStoreMutation = {
	__typename?: 'Mutation';
	unfollowStore: { __typename?: 'Store'; id: string; followedByUser: boolean };
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
				image?:
					| { __typename?: 'Image'; id: string; path: string }
					| null
					| undefined;
			};
		}>;
	};
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
	__typename?: 'Query';
	currentUser: { __typename?: 'User'; id: string; name: string; phone: string };
};

export type EditProfileMutationVariables = Exact<{
	input: EditProfileInput;
}>;

export type EditProfileMutation = {
	__typename?: 'Mutation';
	editProfile: { __typename?: 'User'; id: string; name: string; phone: string };
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
	options: Omit<Urql.UseQueryArgs<CardsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<CardsQuery>({ query: CardsDocument, ...options });
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
					product {
						id
						name
						unitPrice
					}
					quantity
				}
				total
			}
		}
	}
`;

export function useCartsQuery(
	options: Omit<Urql.UseQueryArgs<CartsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<CartsQuery>({ query: CartsDocument, ...options });
}
export const CartDocument = gql`
	query Cart($cartId: ID!) {
		cart(id: $cartId) {
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
	options: Omit<Urql.UseQueryArgs<CartQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<CartQuery>({ query: CartDocument, ...options });
}
export const AddToCartDocument = gql`
	mutation AddToCart($input: AddProductToCartInput!) {
		addToCart(input: $input) {
			id
			storeId
			inCart
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
		removeFromCart(productId: $productId, cartId: $cartId) {
			id
			storeId
			inCart
		}
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
		deleteCart(cartId: $cartId)
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
					}
					unitPrice
					quantity
				}
				total
				createdAt
			}
		}
	}
`;

export function useUserOrdersQuery(
	options: Omit<Urql.UseQueryArgs<UserOrdersQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<UserOrdersQuery>({
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
			createdAt
		}
	}
`;

export function useOrderQuery(
	options: Omit<Urql.UseQueryArgs<OrderQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<OrderQuery>({ query: OrderDocument, ...options });
}
export const CreateOrderDocument = gql`
	mutation CreateOrder($cartId: ID!) {
		createOrder(cartId: $cartId) {
			id
			store {
				id
				name
			}
			products {
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
	query StoreProducts($storeId: ID!) {
		store(id: $storeId) {
			id
			products {
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
	options: Omit<Urql.UseQueryArgs<StoreProductsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoreProductsQuery>({
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
				cartForUser {
					id
					userId
					storeId
					store {
						id
						name
					}
				}
			}
			images {
				id
				path
			}
			inCart
		}
	}
`;

export function useProductQuery(
	options: Omit<Urql.UseQueryArgs<ProductQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ProductQuery>({ query: ProductDocument, ...options });
}
export const WatchlistDocument = gql`
	query Watchlist {
		currentUser {
			id
			watchlist {
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
	options: Omit<Urql.UseQueryArgs<WatchlistQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<WatchlistQuery>({
		query: WatchlistDocument,
		...options
	});
}
export const AddToWatchlistDocument = gql`
	mutation AddToWatchlist($productId: ID!) {
		addToWatchlist(productId: $productId) {
			userId
			productId
			user {
				watchlist {
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
	}
`;

export function useAddToWatchlistMutation() {
	return Urql.useMutation<
		AddToWatchlistMutation,
		AddToWatchlistMutationVariables
	>(AddToWatchlistDocument);
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
	options: Omit<Urql.UseQueryArgs<StoresQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoresQuery>({ query: StoresDocument, ...options });
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
			followedByUser
		}
	}
`;

export function useStoreQuery(
	options: Omit<Urql.UseQueryArgs<StoreQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoreQuery>({ query: StoreDocument, ...options });
}
export const FollowStoreDocument = gql`
	mutation FollowStore($storeId: ID!) {
		followStore(storeId: $storeId) {
			id
			followedByUser
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
			followedByUser
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
				}
			}
		}
	}
`;

export function useStoresFollowedQuery(
	options: Omit<Urql.UseQueryArgs<StoresFollowedQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoresFollowedQuery>({
		query: StoresFollowedDocument,
		...options
	});
}
export const CurrentUserDocument = gql`
	query CurrentUser {
		currentUser {
			id
			name
			phone
		}
	}
`;

export function useCurrentUserQuery(
	options: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<CurrentUserQuery>({
		query: CurrentUserDocument,
		...options
	});
}
export const EditProfileDocument = gql`
	mutation EditProfile($input: EditProfileInput!) {
		editProfile(input: $input) {
			id
			name
			phone
		}
	}
`;

export function useEditProfileMutation() {
	return Urql.useMutation<EditProfileMutation, EditProfileMutationVariables>(
		EditProfileDocument
	);
}
