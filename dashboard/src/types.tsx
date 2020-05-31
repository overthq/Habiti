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
	users: Array<User>;
	user: User;
	currentUser: User;
	orders: Array<Order>;
	userOrders: Array<Order>;
	storeOrders: Array<Order>;
	order: Order;
	items: Array<Item>;
	item: Item;
	stores: Array<Store>;
	store: Store;
	managers: Array<Manager>;
	manager: Manager;
	currentManager: Manager;
	storeProfile: StoreProfile;
	storeFollowers: Array<StoreFollower>;
	storesFollowed: Array<StoreFollower>;
};

export type QueryUsersArgs = {
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Array<UserOrderBy>>;
	where?: Maybe<UserWhere>;
};

export type QueryUserArgs = {
	id: Scalars['ID'];
};

export type QueryOrdersArgs = {
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Array<OrderOrderBy>>;
	where?: Maybe<OrderWhere>;
};

export type QueryUserOrdersArgs = {
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Array<OrderOrderBy>>;
	where?: Maybe<OrderWhere>;
};

export type QueryStoreOrdersArgs = {
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Array<OrderOrderBy>>;
	where?: Maybe<OrderWhere>;
};

export type QueryOrderArgs = {
	id: Scalars['ID'];
};

export type QueryItemsArgs = {
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Array<ItemOrderBy>>;
	where?: Maybe<ItemWhere>;
};

export type QueryItemArgs = {
	id: Scalars['ID'];
};

export type QueryStoresArgs = {
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Array<StoreOrderBy>>;
	where?: Maybe<StoreWhere>;
};

export type QueryStoreArgs = {
	id: Scalars['ID'];
};

export type QueryManagersArgs = {
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Array<ManagerOrderBy>>;
	where?: Maybe<ManagerWhere>;
};

export type QueryManagerArgs = {
	id: Scalars['ID'];
};

export type QueryStoreProfileArgs = {
	where?: Maybe<StoreProfileWhere>;
};

export type QueryStoreFollowersArgs = {
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Array<StoreFollowerOrderBy>>;
	where?: Maybe<StoreFollowerWhere>;
};

export type Mutation = {
	__typename?: 'Mutation';
	authenticate: Scalars['String'];
	register: Scalars['String'];
	verifyAuthentication: Scalars['String'];
	createUser: User;
	updateUser: User;
	createStore: Store;
	updateStore: Store;
	createStoreProfile: StoreProfile;
	updateStoreProfile: StoreProfile;
	authenticateManager: Scalars['String'];
	verifyManagerAuthentication: Scalars['String'];
	createManager: Manager;
	updateManager: Manager;
	createItem: Item;
	updateItem: Item;
	createOrders: Array<Order>;
	createOrder: Order;
	updateOrder: Order;
	createOrderItems: Array<OrderItem>;
	createOrderItem: OrderItem;
	updateOrderItem: OrderItem;
	createStoreFollower?: Maybe<StoreFollower>;
	followStore: StoreFollower;
	unfollowStore: Scalars['Boolean'];
};

export type MutationAuthenticateArgs = {
	phone: Scalars['String'];
};

export type MutationRegisterArgs = {
	name: Scalars['String'];
	phone: Scalars['String'];
};

export type MutationVerifyAuthenticationArgs = {
	phone: Scalars['String'];
	code: Scalars['String'];
};

export type MutationCreateUserArgs = {
	input: CreateUserInput;
};

export type MutationUpdateUserArgs = {
	id: Scalars['ID'];
	input: UpdateUserInput;
};

export type MutationCreateStoreArgs = {
	input: CreateStoreInput;
};

export type MutationUpdateStoreArgs = {
	id: Scalars['ID'];
	input: UpdateStoreInput;
};

export type MutationCreateStoreProfileArgs = {
	input: CreateStoreProfileInput;
};

export type MutationUpdateStoreProfileArgs = {
	where?: Maybe<StoreProfileWhere>;
	input: UpdateStoreProfileInput;
};

