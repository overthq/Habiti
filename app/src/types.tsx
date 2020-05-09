import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
};

export type AdditionalEntityFields = {
	path?: Maybe<Scalars['String']>;
	type?: Maybe<Scalars['String']>;
};

export type CartItem = {
	__typename?: 'CartItem';
	_id: Scalars['ID'];
	itemId: Scalars['ID'];
	item: Item;
	quantity: Scalars['Int'];
};

export type CartItemInput = {
	itemId: Scalars['ID'];
	quantity: Scalars['Int'];
};

export type Item = {
	__typename?: 'Item';
	_id: Scalars['ID'];
	name: Scalars['String'];
	storeId: Scalars['ID'];
	store: Store;
	unit?: Maybe<ItemUnit>;
	pricePerUnit: Scalars['Int'];
	featured: Scalars['Boolean'];
};

export type ItemInput = {
	name: Scalars['String'];
	pricePerUnit: Scalars['Int'];
	unit?: Maybe<ItemUnit>;
	featured?: Maybe<Scalars['Boolean']>;
};

export enum ItemUnit {
	Kilogram = 'Kilogram',
	Litre = 'Litre'
}

export type Manager = {
	__typename?: 'Manager';
	_id: Scalars['ID'];
	name: Scalars['String'];
	email: Scalars['String'];
	role: ManagerRole;
	storeId: Scalars['ID'];
};

export type ManagerInput = {
	name?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['String']>;
	role?: Maybe<ManagerRole>;
};

export enum ManagerRole {
	Admin = 'Admin',
	Editor = 'Editor'
}

export type Mutation = {
	__typename?: 'Mutation';
	default?: Maybe<Scalars['String']>;
	register: Scalars['String'];
	authenticate: Scalars['String'];
	verifyAuthentication: Scalars['String'];
	createItem: Item;
	updateItem: Item;
	deleteItem?: Maybe<Scalars['String']>;
	placeOrder?: Maybe<Order>;
	createStore: Store;
	updateStore: Store;
	createManager: Manager;
	updateManager: Manager;
	authenticateManager: Scalars['String'];
	verifyManagerAuthentication: Manager;
};

export type MutationRegisterArgs = {
	name: Scalars['String'];
	phone: Scalars['String'];
};

export type MutationAuthenticateArgs = {
	phone: Scalars['String'];
};

export type MutationVerifyAuthenticationArgs = {
	phone: Scalars['String'];
	code: Scalars['String'];
};

export type MutationCreateItemArgs = {
	storeId: Scalars['ID'];
	input?: Maybe<ItemInput>;
};

export type MutationUpdateItemArgs = {
	storeId: Scalars['ID'];
	itemId: Scalars['ID'];
	input?: Maybe<ItemInput>;
};

export type MutationDeleteItemArgs = {
	storeId: Scalars['ID'];
	itemId: Scalars['ID'];
};

export type MutationPlaceOrderArgs = {
	input?: Maybe<PlaceOrderInput>;
};

export type MutationCreateStoreArgs = {
	input?: Maybe<StoreInput>;
};

export type MutationUpdateStoreArgs = {
	input?: Maybe<StoreInput>;
};

export type MutationCreateManagerArgs = {
	storeId: Scalars['ID'];
	input?: Maybe<ManagerInput>;
};

export type MutationUpdateManagerArgs = {
	managerId: Scalars['ID'];
	input?: Maybe<ManagerInput>;
};

export type MutationAuthenticateManagerArgs = {
	storeId: Scalars['ID'];
	email: Scalars['String'];
};

export type MutationVerifyManagerAuthenticationArgs = {
	email: Scalars['String'];
	code: Scalars['String'];
};

export type Order = {
	__typename?: 'Order';
	_id: Scalars['ID'];
	userId: Scalars['ID'];
	user: User;
	storeId: Scalars['ID'];
	store: Store;
	status: OrderStatus;
	cart: Array<CartItem>;
};

export enum OrderStatus {
	Pending = 'Pending',
	Processing = 'Processing',
	Delivered = 'Delivered'
}

export type PlaceOrderInput = {
	userId: Scalars['ID'];
	storeId: Scalars['ID'];
	cart: Array<CartItemInput>;
};

