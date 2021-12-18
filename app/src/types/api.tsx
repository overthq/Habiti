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
	cartId?: InputMaybe<Scalars['ID']>;
	productId: Scalars['ID'];
	quantity?: InputMaybe<Scalars['Int']>;
	storeId: Scalars['ID'];
};

export type Cart = {
	__typename?: 'Cart';
	createdAt: Scalars['String'];
	id: Scalars['ID'];
	products: Array<CartProduct>;
	store: Store;
	storeId: Scalars['ID'];
	updatedAt: Scalars['String'];
	user: User;
	userId: Scalars['ID'];
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
	storeId: Scalars['ID'];
	userId: Scalars['ID'];
};

export type CreateProductInput = {
	description: Scalars['String'];
	name: Scalars['String'];
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
	unitPrice?: InputMaybe<Scalars['Int']>;
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
	updatedAt: Scalars['String'];
};

export type Mutation = {
	__typename?: 'Mutation';
	_?: Maybe<Scalars['Boolean']>;
	addProductToCart: Cart;
	createOrder: Order;
	createProduct: Product;
	createStore: Store;
	deleteCart: Scalars['ID'];
	deleteStore: Scalars['ID'];
	deleteUser: Scalars['ID'];
	editProduct: Product;
	editStore: Store;
	followStore: Store;
	removeProductFromCart: Scalars['ID'];
	unfollowStore: Store;
};