export type MutationAuthenticateManagerArgs = {
	store_id: Scalars['ID'];
	email: Scalars['String'];
};

export type MutationVerifyManagerAuthenticationArgs = {
	email: Scalars['String'];
	code: Scalars['String'];
};

export type MutationCreateManagerArgs = {
	input: CreateManagerInput;
};

export type MutationUpdateManagerArgs = {
	id: Scalars['ID'];
	input: UpdateManagerInput;
};

export type MutationCreateItemArgs = {
	input: CreateItemInput;
};

export type MutationUpdateItemArgs = {
	id: Scalars['ID'];
	input: UpdateItemInput;
};

export type MutationCreateOrdersArgs = {
	input: Array<CreateOrderInput>;
};

export type MutationCreateOrderArgs = {
	input: CreateOrderInput;
};

export type MutationUpdateOrderArgs = {
	id: Scalars['ID'];
	input: UpdateOrderInput;
};

export type MutationCreateOrderItemsArgs = {
	input: Array<CreateOrderItemInput>;
};

export type MutationCreateOrderItemArgs = {
	input: CreateOrderItemInput;
};

export type MutationUpdateOrderItemArgs = {
	id: Scalars['ID'];
	input: UpdateOrderItemInput;
};

export type MutationFollowStoreArgs = {
	storeId: Scalars['ID'];
};

export type MutationUnfollowStoreArgs = {
	storeId: Scalars['ID'];
};

export type User = {
	__typename?: 'User';
	id: Scalars['ID'];
	name: Scalars['String'];
	phone: Scalars['String'];
	created_at: Scalars['String'];
	updated_at: Scalars['String'];
};

export type Store = {
	__typename?: 'Store';
	id: Scalars['ID'];
	name: Scalars['String'];
	short_name: Scalars['String'];
	created_at: Scalars['String'];
	updated_at: Scalars['String'];
	profile: StoreProfile;
};

export type Manager = {
	__typename?: 'Manager';
	id: Scalars['ID'];
	store_id: Scalars['ID'];
	name: Scalars['String'];
	email: Scalars['String'];
	created_at: Scalars['String'];
	updated_at: Scalars['String'];
	store: Store;
};

export enum OrderStatus {
	Pending = 'Pending',
	Processing = 'Processing',
	Fulfilled = 'Fulfilled'
}

export type Order = {
	__typename?: 'Order';
	id: Scalars['ID'];
	user_id: Scalars['ID'];
	store_id: Scalars['ID'];
	status: OrderStatus;
	created_at: Scalars['String'];
	updated_at: Scalars['String'];
	store: Store;
	user: User;
	cart: Array<OrderItem>;
};

export type OrderCartArgs = {
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	orderBy?: Maybe<Array<OrderItemOrderBy>>;
	where?: Maybe<OrderItemWhere>;
};

export enum ItemUnit {
	Kilogram = 'Kilogram',
	Litre = 'Litre',
	Cup = 'Cup'
}

export type Item = {
	__typename?: 'Item';
	id: Scalars['ID'];
	store_id: Scalars['ID'];
	name: Scalars['String'];
	description: Scalars['String'];
	unit: ItemUnit;
	price_per_unit: Scalars['Int'];
	featured: Scalars['Boolean'];
	created_at: Scalars['String'];
	updated_at: Scalars['String'];
	store: Store;
};

export type StoreProfile = {
	__typename?: 'StoreProfile';
	id: Scalars['ID'];
	store_id: Scalars['ID'];
	bio?: Maybe<Scalars['String']>;
	website_url?: Maybe<Scalars['String']>;
	instagram_username?: Maybe<Scalars['String']>;
	twitter_username?: Maybe<Scalars['String']>;
	created_at: Scalars['String'];
	updated_at: Scalars['String'];
	store: Store;
	followers: Array<StoreFollower>;
};

