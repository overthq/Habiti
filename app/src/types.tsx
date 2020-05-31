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

export type BooleanOperators = {
	equal?: Maybe<Scalars['Boolean']>;
	notEqual?: Maybe<Scalars['Boolean']>;
	in?: Maybe<Array<Scalars['Boolean']>>;
	notIn?: Maybe<Array<Scalars['Boolean']>>;
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

export type CreateManagerInput = {
	id?: Maybe<Scalars['ID']>;
	store_id: Scalars['ID'];
	name: Scalars['String'];
	email: Scalars['String'];
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

export type CreateOrderItemInput = {
	id?: Maybe<Scalars['ID']>;
	order_id: Scalars['ID'];
	item_id: Scalars['ID'];
	quantity: Scalars['Int'];
};

export type CreateStoreInput = {
	id?: Maybe<Scalars['ID']>;
	name: Scalars['String'];
	short_name: Scalars['String'];
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

export type CreateUserInput = {
	id?: Maybe<Scalars['ID']>;
	name: Scalars['String'];
	phone: Scalars['String'];
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
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

export enum ItemUnit {
	Kilogram = 'Kilogram',
	Litre = 'Litre',
	Cup = 'Cup'
}

export type ItemUnitOperators = {
	equal?: Maybe<ItemUnit>;
	notEqual?: Maybe<ItemUnit>;
	in?: Maybe<Array<ItemUnit>>;
	notIn?: Maybe<Array<ItemUnit>>;
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

export type OrderItem = {
	__typename?: 'OrderItem';
	id: Scalars['ID'];
	order_id: Scalars['ID'];
	item_id: Scalars['ID'];
	quantity: Scalars['Int'];
	order: Order;
	item: Item;
};

export type OrderItemOrderBy = {
	id?: Maybe<SortDirection>;
	order_id?: Maybe<SortDirection>;
	item_id?: Maybe<SortDirection>;
	quantity?: Maybe<SortDirection>;
	order?: Maybe<OrderOrderByNested>;
	item?: Maybe<ItemOrderByNested>;
};

export type OrderItemOrderByAggregateFieldsOnly = {
	avg?: Maybe<OrderItemWhereVg>;
	sum?: Maybe<OrderItemWhereUm>;
	min?: Maybe<OrderItemWhereIn>;
	max?: Maybe<OrderItemWhereAx>;
	count?: Maybe<SortDirection>;
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

export type OrderItemWhereAx = {
	quantity?: Maybe<IntOperators>;
};

export type OrderItemWhereIn = {
	quantity?: Maybe<IntOperators>;
};

export type OrderItemWhereUm = {
	quantity?: Maybe<IntOperators>;
};

export type OrderItemWhereVg = {
	quantity?: Maybe<IntOperators>;
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

export type OrderOrderByNested = {
	id?: Maybe<SortDirection>;
	user_id?: Maybe<SortDirection>;
	store_id?: Maybe<SortDirection>;
	status?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
};

export enum OrderStatus {
	Pending = 'Pending',
	Processing = 'Processing',
	Fulfilled = 'Fulfilled'
}

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
	followingStore: Scalars['Boolean'];
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

export type QueryFollowingStoreArgs = {
	storeId: Scalars['ID'];
};

export enum SortDirection {
	Asc = 'ASC',
	Desc = 'DESC'
}

export enum SqlmancerAggregateFunction {
	Avg = 'avg',
	Count = 'count',
	Max = 'max',
	Min = 'min',
	Sum = 'sum'
}

export type SqlmancerCustomScalars = {
	string?: Maybe<Array<Scalars['String']>>;
	number?: Maybe<Array<Scalars['String']>>;
	boolean?: Maybe<Array<Scalars['String']>>;
	JSON?: Maybe<Array<Scalars['String']>>;
	Date?: Maybe<Array<Scalars['String']>>;
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

export enum SqlmancerInputAction {
	Create = 'CREATE',
	Update = 'UPDATE'
}

export type SqlmancerJoinOn = {
	from: Scalars['String'];
	to: Scalars['String'];
};

export enum SqlmancerPaginationKind {
	Offset = 'OFFSET'
}

export type Store = {
	__typename?: 'Store';
	id: Scalars['ID'];
	name: Scalars['String'];
	short_name: Scalars['String'];
	created_at: Scalars['String'];
	updated_at: Scalars['String'];
	profile: StoreProfile;
};

export type StoreFollower = {
	__typename?: 'StoreFollower';
	id: Scalars['ID'];
	store_id: Scalars['ID'];
	user_id: Scalars['ID'];
	store: Store;
	user: User;
};

export type StoreFollowerOrderBy = {
	id?: Maybe<SortDirection>;
	store_id?: Maybe<SortDirection>;
	user_id?: Maybe<SortDirection>;
	store?: Maybe<StoreOrderByNested>;
	user?: Maybe<UserOrderByNested>;
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

export type StoreOrderBy = {
	id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	short_name?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
	profile?: Maybe<StoreProfileOrderByNested>;
};

export type StoreOrderByNested = {
	id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	short_name?: Maybe<SortDirection>;
	created_at?: Maybe<SortDirection>;
	updated_at?: Maybe<SortDirection>;
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

export type UpdateManagerInput = {
	store_id?: Maybe<Scalars['ID']>;
	name?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['String']>;
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

export type UpdateOrderItemInput = {
	order_id?: Maybe<Scalars['ID']>;
	item_id?: Maybe<Scalars['ID']>;
	quantity?: Maybe<Scalars['Int']>;
};

export type UpdateStoreInput = {
	name?: Maybe<Scalars['String']>;
	short_name?: Maybe<Scalars['String']>;
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

export type UpdateUserInput = {
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	created_at?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['String']>;
};

export type User = {
	__typename?: 'User';
	id: Scalars['ID'];
	name: Scalars['String'];
	phone: Scalars['String'];
	created_at: Scalars['String'];
	updated_at: Scalars['String'];
};

export type UserOrderBy = {
	id?: Maybe<SortDirection>;
	name?: Maybe<SortDirection>;
	phone?: Maybe<SortDirection>;
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

export type ItemsQueryVariables = {};

export type ItemsQuery = { __typename?: 'Query' } & {
	items: Array<
		{ __typename?: 'Item' } & Pick<
			Item,
			'id' | 'name' | 'store_id' | 'featured' | 'price_per_unit' | 'unit'
		>
	>;
};

export type StoreItemsQueryVariables = {
	storeId: Scalars['ID'];
};

export type StoreItemsQuery = { __typename?: 'Query' } & {
	storeItems: Array<
		{ __typename?: 'Item' } & Pick<
			Item,
			'id' | 'name' | 'store_id' | 'featured' | 'price_per_unit' | 'unit'
		>
	>;
};

export type ItemQueryVariables = {
	itemId: Scalars['ID'];
};

export type ItemQuery = { __typename?: 'Query' } & {
	item: { __typename?: 'Item' } & Pick<
		Item,
		'id' | 'name' | 'store_id' | 'description' | 'price_per_unit' | 'unit'
	> & { store: { __typename?: 'Store' } & Pick<Store, 'id' | 'name'> };
};

export type UserOrdersQueryVariables = {};

export type UserOrdersQuery = { __typename?: 'Query' } & {
	userOrders: Array<
		{ __typename?: 'Order' } & Pick<Order, 'id' | 'status'> & {
				store: { __typename?: 'Store' } & Pick<Store, 'name'>;
				cart: Array<
					{ __typename?: 'OrderItem' } & Pick<OrderItem, 'quantity'> & {
							item: { __typename?: 'Item' } & Pick<
								Item,
								'name' | 'price_per_unit'
							>;
						}
				>;
			}
	>;
};

export type PlaceOrderMutationVariables = {
	input: CreateOrderInput;
};

export type PlaceOrderMutation = { __typename?: 'Mutation' } & {
	createOrder: { __typename?: 'Order' } & Pick<Order, 'id' | 'status'> & {
			store: { __typename?: 'Store' } & Pick<Store, 'name'>;
			cart: Array<
				{ __typename?: 'OrderItem' } & Pick<OrderItem, 'quantity'> & {
						item: { __typename?: 'Item' } & Pick<
							Item,
							'name' | 'price_per_unit'
						>;
					}
			>;
		};
};

export type SearchQueryVariables = {
	searchTerm: Scalars['String'];
};

export type SearchQuery = { __typename?: 'Query' } & {
	stores: Array<{ __typename?: 'Store' } & Pick<Store, 'name' | 'short_name'>>;
	items: Array<{ __typename?: 'Item' } & Pick<Item, 'name'>>;
};

export type StoresQueryVariables = {};

export type StoresQuery = { __typename?: 'Query' } & {
	stores: Array<
		{ __typename?: 'Store' } & Pick<Store, 'id' | 'name' | 'short_name'> & {
				profile: { __typename?: 'StoreProfile' } & Pick<
					StoreProfile,
					'website_url' | 'instagram_username' | 'twitter_username'
				>;
			}
	>;
};

export type StoreQueryVariables = {
	storeId: Scalars['ID'];
};

export type StoreQuery = { __typename?: 'Query' } & {
	store: { __typename?: 'Store' } & Pick<
		Store,
		'id' | 'name' | 'short_name'
	> & {
			profile: { __typename?: 'StoreProfile' } & Pick<
				StoreProfile,
				'website_url' | 'instagram_username' | 'twitter_username'
			> & {
					followers: Array<
						{ __typename?: 'StoreFollower' } & Pick<
							StoreFollower,
							'store_id' | 'user_id'
						>
					>;
				};
		};
};

export type FollowStoreMutationVariables = {
	storeId: Scalars['ID'];
};

export type FollowStoreMutation = { __typename?: 'Mutation' } & {
	followStore: { __typename?: 'StoreFollower' } & Pick<
		StoreFollower,
		'user_id' | 'store_id'
	>;
};

export type UnfollowStoreMutationVariables = {
	storeId: Scalars['ID'];
};

export type UnfollowStoreMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'unfollowStore'
>;

export type FollowingStoreQueryVariables = {
	storeId: Scalars['ID'];
};

export type FollowingStoreQuery = { __typename?: 'Query' } & Pick<
	Query,
	'followingStore'
>;

export type StoresFollowedQueryVariables = {};

export type StoresFollowedQuery = { __typename?: 'Query' } & {
	storesFollowed: Array<
		{ __typename?: 'StoreFollower' } & Pick<StoreFollower, 'store_id'> & {
				store: { __typename?: 'Store' } & Pick<Store, 'name' | 'short_name'>;
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
	currentUser: { __typename?: 'User' } & Pick<User, 'id' | 'name' | 'phone'>;
};

export const ItemsDocument = gql`
	query Items {
		items {
			id
			name
			store_id
			featured
			price_per_unit
			unit
		}
	}
`;

export function useItemsQuery(
	options: Omit<Urql.UseQueryArgs<ItemsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ItemsQuery>({ query: ItemsDocument, ...options });
}
export const StoreItemsDocument = gql`
	query StoreItems($storeId: ID!) {
		storeItems: items(where: { store_id: { equal: $storeId } }) {
			id
			name
			store_id
			featured
			price_per_unit
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
export const ItemDocument = gql`
	query Item($itemId: ID!) {
		item(id: $itemId) {
			id
			name
			store_id
			store {
				id
				name
			}
			description
			price_per_unit
			unit
		}
	}
`;

export function useItemQuery(
	options: Omit<Urql.UseQueryArgs<ItemQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ItemQuery>({ query: ItemDocument, ...options });
}
export const UserOrdersDocument = gql`
	query UserOrders {
		userOrders {
			id
			status
			store {
				name
			}
			cart {
				item {
					name
					price_per_unit
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
export const PlaceOrderDocument = gql`
	mutation PlaceOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			id
			status
			store {
				name
			}
			cart {
				item {
					name
					price_per_unit
				}
				quantity
			}
		}
	}
`;

export function usePlaceOrderMutation() {
	return Urql.useMutation<PlaceOrderMutation, PlaceOrderMutationVariables>(
		PlaceOrderDocument
	);
}
export const SearchDocument = gql`
	query Search($searchTerm: String!) {
		stores(where: { name: { iLike: $searchTerm } }, orderBy: [{ name: ASC }]) {
			name
			short_name
		}
		items(where: { name: { iLike: $searchTerm } }, orderBy: [{ name: ASC }]) {
			name
		}
	}
`;

export function useSearchQuery(
	options: Omit<Urql.UseQueryArgs<SearchQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<SearchQuery>({ query: SearchDocument, ...options });
}
export const StoresDocument = gql`
	query Stores {
		stores {
			id
			name
			short_name
			profile {
				website_url
				instagram_username
				twitter_username
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
			short_name
			profile {
				website_url
				instagram_username
				twitter_username
				followers {
					store_id
					user_id
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
			user_id
			store_id
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
export const FollowingStoreDocument = gql`
	query FollowingStore($storeId: ID!) {
		followingStore(storeId: $storeId)
	}
`;

export function useFollowingStoreQuery(
	options: Omit<Urql.UseQueryArgs<FollowingStoreQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<FollowingStoreQuery>({
		query: FollowingStoreDocument,
		...options
	});
}
export const StoresFollowedDocument = gql`
	query StoresFollowed {
		storesFollowed {
			store_id
			store {
				name
				short_name
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