export type MutationAddProductToCartArgs = {
	input: AddProductToCartInput;
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

export type MutationDeleteCartArgs = {
	cartId: Scalars['ID'];
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

export type MutationEditStoreArgs = {
	id: Scalars['ID'];
	input: EditStoreInput;
};

export type MutationFollowStoreArgs = {
	storeId: Scalars['ID'];
};

export type MutationRemoveProductFromCartArgs = {
	cartId: Scalars['ID'];
	productId: Scalars['ID'];
};

export type MutationUnfollowStoreArgs = {
	storeId: Scalars['ID'];
};

export type Order = {
	__typename?: 'Order';
	createdAt: Scalars['String'];
	id: Scalars['ID'];
	products: Array<OrderProduct>;
	store: Store;
	storeId: Scalars['ID'];
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

export type Product = {
	__typename?: 'Product';
	carts: Array<CartProduct>;
	createdAt: Scalars['String'];
	description: Scalars['String'];
	id: Scalars['ID'];
	images: Array<Image>;
	name: Scalars['String'];
	orders: Array<Order>;
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
	storeOrders: Array<Order>;
	storeProducts: Array<Product>;
	stores: Array<Store>;
	user: User;
	userCarts: Array<Cart>;
	userOrders: Array<Order>;
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

export type QueryStoreOrdersArgs = {
	storeId: Scalars['ID'];
};

export type QueryStoreProductsArgs = {
	id: Scalars['ID'];
};

export type QueryUserArgs = {
	id: Scalars['ID'];
};

export type QueryUserCartsArgs = {
	userId: Scalars['ID'];
};

export type QueryUserOrdersArgs = {
	userId: Scalars['ID'];
};

export type Store = {
	__typename?: 'Store';
	carts: Array<Cart>;
	createdAt: Scalars['String'];
	description?: Maybe<Scalars['String']>;
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

export type User = {
	__typename?: 'User';
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
			store: { __typename?: 'Store'; id: string; name: string };
			products: Array<{
				__typename?: 'CartProduct';
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
		store: { __typename?: 'Store'; id: string; name: string };
		products: Array<{
			__typename?: 'CartProduct';
			productId: string;
			quantity: number;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
			};
		}>;
	};
};

export type AddProductToCartMutationVariables = Exact<{
	input: AddProductToCartInput;
}>;

export type AddProductToCartMutation = {
	__typename?: 'Mutation';
	addProductToCart: {
		__typename?: 'Cart';
		id: string;
		userId: string;
		storeId: string;
		store: { __typename?: 'Store'; id: string; name: string };
		products: Array<{
			__typename?: 'CartProduct';
			productId: string;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
			};
		}>;
	};
};

export type RemoveProductFromCartMutationVariables = Exact<{
	productId: Scalars['ID'];
	cartId: Scalars['ID'];
}>;

export type RemoveProductFromCartMutation = {
	__typename?: 'Mutation';
	removeProductFromCart: string;
};

export type DeleteCartMutationVariables = Exact<{
	cartId: Scalars['ID'];
}>;

export type DeleteCartMutation = {
	__typename?: 'Mutation';
	deleteCart: string;
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
			store: { __typename?: 'Store'; id: string; name: string };
			products: Array<{
				__typename?: 'OrderProduct';
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

export type OrderQueryVariables = Exact<{
	orderId: Scalars['ID'];
}>;

export type OrderQuery = {
	__typename?: 'Query';
	order: {
		__typename?: 'Order';
		id: string;
		store: { __typename?: 'Store'; id: string; name: string };
		products: Array<{
			__typename?: 'OrderProduct';
			quantity: number;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
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
		store: { __typename?: 'Store'; id: string; name: string };
		products: Array<{
			__typename?: 'OrderProduct';
			quantity: number;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				unitPrice: number;
			};
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
		followers: Array<{
			__typename?: 'StoreFollower';
			follower: { __typename?: 'User'; id: string; name: string };
		}>;
	};
};

export type FollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type FollowStoreMutation = {
	__typename?: 'Mutation';
	followStore: {
		__typename?: 'Store';
		id: string;
		followers: Array<{
			__typename?: 'StoreFollower';
			follower: { __typename?: 'User'; id: string; name: string };
		}>;
	};
};

export type UnfollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type UnfollowStoreMutation = {
	__typename?: 'Mutation';
	unfollowStore: {
		__typename?: 'Store';
		id: string;
		followers: Array<{
			__typename?: 'StoreFollower';
			follower: { __typename?: 'User'; id: string; name: string };
		}>;
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
			store: { __typename?: 'Store'; id: string; name: string };
		}>;
	};
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
	__typename?: 'Query';
	currentUser: { __typename?: 'User'; id: string; name: string; phone: string };
};

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
				}
				products {
					productId
					product {
						id
						name
						unitPrice
					}
					quantity
				}
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
				productId
				product {
					id
					name
					unitPrice
				}
				quantity
			}
		}
	}
`;

export function useCartQuery(
	options: Omit<Urql.UseQueryArgs<CartQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<CartQuery>({ query: CartDocument, ...options });
}
export const AddProductToCartDocument = gql`
	mutation AddProductToCart($input: AddProductToCartInput!) {
		addProductToCart(input: $input) {
			id
			userId
			storeId
			store {
				id
				name
			}
			products {
				productId
				product {
					id
					name
					unitPrice
				}
			}
		}
	}
`;

export function useAddProductToCartMutation() {
	return Urql.useMutation<
		AddProductToCartMutation,
		AddProductToCartMutationVariables
	>(AddProductToCartDocument);
}
export const RemoveProductFromCartDocument = gql`
	mutation RemoveProductFromCart($productId: ID!, $cartId: ID!) {
		removeProductFromCart(productId: $productId, cartId: $cartId)
	}
`;

export function useRemoveProductFromCartMutation() {
	return Urql.useMutation<
		RemoveProductFromCartMutation,
		RemoveProductFromCartMutationVariables
	>(RemoveProductFromCartDocument);
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
export const UserOrdersDocument = gql`
	query UserOrders {
		currentUser {
			id
			orders {
				id
				store {
					id
					name
				}
				products {
					product {
						id
						name
						unitPrice
					}
					quantity
				}
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
			}
			products {
				product {
					id
					name
					unitPrice
				}
				quantity
			}
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
					unitPrice
				}
				quantity
			}
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
			images {
				id
				path
			}
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
			followers {
				follower {
					id
					name
				}
			}
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
			followers {
				follower {
					id
					name
				}
			}
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
			followers {
				follower {
					id
					name
				}
			}
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
				store {
					id
					name
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