export type OrderItem = {
	__typename?: 'OrderItem';
	id: Scalars['ID'];
	order_id: Scalars['ID'];
	item_id: Scalars['ID'];
	quantity: Scalars['Int'];
	order: Order;
	item: Item;
};

export type StoreFollower = {
	__typename?: 'StoreFollower';
	id: Scalars['ID'];
	store_id: Scalars['ID'];
	user_id: Scalars['ID'];
	store: Store;
	user: User;
};

export type SqlmancerCustomScalars = {
	string?: Maybe<Array<Scalars['String']>>;
	number?: Maybe<Array<Scalars['String']>>;
	boolean?: Maybe<Array<Scalars['String']>>;
	JSON?: Maybe<Array<Scalars['String']>>;
	Date?: Maybe<Array<Scalars['String']>>;
};

export type SqlmancerJoinOn = {
	from: Scalars['String'];
	to: Scalars['String'];
};

export enum SqlmancerDialect {
	Postgres = 'POSTGRES',
	Mysql = 'MYSQL',
	Mariadb = 'MARIADB',
	Sqlite = 'SQLITE'
}

export enum SqlmancerFieldNameTransformation {
	CamelCase = 'CAMEL_CASE',
	PascalCase = 'PASCAL_CASE',
	SnakeCase = 'SNAKE_CASE'
}

export enum SqlmancerAggregateFunction {
	Avg = 'avg',
	Count = 'count',
	Max = 'max',
	Min = 'min',
	Sum = 'sum'
}

export enum SqlmancerPaginationKind {
	Offset = 'OFFSET'
}

export enum SqlmancerInputAction {
	Create = 'CREATE',
	Update = 'UPDATE'
}

export enum SortDirection {
	Asc = 'ASC',
	Desc = 'DESC'
}

export type UserOrderBy = {
	id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	phone?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
};

export type IdOperators = {
	equal?: Maybe<Scalars['ID']>;
	notEqual?: Maybe<Scalars['ID']>;
	in?: Maybe<Array<Scalars['ID']>>;
	notIn?: Maybe<Array<Scalars['ID']>>;
	greaterThan?: Maybe<Scalars['ID']>;
	greaterThanOrEqual?: Maybe<Scalars['ID']>;
	lessThan?: Maybe<Scalars['ID']>;
	lessThanOrEqual?: Maybe<Scalars['ID']>;
};

export type StringOperators = {
	equal?: Maybe<Scalars['String']>;
	notEqual?: Maybe<Scalars['String']>;
	greaterThan?: Maybe<Scalars['String']>;
	greaterThanOrEqual?: Maybe<Scalars['String']>;
	lessThan?: Maybe<Scalars['String']>;
	lessThanOrEqual?: Maybe<Scalars['String']>;
	in?: Maybe<Array<Scalars['String']>>;
	notIn?: Maybe<Array<Scalars['String']>>;
	like?: Maybe<Scalars['String']>;
	notLike?: Maybe<Scalars['String']>;
	iLike?: Maybe<Scalars['String']>;
	notILike?: Maybe<Scalars['String']>;
};

export type UserWhere = {
	id?: Maybe<IdOperators>;
	name?: Maybe<StringOperators>;
	phone?: Maybe<StringOperators>;
	created_at?: Maybe<StringOperators>;
	updated_at?: Maybe<StringOperators>;
	and?: Maybe<Array<UserWhere>>;
	or?: Maybe<Array<UserWhere>>;
	not?: Maybe<UserWhere>;
};

export type OrderOrderBy = {
	id?: Maybe<SortDirection>;
	user_id?: Maybe<SortDirection>;
	store_id?: Maybe<SortDirection>;
	status?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
	store?: Maybe<StoreOrderByNested>;
	user?: Maybe<UserOrderByNested>;
	cart?: Maybe<OrderItemOrderByAggregateFieldsOnly>;
};

export type StoreOrderByNested = {
	id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	short_name?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
};

export type UserOrderByNested = {
	id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	phone?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
};

export type OrderItemWhereVg = {
	quantity?: Maybe<IntOperators>;
};

