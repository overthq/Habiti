import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
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
};

export type AddProductToCartInput = {
	cartId?: Maybe<Scalars['ID']>;
	storeId: Scalars['ID'];
	productId: Scalars['ID'];
	quantity?: Maybe<Scalars['Int']>;
};

export type Cart = {
	__typename?: 'Cart';
	id: Scalars['ID'];
	userId: Scalars['ID'];
	storeId: Scalars['ID'];
	user: User;
	store: Store;
	products: Array<CartProduct>;
	createdAt: Scalars['String'];
	updatedAt: Scalars['String'];
};

export type CartProduct = {
	__typename?: 'CartProduct';
	cartId: Scalars['ID'];
	productId: Scalars['ID'];
	quantity: Scalars['Int'];
	cart: Cart;
	product: Product;
};

export type CreateCartInput = {
	userId: Scalars['ID'];
	storeId: Scalars['ID'];
};

export type CreateProductInput = {
	name: Scalars['String'];
	description: Scalars['String'];
	unitPrice: Scalars['Int'];
	storeId: Scalars['ID'];
};

export type CreateStoreInput = {
	name: Scalars['String'];
	description?: Maybe<Scalars['String']>;
	website?: Maybe<Scalars['String']>;
	twitter?: Maybe<Scalars['String']>;
	instagram?: Maybe<Scalars['String']>;
};

export type EditProductInput = {
	name?: Maybe<Scalars['String']>;
	description?: Maybe<Scalars['String']>;
	unitPrice?: Maybe<Scalars['Int']>;
};

export type Mutation = {
	__typename?: 'Mutation';
	_?: Maybe<Scalars['Boolean']>;
	deleteUser: Scalars['ID'];
	createStore: Store;
	followStore: StoreFollower;
	unfollowStore: Scalars['ID'];
	deleteStore: Scalars['ID'];
	createProduct: Product;
	editProduct: Product;
	createOrder: Order;
	addProductToCart: Cart;
	removeProductFromCart: Scalars['ID'];
	deleteCart: Scalars['ID'];
};

export type MutationDeleteUserArgs = {
	userId: Scalars['ID'];
};

export type MutationCreateStoreArgs = {
	input: CreateStoreInput;
};

export type MutationFollowStoreArgs = {
	storeId: Scalars['ID'];
};

export type MutationUnfollowStoreArgs = {
	storeId: Scalars['ID'];
};

export type MutationDeleteStoreArgs = {
	id: Scalars['ID'];
};

export type MutationCreateProductArgs = {
	input: CreateProductInput;
};

export type MutationEditProductArgs = {
	id: Scalars['ID'];
	input: EditProductInput;
};

export type MutationCreateOrderArgs = {
	cartId: Scalars['ID'];
};

export type MutationAddProductToCartArgs = {
	input: AddProductToCartInput;
};

export type MutationRemoveProductFromCartArgs = {
	cartId: Scalars['ID'];
	productId: Scalars['ID'];
};

export type MutationDeleteCartArgs = {
	cartId: Scalars['ID'];
};

export type Order = {
	__typename?: 'Order';
	id: Scalars['ID'];
	userId: Scalars['ID'];
	storeId: Scalars['ID'];
	user: User;
	store: Store;
	products: Array<OrderProduct>;
	createdAt: Scalars['String'];
	updatedAt: Scalars['String'];
};

export type OrderProduct = {
	__typename?: 'OrderProduct';
	orderId: Scalars['ID'];
	productId: Scalars['ID'];
	unitPrice: Scalars['Int'];
	quantity: Scalars['Int'];
	order: Order;
	product: Product;
};

export type Product = {
	__typename?: 'Product';
	id: Scalars['ID'];
	name: Scalars['String'];
	description: Scalars['String'];
	unitPrice: Scalars['Int'];
	storeId: Scalars['ID'];
	store: Store;
	orders: Array<Order>;
	carts: Array<CartProduct>;
	createdAt: Scalars['String'];
	updatedAt: Scalars['String'];
};

export type Query = {
	__typename?: 'Query';
	_?: Maybe<Scalars['Boolean']>;
	user: User;
	users: Array<User>;
	store: Store;
	stores: Array<Store>;
	followedStores: Array<Store>;
	product: Product;
	storeProducts: Array<Product>;
	order: Order;
	userOrders: Array<Order>;
	storeOrders: Array<Order>;
	cart: Cart;
	userCarts: Array<Cart>;
};

export type QueryUserArgs = {
	id: Scalars['ID'];
};

