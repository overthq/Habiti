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
	cart: Cart;
	product: Product;
};

export type CreateCartInput = {
	userId: Scalars['ID'];
	storeId: Scalars['ID'];
};

export type CreateOrderInput = {
	userId: Scalars['ID'];
	storeId: Scalars['ID'];
};

export type CreateProductInput = {
	name: Scalars['String'];
	description: Scalars['String'];
	unitPrice: Scalars['Int'];
};

export type CreateStoreInput = {
	name: Scalars['String'];
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
	userId: Scalars['ID'];
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
	input: CreateOrderInput;
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

export type ManagedStoresQueryVariables = Exact<{
	userId: Scalars['ID'];
}>;

export type ManagedStoresQuery = { __typename?: 'Query' } & {
	user: { __typename?: 'User' } & {
		managed: Array<
			{ __typename?: 'StoreManager' } & {
				store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'>;
			}
		>;
	};
};

export type OrdersQueryVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type OrdersQuery = { __typename?: 'Query' } & {
	store: { __typename?: 'Store' } & {
		orders: Array<
			{ __typename?: 'Order' } & Pick<Order, 'id'> & {
					user: { __typename?: 'User' } & Pick<User, 'id' | 'name'>;
					products: Array<
						{ __typename?: 'OrderProduct' } & Pick<
							OrderProduct,
							'productId' | 'unitPrice' | 'quantity'
						>
					>;
				}
		>;
	};
};

export type OrderQueryVariables = Exact<{
	id: Scalars['ID'];
}>;

export type OrderQuery = { __typename?: 'Query' } & {
	order: { __typename?: 'Order' } & Pick<Order, 'id'> & {
			user: { __typename?: 'User' } & Pick<User, 'id' | 'name'>;
			products: Array<
				{ __typename?: 'OrderProduct' } & Pick<
					OrderProduct,
					'productId' | 'unitPrice' | 'quantity'
				>
			>;
		};
};

export type ProductsQueryVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type ProductsQuery = { __typename?: 'Query' } & {
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
	id: Scalars['ID'];
}>;

export type ProductQuery = { __typename?: 'Query' } & {
	product: { __typename?: 'Product' } & Pick<
		Product,
		'id' | 'name' | 'description' | 'unitPrice'
	>;
};

export type CreateProductMutationVariables = Exact<{
	input: CreateProductInput;
}>;

export type CreateProductMutation = { __typename?: 'Mutation' } & {
	createProduct: { __typename?: 'Product' } & Pick<
		Product,
		'id' | 'name' | 'description' | 'unitPrice'
	>;
};

export type EditProductMutationVariables = Exact<{
	id: Scalars['ID'];
	input: EditProductInput;
}>;

export type EditProductMutation = { __typename?: 'Mutation' } & {
	editProduct: { __typename?: 'Product' } & Pick<
		Product,
		'id' | 'name' | 'description' | 'unitPrice'
	>;
};

export type CreateStoreMutationVariables = Exact<{
	input: CreateStoreInput;
}>;

export type CreateStoreMutation = { __typename?: 'Mutation' } & {
	createStore: { __typename?: 'Store' } & Pick<Store, 'id'>;
};

export type StoreQueryVariables = Exact<{
	storeId: Scalars['ID'];
}>;

export type StoreQuery = { __typename?: 'Query' } & {
	store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'>;
};

export const ManagedStoresDocument = gql`
	query ManagedStores($userId: ID!) {
		user(id: $userId) {
			managed {
				store {
					id
					name
				}
			}
		}
	}
`;

export function useManagedStoresQuery(
	options: Omit<Urql.UseQueryArgs<ManagedStoresQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ManagedStoresQuery>({
		query: ManagedStoresDocument,
		...options
	});
}
export const OrdersDocument = gql`
	query Orders($storeId: ID!) {
		store(id: $storeId) {
			orders {
				id
				user {
					id
					name
				}
				products {
					productId
					unitPrice
					quantity
				}
			}
		}
	}
`;

export function useOrdersQuery(
	options: Omit<Urql.UseQueryArgs<OrdersQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<OrdersQuery>({ query: OrdersDocument, ...options });
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
				productId
				unitPrice
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
export const ProductsDocument = gql`
	query Products($storeId: ID!) {
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

export function useProductsQuery(
	options: Omit<Urql.UseQueryArgs<ProductsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ProductsQuery>({ query: ProductsDocument, ...options });
}
export const ProductDocument = gql`
	query Product($id: ID!) {
		product(id: $id) {
			id
			name
			description
			unitPrice
		}
	}
`;

export function useProductQuery(
	options: Omit<Urql.UseQueryArgs<ProductQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ProductQuery>({ query: ProductDocument, ...options });
}
export const CreateProductDocument = gql`
	mutation CreateProduct($input: CreateProductInput!) {
		createProduct(input: $input) {
			id
			name
			description
			unitPrice
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
		}
	}
`;

export function useEditProductMutation() {
	return Urql.useMutation<EditProductMutation, EditProductMutationVariables>(
		EditProductDocument
	);
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
export const StoreDocument = gql`
	query Store($storeId: ID!) {
		store(id: $storeId) {
			id
			name
		}
	}
`;

export function useStoreQuery(
	options: Omit<Urql.UseQueryArgs<StoreQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoreQuery>({ query: StoreDocument, ...options });
}