export type OrderItemWhereUm = {
	quantity?: Maybe<IntOperators>;
};

export type OrderItemWhereIn = {
	quantity?: Maybe<IntOperators>;
};

export type OrderItemWhereAx = {
	quantity?: Maybe<IntOperators>;
};

export type OrderItemOrderByAggregateFieldsOnly = {
	avg?: Maybe<OrderItemWhereVg>;
	sum?: Maybe<OrderItemWhereUm>;
	min?: Maybe<OrderItemWhereIn>;
	max?: Maybe<OrderItemWhereAx>;
	count?: Maybe<SortDirection>;
};

export type OrderStatusOperators = {
	equal?: Maybe<OrderStatus>;
	notEqual?: Maybe<OrderStatus>;
	in?: Maybe<Array<OrderStatus>>;
	notIn?: Maybe<Array<OrderStatus>>;
};

export type OrderWhere = {
	id?: Maybe<IdOperators>;
	user_id?: Maybe<IdOperators>;
	store_id?: Maybe<IdOperators>;
	status?: Maybe<OrderStatusOperators>;
	created_at?: Maybe<StringOperators>;
	updated_at?: Maybe<StringOperators>;
	and?: Maybe<Array<OrderWhere>>;
	or?: Maybe<Array<OrderWhere>>;
	not?: Maybe<OrderWhere>;
	store?: Maybe<StoreWhere>;
	user?: Maybe<UserWhere>;
	cart?: Maybe<OrderItemWhereWithAggregateFields>;
};

export type StoreWhere = {
	id?: Maybe<IdOperators>;
	name?: Maybe<StringOperators>;
	short_name?: Maybe<StringOperators>;
	created_at?: Maybe<StringOperators>;
	updated_at?: Maybe<StringOperators>;
	and?: Maybe<Array<StoreWhere>>;
	or?: Maybe<Array<StoreWhere>>;
	not?: Maybe<StoreWhere>;
	profile?: Maybe<StoreProfileWhere>;
};

export type StoreProfileWhere = {
	id?: Maybe<IdOperators>;
	store_id?: Maybe<IdOperators>;
	bio?: Maybe<StringOperators>;
	website_url?: Maybe<StringOperators>;
	instagram_username?: Maybe<StringOperators>;
	twitter_username?: Maybe<StringOperators>;
	created_at?: Maybe<StringOperators>;
	updated_at?: Maybe<StringOperators>;
	and?: Maybe<Array<StoreProfileWhere>>;
	or?: Maybe<Array<StoreProfileWhere>>;
	not?: Maybe<StoreProfileWhere>;
	store?: Maybe<StoreWhere>;
	followers?: Maybe<StoreFollowerWhereWithAggregateFields>;
};

export type StoreFollowerWhereWithAggregateFields = {
	id?: Maybe<IdOperators>;
	store_id?: Maybe<IdOperators>;
	user_id?: Maybe<IdOperators>;
	and?: Maybe<Array<StoreFollowerWhere>>;
	or?: Maybe<Array<StoreFollowerWhere>>;
	not?: Maybe<StoreFollowerWhere>;
	store?: Maybe<StoreWhere>;
	user?: Maybe<UserWhere>;
	count?: Maybe<IntOperators>;
};

export type StoreFollowerWhere = {
	id?: Maybe<IdOperators>;
	store_id?: Maybe<IdOperators>;
	user_id?: Maybe<IdOperators>;
	and?: Maybe<Array<StoreFollowerWhere>>;
	or?: Maybe<Array<StoreFollowerWhere>>;
	not?: Maybe<StoreFollowerWhere>;
	store?: Maybe<StoreWhere>;
	user?: Maybe<UserWhere>;
};