export type Query = {
	__typename?: 'Query';
	default?: Maybe<Scalars['String']>;
	currentUser: User;
	users: Array<User>;
	storeItems: Array<Item>;
	items: Array<Item>;
	userOrders: Array<Order>;
	storeOrders: Array<Order>;
	stores: Array<Store>;
	storeManagers: Array<Manager>;
};

export type QueryStoreItemsArgs = {
	storeId: Scalars['ID'];
};

export type QueryStoreOrdersArgs = {
	storeId: Scalars['ID'];
};

export type QueryStoreManagersArgs = {
	storeId: Scalars['ID'];
};

export type Store = {
	__typename?: 'Store';
	_id: Scalars['ID'];
	name: Scalars['String'];
	websiteUrl?: Maybe<Scalars['String']>;
	instagramUsername?: Maybe<Scalars['String']>;
	twitterUsername?: Maybe<Scalars['String']>;
};

export type StoreInput = {
	name?: Maybe<Scalars['String']>;
	websiteUrl?: Maybe<Scalars['String']>;
	instagramUsername?: Maybe<Scalars['String']>;
	twitterUsername?: Maybe<Scalars['String']>;
};

export type User = {
	__typename?: 'User';
	_id: Scalars['ID'];
	name: Scalars['String'];
	phone: Scalars['String'];
};

export type ItemsQueryVariables = {};

export type ItemsQuery = { __typename?: 'Query' } & {
	items: Array<
		{ __typename?: 'Item' } & Pick<
			Item,
			'_id' | 'name' | 'storeId' | 'featured' | 'pricePerUnit' | 'unit'
		>
	>;
};

export type UserOrdersQueryVariables = {};

export type UserOrdersQuery = { __typename?: 'Query' } & {
	userOrders: Array<
		{ __typename?: 'Order' } & Pick<Order, '_id' | 'status'> & {
				store: { __typename?: 'Store' } & Pick<Store, 'name'>;
				cart: Array<
					{ __typename?: 'CartItem' } & Pick<CartItem, 'quantity'> & {
							item: { __typename?: 'Item' } & Pick<
								Item,
								'name' | 'pricePerUnit'
							>;
						}
				>;
			}
	>;
};

export type RegisterMutationVariables = {
	name: Scalars['String'];
	phone: Scalars['String'];
};

export type RegisterMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'register'
>;

export type AuthenticateMutationVariables = {
	phone: Scalars['String'];
};

export type AuthenticateMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'authenticate'
>;

export type VerifyAuthenticationMutationVariables = {
	phone: Scalars['String'];
	code: Scalars['String'];
};

export type VerifyAuthenticationMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'verifyAuthentication'
>;

export type CurrentUserQueryVariables = {};

export type CurrentUserQuery = { __typename?: 'Query' } & {
	currentUser: { __typename?: 'User' } & Pick<User, '_id' | 'name' | 'phone'>;
};

export const ItemsDocument = gql`
	query Items {
		items {
			_id
			name
			storeId
			featured
			pricePerUnit
			unit
		}
	}
`;

export function useItemsQuery(
	options: Omit<Urql.UseQueryArgs<ItemsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ItemsQuery>({ query: ItemsDocument, ...options });
}
export const UserOrdersDocument = gql`
	query UserOrders {
		userOrders {
			_id
			status
			store {
				name
			}
			cart {
				item {
					name
					pricePerUnit
				}
				quantity
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
export const RegisterDocument = gql`
	mutation Register($name: String!, $phone: String!) {
		register(name: $name, phone: $phone)
	}
`;

export function useRegisterMutation() {
	return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
		RegisterDocument
	);
}
export const AuthenticateDocument = gql`
	mutation Authenticate($phone: String!) {
		authenticate(phone: $phone)
	}
`;

export function useAuthenticateMutation() {
	return Urql.useMutation<AuthenticateMutation, AuthenticateMutationVariables>(
		AuthenticateDocument
	);
}
export const VerifyAuthenticationDocument = gql`
	mutation VerifyAuthentication($phone: String!, $code: String!) {
		verifyAuthentication(phone: $phone, code: $code)
	}
`;

export function useVerifyAuthenticationMutation() {
	return Urql.useMutation<
		VerifyAuthenticationMutation,
		VerifyAuthenticationMutationVariables
	>(VerifyAuthenticationDocument);
}
export const CurrentUserDocument = gql`
	query CurrentUser {
		currentUser {
			_id
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