export type QueryStoreArgs = {
	id: Scalars['ID'];
};

export type QueryFollowedStoresArgs = {
	userId: Scalars['ID'];
};

export type QueryProductArgs = {
	id: Scalars['ID'];
};

export type QueryStoreProductsArgs = {
	id: Scalars['ID'];
};

export type QueryOrderArgs = {
	id: Scalars['ID'];
};

export type QueryUserOrdersArgs = {
	userId: Scalars['ID'];
};

export type QueryStoreOrdersArgs = {
	storeId: Scalars['ID'];
};

export type QueryCartArgs = {
	id: Scalars['ID'];
};

export type QueryUserCartsArgs = {
	userId: Scalars['ID'];
};

export type Store = {
	__typename?: 'Store';
	id: Scalars['ID'];
	name: Scalars['String'];
	description?: Maybe<Scalars['String']>;
	website?: Maybe<Scalars['String']>;
	twitter?: Maybe<Scalars['String']>;
	instagram?: Maybe<Scalars['String']>;
	products: Array<Product>;
	orders: Array<Order>;
	managers: Array<StoreManager>;
	followers: Array<StoreFollower>;
	carts: Array<Cart>;
	createdAt: Scalars['String'];
	updatedAt: Scalars['String'];
};

export type StoreFollower = {
	__typename?: 'StoreFollower';
	storeId: Scalars['ID'];
	followerId: Scalars['ID'];
	store: Store;
	follower: User;
};

export type StoreManager = {
	__typename?: 'StoreManager';
	storeId: Scalars['ID'];
	managerId: Scalars['ID'];
	store: Store;
	manager: User;
};

export type User = {
	__typename?: 'User';
	id: Scalars['ID'];
	name: Scalars['String'];
	phone: Scalars['String'];
	carts: Array<Cart>;
	orders: Array<Order>;
	managed: Array<StoreManager>;
	followed: Array<StoreFollower>;
	createdAt: Scalars['String'];
	updatedAt: Scalars['String'];
};

export type CartsQueryVariables = Exact<{
	userId: Scalars['ID'];
}>;

export type CartsQuery = { __typename?: 'Query' } & {
	user: { __typename?: 'User' } & {
		carts: Array<
			{ __typename?: 'Cart' } & Pick<Cart, 'id' | 'userId' | 'storeId'> & {
					store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'>;
					products: Array<
						{ __typename?: 'CartProduct' } & Pick<
							CartProduct,
							'productId' | 'quantity'
						> & {
								product: { __typename?: 'Product' } & Pick<
									Product,
									'id' | 'name' | 'unitPrice'
								>;
							}
					>;
				}
		>;
	};
};

export type CartQueryVariables = Exact<{
	cartId: Scalars['ID'];
}>;

export type CartQuery = { __typename?: 'Query' } & {
	cart: { __typename?: 'Cart' } & Pick<Cart, 'id' | 'userId' | 'storeId'> & {
			store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'>;
			products: Array<
				{ __typename?: 'CartProduct' } & Pick<
					CartProduct,
					'productId' | 'quantity'
				> & {
						product: { __typename?: 'Product' } & Pick<
							Product,
							'id' | 'name' | 'unitPrice'
						>;
					}
			>;
		};
};

export type AddProductToCartMutationVariables = Exact<{
	input: AddProductToCartInput;
}>;

export type AddProductToCartMutation = { __typename?: 'Mutation' } & {
	addProductToCart: { __typename?: 'Cart' } & Pick<
		Cart,
		'id' | 'userId' | 'storeId'
	> & {
			store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'>;
			products: Array<
				{ __typename?: 'CartProduct' } & Pick<CartProduct, 'productId'> & {
						product: { __typename?: 'Product' } & Pick<
							Product,
							'id' | 'name' | 'unitPrice'
						>;
					}
			>;
		};
};

export type RemoveProductFromCartMutationVariables = Exact<{
	productId: Scalars['ID'];
	cartId: Scalars['ID'];
}>;

export type RemoveProductFromCartMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'removeProductFromCart'
>;

export type DeleteCartMutationVariables = Exact<{
	cartId: Scalars['ID'];
}>;

export type DeleteCartMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'deleteCart'
>;

export type UserOrdersQueryVariables = Exact<{
	userId: Scalars['ID'];
}>;

export type UserOrdersQuery = { __typename?: 'Query' } & {
	user: { __typename?: 'User' } & {
		orders: Array<
			{ __typename?: 'Order' } & Pick<Order, 'id'> & {
					store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'>;
					products: Array<
						{ __typename?: 'OrderProduct' } & Pick<OrderProduct, 'quantity'> & {
								product: { __typename?: 'Product' } & Pick<
									Product,
									'id' | 'name' | 'unitPrice'
								>;
							}
					>;
				}
		>;
	};
};