export type IntOperators = {
	equal?: Maybe<Scalars['Int']>;
	notEqual?: Maybe<Scalars['Int']>;
	in?: Maybe<Array<Scalars['Int']>>;
	notIn?: Maybe<Array<Scalars['Int']>>;
	greaterThan?: Maybe<Scalars['Int']>;
	greaterThanOrEqual?: Maybe<Scalars['Int']>;
	lessThan?: Maybe<Scalars['Int']>;
	lessThanOrEqual?: Maybe<Scalars['Int']>;
};

export type OrderItemWhereWithAggregateFields = {
	id?: Maybe<IdOperators>;
	order_id?: Maybe<IdOperators>;
	item_id?: Maybe<IdOperators>;
	quantity?: Maybe<IntOperators>;
	and?: Maybe<Array<OrderItemWhere>>;
	or?: Maybe<Array<OrderItemWhere>>;
	not?: Maybe<OrderItemWhere>;
	order?: Maybe<OrderWhere>;
	item?: Maybe<ItemWhere>;
	avg?: Maybe<OrderItemWhereVg>;
	sum?: Maybe<OrderItemWhereUm>;
	min?: Maybe<OrderItemWhereIn>;
	max?: Maybe<OrderItemWhereAx>;
	count?: Maybe<IntOperators>;
};

export type OrderItemWhere = {
	id?: Maybe<IdOperators>;
	order_id?: Maybe<IdOperators>;
	item_id?: Maybe<IdOperators>;
	quantity?: Maybe<IntOperators>;
	and?: Maybe<Array<OrderItemWhere>>;
	or?: Maybe<Array<OrderItemWhere>>;
	not?: Maybe<OrderItemWhere>;
	order?: Maybe<OrderWhere>;
	item?: Maybe<ItemWhere>;
};

export type ItemUnitOperators = {
	equal?: Maybe<ItemUnit>;
	notEqual?: Maybe<ItemUnit>;
	in?: Maybe<Array<ItemUnit>>;
	notIn?: Maybe<Array<ItemUnit>>;
};

export type BooleanOperators = {
	equal?: Maybe<Scalars['Boolean']>;
	notEqual?: Maybe<Scalars['Boolean']>;
	in?: Maybe<Array<Scalars['Boolean']>>;
	notIn?: Maybe<Array<Scalars['Boolean']>>;
};

export type ItemWhere = {
	id?: Maybe<IdOperators>;
	store_id?: Maybe<IdOperators>;
	name?: Maybe<StringOperators>;
	description?: Maybe<StringOperators>;
	unit?: Maybe<ItemUnitOperators>;
	price_per_unit?: Maybe<IntOperators>;
	featured?: Maybe<BooleanOperators>;
	created_at?: Maybe<StringOperators>;
	updated_at?: Maybe<StringOperators>;
	and?: Maybe<Array<ItemWhere>>;
	or?: Maybe<Array<ItemWhere>>;
	not?: Maybe<ItemWhere>;
	store?: Maybe<StoreWhere>;
};

export type ItemOrderBy = {
	id?: Maybe<SortDirection>;
	store_id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	description?: Maybe<SortDirection>;
	unit?: Maybe<SortDirection>;
	price_per_unit?: Maybe<SortDirection>;
	featured?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
	store?: Maybe<StoreOrderByNested>;
};

export type StoreOrderBy = {
	id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	short_name?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
	profile?: Maybe<StoreProfileOrderByNested>;
};

export type StoreProfileOrderByNested = {
	id?: Maybe<SortDirection>;
	store_id?: Maybe<SortDirection>;
	bio?: Maybe<SortDirection>;
	website_url?: Maybe<SortDirection>;
	instagram_username?: Maybe<SortDirection>;
	twitter_username?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
};

export type ManagerOrderBy = {
	id?: Maybe<SortDirection>;
	store_id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	email?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
	store?: Maybe<StoreOrderByNested>;
};

export type ManagerWhere = {
	id?: Maybe<IdOperators>;
	store_id?: Maybe<IdOperators>;
	name?: Maybe<StringOperators>;
	email?: Maybe<StringOperators>;
	created_at?: Maybe<StringOperators>;
	updated_at?: Maybe<StringOperators>;
	and?: Maybe<Array<ManagerWhere>>;
	or?: Maybe<Array<ManagerWhere>>;
	not?: Maybe<ManagerWhere>;
	store?: Maybe<StoreWhere>;
};

