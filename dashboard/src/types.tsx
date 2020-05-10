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

export type QueryStoreOrdersArgs = {
	storeId: Scalars['ID'];
};

export type QueryStoreManagersArgs = {
	storeId: Scalars['ID'];
};

export type User = {
	__typename?: 'User';
	_id: Scalars['ID'];
	name: Scalars['String'];
	phone: Scalars['String'];
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

export type Store = {
	__typename?: 'Store';
	_id: Scalars['ID'];
	shortName: Scalars['String'];
	name: Scalars['String'];
	websiteUrl?: Maybe<Scalars['String']>;
	instagramUsername?: Maybe<Scalars['String']>;
	twitterUsername?: Maybe<Scalars['String']>;
};

export enum ItemUnit {
	Kilogram = 'Kilogram',
	Litre = 'Litre'
}

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

export type CartItem = {
	__typename?: 'CartItem';
	_id: Scalars['ID'];
	itemId: Scalars['ID'];
	item: Item;
	quantity: Scalars['Int'];
};

export type Manager = {
	__typename?: 'Manager';
	_id: Scalars['ID'];
	name: Scalars['String'];
	email: Scalars['String'];
	role: ManagerRole;
	storeId: Scalars['ID'];
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
	deleteItem: Scalars['String'];
	placeOrder?: Maybe<Order>;
	createStore: Store;
	updateStore: Store;
	createManager: Scalars['String'];
	updateManager: Manager;
	authenticateManager: Scalars['String'];
	verifyManagerAuthentication: Scalars['String'];
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
	input?: Maybe<ItemInput>;
};

export type MutationUpdateItemArgs = {
	itemId: Scalars['ID'];
	input?: Maybe<ItemInput>;
};

export type MutationDeleteItemArgs = {
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

export type ItemInput = {
	name: Scalars['String'];
	pricePerUnit: Scalars['Int'];
	unit?: Maybe<ItemUnit>;
	featured?: Maybe<Scalars['Boolean']>;
};

export type PlaceOrderInput = {
	userId: Scalars['ID'];
	storeId: Scalars['ID'];
	cart: Array<CartItemInput>;
};

export type CartItemInput = {
	itemId: Scalars['ID'];
	quantity: Scalars['Int'];
};

export type StoreInput = {
	name?: Maybe<Scalars['String']>;
	shortName?: Maybe<Scalars['String']>;
	websiteUrl?: Maybe<Scalars['String']>;
	instagramUsername?: Maybe<Scalars['String']>;
	twitterUsername?: Maybe<Scalars['String']>;
};

export type ManagerInput = {
	name?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['String']>;
	role?: Maybe<ManagerRole>;
};

export type AdditionalEntityFields = {
	path?: Maybe<Scalars['String']>;
	type?: Maybe<Scalars['String']>;
};

export type CreateItemMutationVariables = {
	input: ItemInput;
};

export type CreateItemMutation = { __typename?: 'Mutation' } & {
	createItem: { __typename?: 'Item' } & Pick<
		Item,
		'_id' | 'name' | 'pricePerUnit' | 'featured' | 'unit'
	>;
};

export type StoreItemsQueryVariables = {};

export type StoreItemsQuery = { __typename?: 'Query' } & {
	storeItems: Array<
		{ __typename?: 'Item' } & Pick<
			Item,
			'_id' | 'name' | 'pricePerUnit' | 'featured' | 'unit'
		>
	>;
};

export type ItemsQueryVariables = {};

export type ItemsQuery = { __typename?: 'Query' } & {
	items: Array<
		{ __typename?: 'Item' } & Pick<
			Item,
			'_id' | 'name' | 'pricePerUnit' | 'featured' | 'unit'
		>
	>;
};

export type CreateManagerMutationVariables = {
	storeId: Scalars['ID'];
	input?: Maybe<ManagerInput>;
};

export type CreateManagerMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'createManager'
>;

export type StoreManagersQueryVariables = {
	storeId: Scalars['ID'];
};

export type StoreManagersQuery = { __typename?: 'Query' } & {
	storeManagers: Array<
		{ __typename?: 'Manager' } & Pick<
			Manager,
			'_id' | 'name' | 'email' | 'role' | 'storeId'
		>
	>;
};

export type VerifyManagerAuthenticationMutationVariables = {
	email: Scalars['String'];
	code: Scalars['String'];
};

export type VerifyManagerAuthenticationMutation = {
	__typename?: 'Mutation';
} & Pick<Mutation, 'verifyManagerAuthentication'>;

export type CreateStoreMutationVariables = {
	input?: Maybe<StoreInput>;
};

export type CreateStoreMutation = { __typename?: 'Mutation' } & {
	createStore: { __typename?: 'Store' } & Pick<
		Store,
		'_id' | 'name' | 'shortName'
	>;
};

export const CreateItemDocument = gql`
	mutation CreateItem($input: ItemInput!) {
		createItem(input: $input) {
			_id
			name
			pricePerUnit
			featured
			unit
		}
	}
`;

export function useCreateItemMutation() {
	return Urql.useMutation<CreateItemMutation, CreateItemMutationVariables>(
		CreateItemDocument
	);
}
export const StoreItemsDocument = gql`
	query StoreItems {
		storeItems {
			_id
			name
			pricePerUnit
			featured
			unit
		}
	}
`;

export function useStoreItemsQuery(
	options: Omit<Urql.UseQueryArgs<StoreItemsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoreItemsQuery>({
		query: StoreItemsDocument,
		...options
	});
}
export const ItemsDocument = gql`
	query Items {
		items {
			_id
			name
			pricePerUnit
			featured
			unit
		}
	}
`;

export function useItemsQuery(
	options: Omit<Urql.UseQueryArgs<ItemsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ItemsQuery>({ query: ItemsDocument, ...options });
}
export const CreateManagerDocument = gql`
	mutation CreateManager($storeId: ID!, $input: ManagerInput) {
		createManager(storeId: $storeId, input: $input)
	}
`;

export function useCreateManagerMutation() {
	return Urql.useMutation<
		CreateManagerMutation,
		CreateManagerMutationVariables
	>(CreateManagerDocument);
}
export const StoreManagersDocument = gql`
	query StoreManagers($storeId: ID!) {
		storeManagers(storeId: $storeId) {
			_id
			name
			email
			role
			storeId
		}
	}
`;

export function useStoreManagersQuery(
	options: Omit<Urql.UseQueryArgs<StoreManagersQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoreManagersQuery>({
		query: StoreManagersDocument,
		...options
	});
}
export const VerifyManagerAuthenticationDocument = gql`
	mutation VerifyManagerAuthentication($email: String!, $code: String!) {
		verifyManagerAuthentication(email: $email, code: $code)
	}
`;

export function useVerifyManagerAuthenticationMutation() {
	return Urql.useMutation<
		VerifyManagerAuthenticationMutation,
		VerifyManagerAuthenticationMutationVariables
	>(VerifyManagerAuthenticationDocument);
}
export const CreateStoreDocument = gql`
	mutation CreateStore($input: StoreInput) {
		createStore(input: $input) {
			_id
			name
			shortName
		}
	}
`;

export function useCreateStoreMutation() {
	return Urql.useMutation<CreateStoreMutation, CreateStoreMutationVariables>(
		CreateStoreDocument
	);
}