export type OrderQueryVariables = Exact<{
	orderId: Scalars['ID'];
}>;

export type OrderQuery = { __typename?: 'Query' } & {
	order: { __typename?: 'Order' } & Pick<Order, 'id'> & {
			store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'>;
			products: Array<
				{ __typename?: 'OrderProduct' } & Pick<OrderProduct, 'quantity'> & {
						product: { __typename?: 'Product' } & Pick<
							Product,
							'id' | 'name' | 'unitPrice'
						>;
					}
			>;
		};
};

export type CreateOrderMutationVariables = Exact<{
	cartId: Scalars['ID'];
}>;

export type CreateOrderMutation = { __typename?: 'Mutation' } & {
	createOrder: { __typename?: 'Order' } & Pick<Order, 'id'> & {
			store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'>;
			products: Array<
				{ __typename?: 'OrderProduct' } & Pick<OrderProduct, 'quantity'> & {
						product: { __typename?: 'Product' } & Pick<
							Product,
							'id' | 'name' | 'unitPrice'
						>;
					}
			>;
		};
};

export type StoreProductsQueryVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type StoreProductsQuery = { __typename?: 'Query' } & {
	store: { __typename?: 'Store' } & {
		products: Array<
			{ __typename?: 'Product' } & Pick<
				Product,
				'id' | 'name' | 'description' | 'unitPrice'
			>
		>;
	};
};

export type ProductQueryVariables = Exact<{
	productId: Scalars['ID'];
}>;

export type ProductQuery = { __typename?: 'Query' } & {
	product: { __typename?: 'Product' } & Pick<
		Product,
		'id' | 'name' | 'description' | 'unitPrice' | 'storeId'
	>;
};

export type StoresQueryVariables = Exact<{ [key: string]: never }>;

export type StoresQuery = { __typename?: 'Query' } & {
	stores: Array<{ __typename?: 'Store' } & Pick<Store, 'id' | 'name'>>;
};

export type StoreQueryVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type StoreQuery = { __typename?: 'Query' } & {
	store: { __typename?: 'Store' } & Pick<
		Store,
		'id' | 'name' | 'description' | 'website' | 'twitter' | 'instagram'
	> & {
			followers: Array<
				{ __typename?: 'StoreFollower' } & {
					follower: { __typename?: 'User' } & Pick<User, 'id' | 'name'>;
				}
			>;
		};
};

export type FollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type FollowStoreMutation = { __typename?: 'Mutation' } & {
	followStore: { __typename?: 'StoreFollower' } & Pick<
		StoreFollower,
		'followerId' | 'storeId'
	>;
};

export type UnfollowStoreMutationVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type UnfollowStoreMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'unfollowStore'
>;

export type StoresFollowedQueryVariables = Exact<{
	userId: Scalars['ID'];
}>;

export type StoresFollowedQuery = { __typename?: 'Query' } & {
	user: { __typename?: 'User' } & Pick<User, 'id'> & {
			followed: Array<
				{ __typename?: 'StoreFollower' } & {
					store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'>;
				}
			>;
		};
};

export type CurrentUserQueryVariables = Exact<{
	userId: Scalars['ID'];
}>;

export type CurrentUserQuery = { __typename?: 'Query' } & {
	user: { __typename?: 'User' } & Pick<User, 'id' | 'name' | 'phone'>;
};

export const CartsDocument = gql`
	query Carts($userId: ID!) {
		user(id: $userId) {
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
	query UserOrders($userId: ID!) {
		user(id: $userId) {
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
			products {
				id
				name
				description
				unitPrice
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
		}
	}
`;

export function useProductQuery(
	options: Omit<Urql.UseQueryArgs<ProductQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ProductQuery>({ query: ProductDocument, ...options });
}
export const StoresDocument = gql`
	query Stores {
		stores {
			id
			name
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
			followerId
			storeId
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
		unfollowStore(storeId: $storeId)
	}
`;

export function useUnfollowStoreMutation() {
	return Urql.useMutation<
		UnfollowStoreMutation,
		UnfollowStoreMutationVariables
	>(UnfollowStoreDocument);
}
export const StoresFollowedDocument = gql`
	query StoresFollowed($userId: ID!) {
		user(id: $userId) {
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
	query CurrentUser($userId: ID!) {
		user(id: $userId) {
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