export type StoreFollowerOrderBy = {
	id?: Maybe<SortDirection>;
	store_id?: Maybe<SortDirection>;
	user_id?: Maybe<SortDirection>;
	store?: Maybe<StoreOrderByNested>;
	user?: Maybe<UserOrderByNested>;
};

export type CreateUserInput = {
	id?: Maybe<Scalars['ID']>;
	name: Scalars['String'];
	phone: Scalars['String'];
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type CreateStoreInput = {
	id?: Maybe<Scalars['ID']>;
	name: Scalars['String'];
	short_name: Scalars['String'];
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type UpdateStoreInput = {
	name?: Maybe<Scalars['String']>;
	short_name?: Maybe<Scalars['String']>;
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type CreateStoreProfileInput = {
	id?: Maybe<Scalars['ID']>;
	store_id: Scalars['ID'];
	bio?: Maybe<Scalars['String']>;
	website_url?: Maybe<Scalars['String']>;
	instagram_username?: Maybe<Scalars['String']>;
	twitter_username?: Maybe<Scalars['String']>;
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type UpdateStoreProfileInput = {
	store_id?: Maybe<Scalars['ID']>;
	bio?: Maybe<Scalars['String']>;
	website_url?: Maybe<Scalars['String']>;
	instagram_username?: Maybe<Scalars['String']>;
	twitter_username?: Maybe<Scalars['String']>;
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type CreateManagerInput = {
	id?: Maybe<Scalars['ID']>;
	store_id: Scalars['ID'];
	name: Scalars['String'];
	email: Scalars['String'];
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type UpdateManagerInput = {
	store_id?: Maybe<Scalars['ID']>;
	name?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['String']>;
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type CreateItemInput = {
	id?: Maybe<Scalars['ID']>;
	store_id: Scalars['ID'];
	name: Scalars['String'];
	description: Scalars['String'];
	unit: ItemUnit;
	price_per_unit: Scalars['Int'];
	featured: Scalars['Boolean'];
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type UpdateItemInput = {
	store_id?: Maybe<Scalars['ID']>;
	name?: Maybe<Scalars['String']>;
	description?: Maybe<Scalars['String']>;
	unit?: Maybe<ItemUnit>;
	price_per_unit?: Maybe<Scalars['Int']>;
	featured?: Maybe<Scalars['Boolean']>;
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type CreateOrderInput = {
	id?: Maybe<Scalars['ID']>;
	user_id: Scalars['ID'];
	store_id: Scalars['ID'];
	status?: Maybe<OrderStatus>;
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type UpdateOrderInput = {
	user_id?: Maybe<Scalars['ID']>;
	store_id?: Maybe<Scalars['ID']>;
	status?: Maybe<OrderStatus>;
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type CreateOrderItemInput = {
	id?: Maybe<Scalars['ID']>;
	order_id: Scalars['ID'];
	item_id: Scalars['ID'];
	quantity: Scalars['Int'];
};

export type UpdateOrderItemInput = {
	order_id?: Maybe<Scalars['ID']>;
	item_id?: Maybe<Scalars['ID']>;
	quantity?: Maybe<Scalars['Int']>;
};

export type OrderItemOrderBy = {
	id?: Maybe<SortDirection>;
	order_id?: Maybe<SortDirection>;
	item_id?: Maybe<SortDirection>;
	quantity?: Maybe<SortDirection>;
	order?: Maybe<OrderOrderByNested>;
	item?: Maybe<ItemOrderByNested>;
};

export type OrderOrderByNested = {
	id?: Maybe<SortDirection>;
	user_id?: Maybe<SortDirection>;
	store_id?: Maybe<SortDirection>;
	status?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
};

export type ItemOrderByNested = {
	id?: Maybe<SortDirection>;
	store_id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	description?: Maybe<SortDirection>;
	unit?: Maybe<SortDirection>;
	price_per_unit?: Maybe<SortDirection>;
	featured?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
};

export type CreateItemMutationVariables = {
	input: CreateItemInput;
};

export type CreateItemMutation = { __typename?: 'Mutation' } & {
	createItem: { __typename?: 'Item' } & Pick<
		Item,
		'id' | 'name' | 'description' | 'price_per_unit' | 'featured' | 'unit'
	>;
};

export type StoreItemsQueryVariables = {
	storeId: Scalars['ID'];
};

export type StoreItemsQuery = { __typename?: 'Query' } & {
	storeItems: Array<
		{ __typename?: 'Item' } & Pick<
			Item,
			'id' | 'name' | 'description' | 'price_per_unit' | 'featured' | 'unit'
		>
	>;
};

export type CreateManagerMutationVariables = {
	input: CreateManagerInput;
};

export type CreateManagerMutation = { __typename?: 'Mutation' } & {
	createManager: { __typename?: 'Manager' } & Pick<
		Manager,
		'id' | 'name' | 'email' | 'store_id'
	>;
};

export type StoreManagersQueryVariables = {
	storeId: Scalars['ID'];
};

export type StoreManagersQuery = { __typename?: 'Query' } & {
	storeManagers: Array<
		{ __typename?: 'Manager' } & Pick<
			Manager,
			'id' | 'name' | 'email' | 'store_id'
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

export type AuthenticateManagerMutationVariables = {
	storeId: Scalars['ID'];
	email: Scalars['String'];
};

export type AuthenticateManagerMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'authenticateManager'
>;

export type CurrentManagerQueryVariables = {};

export type CurrentManagerQuery = { __typename?: 'Query' } & {
	currentManager: { __typename?: 'Manager' } & Pick<
		Manager,
		'id' | 'name' | 'email' | 'store_id'
	>;
};

export type CreateStoreMutationVariables = {
	input: CreateStoreInput;
};

export type CreateStoreMutation = { __typename?: 'Mutation' } & {
	createStore: { __typename?: 'Store' } & Pick<
		Store,
		'id' | 'name' | 'short_name'
	>;
};

export const CreateItemDocument = gql`
	mutation CreateItem($input: CreateItemInput!) {
		createItem(input: $input) {
			id
			name
			description
			price_per_unit
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
	query StoreItems($storeId: ID!) {
		storeItems: items(where: { store_id: { equal: $storeId } }) {
			id
			name
			description
			price_per_unit
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
export const CreateManagerDocument = gql`
	mutation CreateManager($input: CreateManagerInput!) {
		createManager(input: $input) {
			id
			name
			email
			store_id
		}
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
		storeManagers: managers(where: { store_id: { equal: $storeId } }) {
			id
			name
			email
			store_id
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
export const AuthenticateManagerDocument = gql`
	mutation AuthenticateManager($storeId: ID!, $email: String!) {
		authenticateManager(store_id: $storeId, email: $email)
	}
`;

export function useAuthenticateManagerMutation() {
	return Urql.useMutation<
		AuthenticateManagerMutation,
		AuthenticateManagerMutationVariables
	>(AuthenticateManagerDocument);
}
export const CurrentManagerDocument = gql`
	query CurrentManager {
		currentManager {
			id
			name
			email
			store_id
		}
	}
`;

export function useCurrentManagerQuery(
	options: Omit<Urql.UseQueryArgs<CurrentManagerQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<CurrentManagerQuery>({
		query: CurrentManagerDocument,
		...options
	});
}
export const CreateStoreDocument = gql`
	mutation CreateStore($input: CreateStoreInput!) {
		createStore(input: $input) {
			id
			name
			short_name
		}
	}
`;

export function useCreateStoreMutation() {
	return Urql.useMutation<CreateStoreMutation, CreateStoreMutationVariables>(
		CreateStoreDocument
	);
}
