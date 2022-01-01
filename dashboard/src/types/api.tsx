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
	addProductToCart: Cart;
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
	removeProductFromCart: Scalars['ID'];
	unfollowStore: Store;
	updateCartProduct: CartProduct;
};

export type MutationAddProductToCartArgs = {
	input: AddProductToCartInput;
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

export type MutationRemoveProductFromCartArgs = {
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

export type ManagedStoresQueryVariables = Exact<{
	userId: Scalars['ID'];
}>;

export type ManagedStoresQuery = {
	__typename?: 'Query';
	user: {
		__typename?: 'User';
		managed: Array<{
			__typename?: 'StoreManager';
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
			createdAt: string;
			updatedAt: string;
			user: { __typename?: 'User'; id: string; name: string };
			products: Array<{
				__typename?: 'OrderProduct';
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
		createdAt: string;
		updatedAt: string;
		user: { __typename?: 'User'; id: string; name: string };
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

export type CreateStoreMutationVariables = Exact<{
	input: CreateStoreInput;
}>;

export type CreateStoreMutation = {
	__typename?: 'Mutation';
	createStore: { __typename?: 'Store'; id: string };
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
		image?:
			| { __typename?: 'Image'; id: string; path: string }
			| null
			| undefined;
	};
};

export const ManagedStoresDocument = gql`
	query ManagedStores($userId: ID!) {
		user(id: $userId) {
			managed {
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
			id
			orders {
				id
				user {
					id
					name
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
				createdAt
				updatedAt
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
			createdAt
			updatedAt
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
			quantity
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
export const CreateProductDocument = gql`
	mutation CreateProduct($input: CreateProductInput!) {
		createProduct(input: $input) {
			id
			name
			description
			unitPrice
			quantity
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
			image {
				id
				path
			}
		}
	}
`;

export function useStoreQuery(
	options: Omit<Urql.UseQueryArgs<StoreQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoreQuery>({ query: StoreDocument, ...options });
}
