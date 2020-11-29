import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	timestamptz: any;
	uuid: any;
};

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
	_eq?: Maybe<Scalars['Boolean']>;
	_gt?: Maybe<Scalars['Boolean']>;
	_gte?: Maybe<Scalars['Boolean']>;
	_in?: Maybe<Array<Scalars['Boolean']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_lt?: Maybe<Scalars['Boolean']>;
	_lte?: Maybe<Scalars['Boolean']>;
	_neq?: Maybe<Scalars['Boolean']>;
	_nin?: Maybe<Array<Scalars['Boolean']>>;
};

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
	_eq?: Maybe<Scalars['Int']>;
	_gt?: Maybe<Scalars['Int']>;
	_gte?: Maybe<Scalars['Int']>;
	_in?: Maybe<Array<Scalars['Int']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_lt?: Maybe<Scalars['Int']>;
	_lte?: Maybe<Scalars['Int']>;
	_neq?: Maybe<Scalars['Int']>;
	_nin?: Maybe<Array<Scalars['Int']>>;
};

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
	_eq?: Maybe<Scalars['String']>;
	_gt?: Maybe<Scalars['String']>;
	_gte?: Maybe<Scalars['String']>;
	_ilike?: Maybe<Scalars['String']>;
	_in?: Maybe<Array<Scalars['String']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_like?: Maybe<Scalars['String']>;
	_lt?: Maybe<Scalars['String']>;
	_lte?: Maybe<Scalars['String']>;
	_neq?: Maybe<Scalars['String']>;
	_nilike?: Maybe<Scalars['String']>;
	_nin?: Maybe<Array<Scalars['String']>>;
	_nlike?: Maybe<Scalars['String']>;
	_nsimilar?: Maybe<Scalars['String']>;
	_similar?: Maybe<Scalars['String']>;
};

/** columns and relationships of "items" */
export type Items = {
	__typename?: 'items';
	created_at: Scalars['timestamptz'];
	description: Scalars['String'];
	featured: Scalars['Boolean'];
	id: Scalars['uuid'];
	name: Scalars['String'];
	/** An array relationship */
	order_items: Array<Order_Items>;
	/** An aggregated array relationship */
	order_items_aggregate: Order_Items_Aggregate;
	price_per_unit: Scalars['Int'];
	/** An object relationship */
	store: Stores;
	store_id: Scalars['uuid'];
	updated_at: Scalars['timestamptz'];
};

/** columns and relationships of "items" */
export type ItemsOrder_ItemsArgs = {
	distinct_on?: Maybe<Array<Order_Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Order_Items_Order_By>>;
	where?: Maybe<Order_Items_Bool_Exp>;
};

/** columns and relationships of "items" */
export type ItemsOrder_Items_AggregateArgs = {
	distinct_on?: Maybe<Array<Order_Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Order_Items_Order_By>>;
	where?: Maybe<Order_Items_Bool_Exp>;
};

/** aggregated selection of "items" */
export type Items_Aggregate = {
	__typename?: 'items_aggregate';
	aggregate?: Maybe<Items_Aggregate_Fields>;
	nodes: Array<Items>;
};

/** aggregate fields of "items" */
export type Items_Aggregate_Fields = {
	__typename?: 'items_aggregate_fields';
	avg?: Maybe<Items_Avg_Fields>;
	count?: Maybe<Scalars['Int']>;
	max?: Maybe<Items_Max_Fields>;
	min?: Maybe<Items_Min_Fields>;
	stddev?: Maybe<Items_Stddev_Fields>;
	stddev_pop?: Maybe<Items_Stddev_Pop_Fields>;
	stddev_samp?: Maybe<Items_Stddev_Samp_Fields>;
	sum?: Maybe<Items_Sum_Fields>;
	var_pop?: Maybe<Items_Var_Pop_Fields>;
	var_samp?: Maybe<Items_Var_Samp_Fields>;
	variance?: Maybe<Items_Variance_Fields>;
};

/** aggregate fields of "items" */
export type Items_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Items_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "items" */
export type Items_Aggregate_Order_By = {
	avg?: Maybe<Items_Avg_Order_By>;
	count?: Maybe<Order_By>;
	max?: Maybe<Items_Max_Order_By>;
	min?: Maybe<Items_Min_Order_By>;
	stddev?: Maybe<Items_Stddev_Order_By>;
	stddev_pop?: Maybe<Items_Stddev_Pop_Order_By>;
	stddev_samp?: Maybe<Items_Stddev_Samp_Order_By>;
	sum?: Maybe<Items_Sum_Order_By>;
	var_pop?: Maybe<Items_Var_Pop_Order_By>;
	var_samp?: Maybe<Items_Var_Samp_Order_By>;
	variance?: Maybe<Items_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "items" */
export type Items_Arr_Rel_Insert_Input = {
	data: Array<Items_Insert_Input>;
	on_conflict?: Maybe<Items_On_Conflict>;
};

/** aggregate avg on columns */
export type Items_Avg_Fields = {
	__typename?: 'items_avg_fields';
	price_per_unit?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "items" */
export type Items_Avg_Order_By = {
	price_per_unit?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "items". All fields are combined with a logical 'AND'. */
export type Items_Bool_Exp = {
	_and?: Maybe<Array<Maybe<Items_Bool_Exp>>>;
	_not?: Maybe<Items_Bool_Exp>;
	_or?: Maybe<Array<Maybe<Items_Bool_Exp>>>;
	created_at?: Maybe<Timestamptz_Comparison_Exp>;
	description?: Maybe<String_Comparison_Exp>;
	featured?: Maybe<Boolean_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	name?: Maybe<String_Comparison_Exp>;
	order_items?: Maybe<Order_Items_Bool_Exp>;
	price_per_unit?: Maybe<Int_Comparison_Exp>;
	store?: Maybe<Stores_Bool_Exp>;
	store_id?: Maybe<Uuid_Comparison_Exp>;
	updated_at?: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "items" */
export enum Items_Constraint {
	/** unique or primary key constraint */
	ItemsPkey = 'items_pkey'
}

/** input type for incrementing integer column in table "items" */
export type Items_Inc_Input = {
	price_per_unit?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "items" */
export type Items_Insert_Input = {
	created_at?: Maybe<Scalars['timestamptz']>;
	description?: Maybe<Scalars['String']>;
	featured?: Maybe<Scalars['Boolean']>;
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	order_items?: Maybe<Order_Items_Arr_Rel_Insert_Input>;
	price_per_unit?: Maybe<Scalars['Int']>;
	store?: Maybe<Stores_Obj_Rel_Insert_Input>;
	store_id?: Maybe<Scalars['uuid']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Items_Max_Fields = {
	__typename?: 'items_max_fields';
	created_at?: Maybe<Scalars['timestamptz']>;
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	price_per_unit?: Maybe<Scalars['Int']>;
	store_id?: Maybe<Scalars['uuid']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "items" */
export type Items_Max_Order_By = {
	created_at?: Maybe<Order_By>;
	description?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	price_per_unit?: Maybe<Order_By>;
	store_id?: Maybe<Order_By>;
	updated_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Items_Min_Fields = {
	__typename?: 'items_min_fields';
	created_at?: Maybe<Scalars['timestamptz']>;
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	price_per_unit?: Maybe<Scalars['Int']>;
	store_id?: Maybe<Scalars['uuid']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "items" */
export type Items_Min_Order_By = {
	created_at?: Maybe<Order_By>;
	description?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	price_per_unit?: Maybe<Order_By>;
	store_id?: Maybe<Order_By>;
	updated_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "items" */
export type Items_Mutation_Response = {
	__typename?: 'items_mutation_response';
	/** number of affected rows by the mutation */
	affected_rows: Scalars['Int'];
	/** data of the affected rows by the mutation */
	returning: Array<Items>;
};

/** input type for inserting object relation for remote table "items" */
export type Items_Obj_Rel_Insert_Input = {
	data: Items_Insert_Input;
	on_conflict?: Maybe<Items_On_Conflict>;
};

/** on conflict condition type for table "items" */
export type Items_On_Conflict = {
	constraint: Items_Constraint;
	update_columns: Array<Items_Update_Column>;
	where?: Maybe<Items_Bool_Exp>;
};

/** ordering options when selecting data from "items" */
export type Items_Order_By = {
	created_at?: Maybe<Order_By>;
	description?: Maybe<Order_By>;
	featured?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	order_items_aggregate?: Maybe<Order_Items_Aggregate_Order_By>;
	price_per_unit?: Maybe<Order_By>;
	store?: Maybe<Stores_Order_By>;
	store_id?: Maybe<Order_By>;
	updated_at?: Maybe<Order_By>;
};

/** primary key columns input for table: "items" */
export type Items_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "items" */
export enum Items_Select_Column {
	/** column name */
	CreatedAt = 'created_at',
	/** column name */
	Description = 'description',
	/** column name */
	Featured = 'featured',
	/** column name */
	Id = 'id',
	/** column name */
	Name = 'name',
	/** column name */
	PricePerUnit = 'price_per_unit',
	/** column name */
	StoreId = 'store_id',
	/** column name */
	UpdatedAt = 'updated_at'
}

/** input type for updating data in table "items" */
export type Items_Set_Input = {
	created_at?: Maybe<Scalars['timestamptz']>;
	description?: Maybe<Scalars['String']>;
	featured?: Maybe<Scalars['Boolean']>;
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	price_per_unit?: Maybe<Scalars['Int']>;
	store_id?: Maybe<Scalars['uuid']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Items_Stddev_Fields = {
	__typename?: 'items_stddev_fields';
	price_per_unit?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "items" */
export type Items_Stddev_Order_By = {
	price_per_unit?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Items_Stddev_Pop_Fields = {
	__typename?: 'items_stddev_pop_fields';
	price_per_unit?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "items" */
export type Items_Stddev_Pop_Order_By = {
	price_per_unit?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Items_Stddev_Samp_Fields = {
	__typename?: 'items_stddev_samp_fields';
	price_per_unit?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "items" */
export type Items_Stddev_Samp_Order_By = {
	price_per_unit?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Items_Sum_Fields = {
	__typename?: 'items_sum_fields';
	price_per_unit?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "items" */
export type Items_Sum_Order_By = {
	price_per_unit?: Maybe<Order_By>;
};

/** update columns of table "items" */
export enum Items_Update_Column {
	/** column name */
	CreatedAt = 'created_at',
	/** column name */
	Description = 'description',
	/** column name */
	Featured = 'featured',
	/** column name */
	Id = 'id',
	/** column name */
	Name = 'name',
	/** column name */
	PricePerUnit = 'price_per_unit',
	/** column name */
	StoreId = 'store_id',
	/** column name */
	UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Items_Var_Pop_Fields = {
	__typename?: 'items_var_pop_fields';
	price_per_unit?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "items" */
export type Items_Var_Pop_Order_By = {
	price_per_unit?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Items_Var_Samp_Fields = {
	__typename?: 'items_var_samp_fields';
	price_per_unit?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "items" */
export type Items_Var_Samp_Order_By = {
	price_per_unit?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Items_Variance_Fields = {
	__typename?: 'items_variance_fields';
	price_per_unit?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "items" */
export type Items_Variance_Order_By = {
	price_per_unit?: Maybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
	__typename?: 'mutation_root';
	/** delete data from the table: "items" */
	delete_items?: Maybe<Items_Mutation_Response>;
	/** delete single row from the table: "items" */
	delete_items_by_pk?: Maybe<Items>;
	/** delete data from the table: "order_items" */
	delete_order_items?: Maybe<Order_Items_Mutation_Response>;
	/** delete single row from the table: "order_items" */
	delete_order_items_by_pk?: Maybe<Order_Items>;
	/** delete data from the table: "orders" */
	delete_orders?: Maybe<Orders_Mutation_Response>;
	/** delete single row from the table: "orders" */
	delete_orders_by_pk?: Maybe<Orders>;
	/** delete data from the table: "store_followers" */
	delete_store_followers?: Maybe<Store_Followers_Mutation_Response>;
	/** delete single row from the table: "store_followers" */
	delete_store_followers_by_pk?: Maybe<Store_Followers>;
	/** delete data from the table: "stores" */
	delete_stores?: Maybe<Stores_Mutation_Response>;
	/** delete single row from the table: "stores" */
	delete_stores_by_pk?: Maybe<Stores>;
	/** delete data from the table: "users" */
	delete_users?: Maybe<Users_Mutation_Response>;
	/** delete single row from the table: "users" */
	delete_users_by_pk?: Maybe<Users>;
	/** insert data into the table: "items" */
	insert_items?: Maybe<Items_Mutation_Response>;
	/** insert a single row into the table: "items" */
	insert_items_one?: Maybe<Items>;
	/** insert data into the table: "order_items" */
	insert_order_items?: Maybe<Order_Items_Mutation_Response>;
	/** insert a single row into the table: "order_items" */
	insert_order_items_one?: Maybe<Order_Items>;
	/** insert data into the table: "orders" */
	insert_orders?: Maybe<Orders_Mutation_Response>;
	/** insert a single row into the table: "orders" */
	insert_orders_one?: Maybe<Orders>;
	/** insert data into the table: "store_followers" */
	insert_store_followers?: Maybe<Store_Followers_Mutation_Response>;
	/** insert a single row into the table: "store_followers" */
	insert_store_followers_one?: Maybe<Store_Followers>;
	/** insert data into the table: "stores" */
	insert_stores?: Maybe<Stores_Mutation_Response>;
	/** insert a single row into the table: "stores" */
	insert_stores_one?: Maybe<Stores>;
	/** insert data into the table: "users" */
	insert_users?: Maybe<Users_Mutation_Response>;
	/** insert a single row into the table: "users" */
	insert_users_one?: Maybe<Users>;
	/** update data of the table: "items" */
	update_items?: Maybe<Items_Mutation_Response>;
	/** update single row of the table: "items" */
	update_items_by_pk?: Maybe<Items>;
	/** update data of the table: "order_items" */
	update_order_items?: Maybe<Order_Items_Mutation_Response>;
	/** update single row of the table: "order_items" */
	update_order_items_by_pk?: Maybe<Order_Items>;
	/** update data of the table: "orders" */
	update_orders?: Maybe<Orders_Mutation_Response>;
	/** update single row of the table: "orders" */
	update_orders_by_pk?: Maybe<Orders>;
	/** update data of the table: "store_followers" */
	update_store_followers?: Maybe<Store_Followers_Mutation_Response>;
	/** update single row of the table: "store_followers" */
	update_store_followers_by_pk?: Maybe<Store_Followers>;
	/** update data of the table: "stores" */
	update_stores?: Maybe<Stores_Mutation_Response>;
	/** update single row of the table: "stores" */
	update_stores_by_pk?: Maybe<Stores>;
	/** update data of the table: "users" */
	update_users?: Maybe<Users_Mutation_Response>;
	/** update single row of the table: "users" */
	update_users_by_pk?: Maybe<Users>;
};

/** mutation root */
export type Mutation_RootDelete_ItemsArgs = {
	where: Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Items_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_Order_ItemsArgs = {
	where: Order_Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Order_Items_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_OrdersArgs = {
	where: Orders_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Orders_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_Store_FollowersArgs = {
	where: Store_Followers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Store_Followers_By_PkArgs = {
	store_id: Scalars['uuid'];
	user_id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_StoresArgs = {
	where: Stores_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Stores_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
	where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootInsert_ItemsArgs = {
	objects: Array<Items_Insert_Input>;
	on_conflict?: Maybe<Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Items_OneArgs = {
	object: Items_Insert_Input;
	on_conflict?: Maybe<Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Order_ItemsArgs = {
	objects: Array<Order_Items_Insert_Input>;
	on_conflict?: Maybe<Order_Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Order_Items_OneArgs = {
	object: Order_Items_Insert_Input;
	on_conflict?: Maybe<Order_Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_OrdersArgs = {
	objects: Array<Orders_Insert_Input>;
	on_conflict?: Maybe<Orders_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Orders_OneArgs = {
	object: Orders_Insert_Input;
	on_conflict?: Maybe<Orders_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Store_FollowersArgs = {
	objects: Array<Store_Followers_Insert_Input>;
	on_conflict?: Maybe<Store_Followers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Store_Followers_OneArgs = {
	object: Store_Followers_Insert_Input;
	on_conflict?: Maybe<Store_Followers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_StoresArgs = {
	objects: Array<Stores_Insert_Input>;
	on_conflict?: Maybe<Stores_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Stores_OneArgs = {
	object: Stores_Insert_Input;
	on_conflict?: Maybe<Stores_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
	objects: Array<Users_Insert_Input>;
	on_conflict?: Maybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
	object: Users_Insert_Input;
	on_conflict?: Maybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdate_ItemsArgs = {
	_inc?: Maybe<Items_Inc_Input>;
	_set?: Maybe<Items_Set_Input>;
	where: Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Items_By_PkArgs = {
	_inc?: Maybe<Items_Inc_Input>;
	_set?: Maybe<Items_Set_Input>;
	pk_columns: Items_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Order_ItemsArgs = {
	_inc?: Maybe<Order_Items_Inc_Input>;
	_set?: Maybe<Order_Items_Set_Input>;
	where: Order_Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Order_Items_By_PkArgs = {
	_inc?: Maybe<Order_Items_Inc_Input>;
	_set?: Maybe<Order_Items_Set_Input>;
	pk_columns: Order_Items_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_OrdersArgs = {
	_set?: Maybe<Orders_Set_Input>;
	where: Orders_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Orders_By_PkArgs = {
	_set?: Maybe<Orders_Set_Input>;
	pk_columns: Orders_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Store_FollowersArgs = {
	_set?: Maybe<Store_Followers_Set_Input>;
	where: Store_Followers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Store_Followers_By_PkArgs = {
	_set?: Maybe<Store_Followers_Set_Input>;
	pk_columns: Store_Followers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_StoresArgs = {
	_set?: Maybe<Stores_Set_Input>;
	where: Stores_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Stores_By_PkArgs = {
	_set?: Maybe<Stores_Set_Input>;
	pk_columns: Stores_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
	_set?: Maybe<Users_Set_Input>;
	where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
	_set?: Maybe<Users_Set_Input>;
	pk_columns: Users_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
	/** in the ascending order, nulls last */
	Asc = 'asc',
	/** in the ascending order, nulls first */
	AscNullsFirst = 'asc_nulls_first',
	/** in the ascending order, nulls last */
	AscNullsLast = 'asc_nulls_last',
	/** in the descending order, nulls first */
	Desc = 'desc',
	/** in the descending order, nulls first */
	DescNullsFirst = 'desc_nulls_first',
	/** in the descending order, nulls last */
	DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "order_items" */
export type Order_Items = {
	__typename?: 'order_items';
	id: Scalars['uuid'];
	/** An object relationship */
	item: Items;
	item_id: Scalars['uuid'];
	/** An object relationship */
	order: Orders;
	order_id: Scalars['uuid'];
	quantity: Scalars['Int'];
};

/** aggregated selection of "order_items" */
export type Order_Items_Aggregate = {
	__typename?: 'order_items_aggregate';
	aggregate?: Maybe<Order_Items_Aggregate_Fields>;
	nodes: Array<Order_Items>;
};

/** aggregate fields of "order_items" */
export type Order_Items_Aggregate_Fields = {
	__typename?: 'order_items_aggregate_fields';
	avg?: Maybe<Order_Items_Avg_Fields>;
	count?: Maybe<Scalars['Int']>;
	max?: Maybe<Order_Items_Max_Fields>;
	min?: Maybe<Order_Items_Min_Fields>;
	stddev?: Maybe<Order_Items_Stddev_Fields>;
	stddev_pop?: Maybe<Order_Items_Stddev_Pop_Fields>;
	stddev_samp?: Maybe<Order_Items_Stddev_Samp_Fields>;
	sum?: Maybe<Order_Items_Sum_Fields>;
	var_pop?: Maybe<Order_Items_Var_Pop_Fields>;
	var_samp?: Maybe<Order_Items_Var_Samp_Fields>;
	variance?: Maybe<Order_Items_Variance_Fields>;
};

/** aggregate fields of "order_items" */
export type Order_Items_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Order_Items_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "order_items" */
export type Order_Items_Aggregate_Order_By = {
	avg?: Maybe<Order_Items_Avg_Order_By>;
	count?: Maybe<Order_By>;
	max?: Maybe<Order_Items_Max_Order_By>;
	min?: Maybe<Order_Items_Min_Order_By>;
	stddev?: Maybe<Order_Items_Stddev_Order_By>;
	stddev_pop?: Maybe<Order_Items_Stddev_Pop_Order_By>;
	stddev_samp?: Maybe<Order_Items_Stddev_Samp_Order_By>;
	sum?: Maybe<Order_Items_Sum_Order_By>;
	var_pop?: Maybe<Order_Items_Var_Pop_Order_By>;
	var_samp?: Maybe<Order_Items_Var_Samp_Order_By>;
	variance?: Maybe<Order_Items_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "order_items" */
export type Order_Items_Arr_Rel_Insert_Input = {
	data: Array<Order_Items_Insert_Input>;
	on_conflict?: Maybe<Order_Items_On_Conflict>;
};

/** aggregate avg on columns */
export type Order_Items_Avg_Fields = {
	__typename?: 'order_items_avg_fields';
	quantity?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "order_items" */
export type Order_Items_Avg_Order_By = {
	quantity?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "order_items". All fields are combined with a logical 'AND'. */
export type Order_Items_Bool_Exp = {
	_and?: Maybe<Array<Maybe<Order_Items_Bool_Exp>>>;
	_not?: Maybe<Order_Items_Bool_Exp>;
	_or?: Maybe<Array<Maybe<Order_Items_Bool_Exp>>>;
	id?: Maybe<Uuid_Comparison_Exp>;
	item?: Maybe<Items_Bool_Exp>;
	item_id?: Maybe<Uuid_Comparison_Exp>;
	order?: Maybe<Orders_Bool_Exp>;
	order_id?: Maybe<Uuid_Comparison_Exp>;
	quantity?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "order_items" */
export enum Order_Items_Constraint {
	/** unique or primary key constraint */
	OrderItemsPkey = 'order_items_pkey'
}

/** input type for incrementing integer column in table "order_items" */
export type Order_Items_Inc_Input = {
	quantity?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "order_items" */
export type Order_Items_Insert_Input = {
	id?: Maybe<Scalars['uuid']>;
	item?: Maybe<Items_Obj_Rel_Insert_Input>;
	item_id?: Maybe<Scalars['uuid']>;
	order?: Maybe<Orders_Obj_Rel_Insert_Input>;
	order_id?: Maybe<Scalars['uuid']>;
	quantity?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Order_Items_Max_Fields = {
	__typename?: 'order_items_max_fields';
	id?: Maybe<Scalars['uuid']>;
	item_id?: Maybe<Scalars['uuid']>;
	order_id?: Maybe<Scalars['uuid']>;
	quantity?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "order_items" */
export type Order_Items_Max_Order_By = {
	id?: Maybe<Order_By>;
	item_id?: Maybe<Order_By>;
	order_id?: Maybe<Order_By>;
	quantity?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Order_Items_Min_Fields = {
	__typename?: 'order_items_min_fields';
	id?: Maybe<Scalars['uuid']>;
	item_id?: Maybe<Scalars['uuid']>;
	order_id?: Maybe<Scalars['uuid']>;
	quantity?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "order_items" */
export type Order_Items_Min_Order_By = {
	id?: Maybe<Order_By>;
	item_id?: Maybe<Order_By>;
	order_id?: Maybe<Order_By>;
	quantity?: Maybe<Order_By>;
};

/** response of any mutation on the table "order_items" */
export type Order_Items_Mutation_Response = {
	__typename?: 'order_items_mutation_response';
	/** number of affected rows by the mutation */
	affected_rows: Scalars['Int'];
	/** data of the affected rows by the mutation */
	returning: Array<Order_Items>;
};

/** input type for inserting object relation for remote table "order_items" */
export type Order_Items_Obj_Rel_Insert_Input = {
	data: Order_Items_Insert_Input;
	on_conflict?: Maybe<Order_Items_On_Conflict>;
};

/** on conflict condition type for table "order_items" */
export type Order_Items_On_Conflict = {
	constraint: Order_Items_Constraint;
	update_columns: Array<Order_Items_Update_Column>;
	where?: Maybe<Order_Items_Bool_Exp>;
};

/** ordering options when selecting data from "order_items" */
export type Order_Items_Order_By = {
	id?: Maybe<Order_By>;
	item?: Maybe<Items_Order_By>;
	item_id?: Maybe<Order_By>;
	order?: Maybe<Orders_Order_By>;
	order_id?: Maybe<Order_By>;
	quantity?: Maybe<Order_By>;
};

/** primary key columns input for table: "order_items" */
export type Order_Items_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "order_items" */
export enum Order_Items_Select_Column {
	/** column name */
	Id = 'id',
	/** column name */
	ItemId = 'item_id',
	/** column name */
	OrderId = 'order_id',
	/** column name */
	Quantity = 'quantity'
}

/** input type for updating data in table "order_items" */
export type Order_Items_Set_Input = {
	id?: Maybe<Scalars['uuid']>;
	item_id?: Maybe<Scalars['uuid']>;
	order_id?: Maybe<Scalars['uuid']>;
	quantity?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Order_Items_Stddev_Fields = {
	__typename?: 'order_items_stddev_fields';
	quantity?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "order_items" */
export type Order_Items_Stddev_Order_By = {
	quantity?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Order_Items_Stddev_Pop_Fields = {
	__typename?: 'order_items_stddev_pop_fields';
	quantity?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "order_items" */
export type Order_Items_Stddev_Pop_Order_By = {
	quantity?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Order_Items_Stddev_Samp_Fields = {
	__typename?: 'order_items_stddev_samp_fields';
	quantity?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "order_items" */
export type Order_Items_Stddev_Samp_Order_By = {
	quantity?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Order_Items_Sum_Fields = {
	__typename?: 'order_items_sum_fields';
	quantity?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "order_items" */
export type Order_Items_Sum_Order_By = {
	quantity?: Maybe<Order_By>;
};

/** update columns of table "order_items" */
export enum Order_Items_Update_Column {
	/** column name */
	Id = 'id',
	/** column name */
	ItemId = 'item_id',
	/** column name */
	OrderId = 'order_id',
	/** column name */
	Quantity = 'quantity'
}

/** aggregate var_pop on columns */
export type Order_Items_Var_Pop_Fields = {
	__typename?: 'order_items_var_pop_fields';
	quantity?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "order_items" */
export type Order_Items_Var_Pop_Order_By = {
	quantity?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Order_Items_Var_Samp_Fields = {
	__typename?: 'order_items_var_samp_fields';
	quantity?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "order_items" */
export type Order_Items_Var_Samp_Order_By = {
	quantity?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Order_Items_Variance_Fields = {
	__typename?: 'order_items_variance_fields';
	quantity?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "order_items" */
export type Order_Items_Variance_Order_By = {
	quantity?: Maybe<Order_By>;
};

/** columns and relationships of "orders" */
export type Orders = {
	__typename?: 'orders';
	created_at: Scalars['timestamptz'];
	id: Scalars['uuid'];
	/** An array relationship */
	order_items: Array<Order_Items>;
	/** An aggregated array relationship */
	order_items_aggregate: Order_Items_Aggregate;
	status?: Maybe<Scalars['String']>;
	/** An object relationship */
	store: Stores;
	store_id: Scalars['uuid'];
	updated_at: Scalars['timestamptz'];
	/** An object relationship */
	user: Users;
	user_id: Scalars['uuid'];
};

/** columns and relationships of "orders" */
export type OrdersOrder_ItemsArgs = {
	distinct_on?: Maybe<Array<Order_Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Order_Items_Order_By>>;
	where?: Maybe<Order_Items_Bool_Exp>;
};

/** columns and relationships of "orders" */
export type OrdersOrder_Items_AggregateArgs = {
	distinct_on?: Maybe<Array<Order_Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Order_Items_Order_By>>;
	where?: Maybe<Order_Items_Bool_Exp>;
};

/** aggregated selection of "orders" */
export type Orders_Aggregate = {
	__typename?: 'orders_aggregate';
	aggregate?: Maybe<Orders_Aggregate_Fields>;
	nodes: Array<Orders>;
};

/** aggregate fields of "orders" */
export type Orders_Aggregate_Fields = {
	__typename?: 'orders_aggregate_fields';
	count?: Maybe<Scalars['Int']>;
	max?: Maybe<Orders_Max_Fields>;
	min?: Maybe<Orders_Min_Fields>;
};

/** aggregate fields of "orders" */
export type Orders_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Orders_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "orders" */
export type Orders_Aggregate_Order_By = {
	count?: Maybe<Order_By>;
	max?: Maybe<Orders_Max_Order_By>;
	min?: Maybe<Orders_Min_Order_By>;
};

/** input type for inserting array relation for remote table "orders" */
export type Orders_Arr_Rel_Insert_Input = {
	data: Array<Orders_Insert_Input>;
	on_conflict?: Maybe<Orders_On_Conflict>;
};

/** Boolean expression to filter rows from the table "orders". All fields are combined with a logical 'AND'. */
export type Orders_Bool_Exp = {
	_and?: Maybe<Array<Maybe<Orders_Bool_Exp>>>;
	_not?: Maybe<Orders_Bool_Exp>;
	_or?: Maybe<Array<Maybe<Orders_Bool_Exp>>>;
	created_at?: Maybe<Timestamptz_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	order_items?: Maybe<Order_Items_Bool_Exp>;
	status?: Maybe<String_Comparison_Exp>;
	store?: Maybe<Stores_Bool_Exp>;
	store_id?: Maybe<Uuid_Comparison_Exp>;
	updated_at?: Maybe<Timestamptz_Comparison_Exp>;
	user?: Maybe<Users_Bool_Exp>;
	user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "orders" */
export enum Orders_Constraint {
	/** unique or primary key constraint */
	OrdersPkey = 'orders_pkey'
}

/** input type for inserting data into table "orders" */
export type Orders_Insert_Input = {
	created_at?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	order_items?: Maybe<Order_Items_Arr_Rel_Insert_Input>;
	status?: Maybe<Scalars['String']>;
	store?: Maybe<Stores_Obj_Rel_Insert_Input>;
	store_id?: Maybe<Scalars['uuid']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
	user?: Maybe<Users_Obj_Rel_Insert_Input>;
	user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Orders_Max_Fields = {
	__typename?: 'orders_max_fields';
	created_at?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	status?: Maybe<Scalars['String']>;
	store_id?: Maybe<Scalars['uuid']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
	user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "orders" */
export type Orders_Max_Order_By = {
	created_at?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	status?: Maybe<Order_By>;
	store_id?: Maybe<Order_By>;
	updated_at?: Maybe<Order_By>;
	user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Orders_Min_Fields = {
	__typename?: 'orders_min_fields';
	created_at?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	status?: Maybe<Scalars['String']>;
	store_id?: Maybe<Scalars['uuid']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
	user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "orders" */
export type Orders_Min_Order_By = {
	created_at?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	status?: Maybe<Order_By>;
	store_id?: Maybe<Order_By>;
	updated_at?: Maybe<Order_By>;
	user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "orders" */
export type Orders_Mutation_Response = {
	__typename?: 'orders_mutation_response';
	/** number of affected rows by the mutation */
	affected_rows: Scalars['Int'];
	/** data of the affected rows by the mutation */
	returning: Array<Orders>;
};

/** input type for inserting object relation for remote table "orders" */
export type Orders_Obj_Rel_Insert_Input = {
	data: Orders_Insert_Input;
	on_conflict?: Maybe<Orders_On_Conflict>;
};

/** on conflict condition type for table "orders" */
export type Orders_On_Conflict = {
	constraint: Orders_Constraint;
	update_columns: Array<Orders_Update_Column>;
	where?: Maybe<Orders_Bool_Exp>;
};

/** ordering options when selecting data from "orders" */
export type Orders_Order_By = {
	created_at?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	order_items_aggregate?: Maybe<Order_Items_Aggregate_Order_By>;
	status?: Maybe<Order_By>;
	store?: Maybe<Stores_Order_By>;
	store_id?: Maybe<Order_By>;
	updated_at?: Maybe<Order_By>;
	user?: Maybe<Users_Order_By>;
	user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "orders" */
export type Orders_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "orders" */
export enum Orders_Select_Column {
	/** column name */
	CreatedAt = 'created_at',
	/** column name */
	Id = 'id',
	/** column name */
	Status = 'status',
	/** column name */
	StoreId = 'store_id',
	/** column name */
	UpdatedAt = 'updated_at',
	/** column name */
	UserId = 'user_id'
}

/** input type for updating data in table "orders" */
export type Orders_Set_Input = {
	created_at?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	status?: Maybe<Scalars['String']>;
	store_id?: Maybe<Scalars['uuid']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
	user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "orders" */
export enum Orders_Update_Column {
	/** column name */
	CreatedAt = 'created_at',
	/** column name */
	Id = 'id',
	/** column name */
	Status = 'status',
	/** column name */
	StoreId = 'store_id',
	/** column name */
	UpdatedAt = 'updated_at',
	/** column name */
	UserId = 'user_id'
}

/** query root */
export type Query_Root = {
	__typename?: 'query_root';
	/** fetch data from the table: "items" */
	items: Array<Items>;
	/** fetch aggregated fields from the table: "items" */
	items_aggregate: Items_Aggregate;
	/** fetch data from the table: "items" using primary key columns */
	items_by_pk?: Maybe<Items>;
	/** fetch data from the table: "order_items" */
	order_items: Array<Order_Items>;
	/** fetch aggregated fields from the table: "order_items" */
	order_items_aggregate: Order_Items_Aggregate;
	/** fetch data from the table: "order_items" using primary key columns */
	order_items_by_pk?: Maybe<Order_Items>;
	/** fetch data from the table: "orders" */
	orders: Array<Orders>;
	/** fetch aggregated fields from the table: "orders" */
	orders_aggregate: Orders_Aggregate;
	/** fetch data from the table: "orders" using primary key columns */
	orders_by_pk?: Maybe<Orders>;
	/** fetch data from the table: "store_followers" */
	store_followers: Array<Store_Followers>;
	/** fetch aggregated fields from the table: "store_followers" */
	store_followers_aggregate: Store_Followers_Aggregate;
	/** fetch data from the table: "store_followers" using primary key columns */
	store_followers_by_pk?: Maybe<Store_Followers>;
	/** fetch data from the table: "stores" */
	stores: Array<Stores>;
	/** fetch aggregated fields from the table: "stores" */
	stores_aggregate: Stores_Aggregate;
	/** fetch data from the table: "stores" using primary key columns */
	stores_by_pk?: Maybe<Stores>;
	/** fetch data from the table: "users" */
	users: Array<Users>;
	/** fetch aggregated fields from the table: "users" */
	users_aggregate: Users_Aggregate;
	/** fetch data from the table: "users" using primary key columns */
	users_by_pk?: Maybe<Users>;
};

/** query root */
export type Query_RootItemsArgs = {
	distinct_on?: Maybe<Array<Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Items_Order_By>>;
	where?: Maybe<Items_Bool_Exp>;
};

/** query root */
export type Query_RootItems_AggregateArgs = {
	distinct_on?: Maybe<Array<Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Items_Order_By>>;
	where?: Maybe<Items_Bool_Exp>;
};

/** query root */
export type Query_RootItems_By_PkArgs = {
	id: Scalars['uuid'];
};

/** query root */
export type Query_RootOrder_ItemsArgs = {
	distinct_on?: Maybe<Array<Order_Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Order_Items_Order_By>>;
	where?: Maybe<Order_Items_Bool_Exp>;
};

/** query root */
export type Query_RootOrder_Items_AggregateArgs = {
	distinct_on?: Maybe<Array<Order_Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Order_Items_Order_By>>;
	where?: Maybe<Order_Items_Bool_Exp>;
};

/** query root */
export type Query_RootOrder_Items_By_PkArgs = {
	id: Scalars['uuid'];
};

/** query root */
export type Query_RootOrdersArgs = {
	distinct_on?: Maybe<Array<Orders_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Orders_Order_By>>;
	where?: Maybe<Orders_Bool_Exp>;
};

/** query root */
export type Query_RootOrders_AggregateArgs = {
	distinct_on?: Maybe<Array<Orders_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Orders_Order_By>>;
	where?: Maybe<Orders_Bool_Exp>;
};

/** query root */
export type Query_RootOrders_By_PkArgs = {
	id: Scalars['uuid'];
};

/** query root */
export type Query_RootStore_FollowersArgs = {
	distinct_on?: Maybe<Array<Store_Followers_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Store_Followers_Order_By>>;
	where?: Maybe<Store_Followers_Bool_Exp>;
};

/** query root */
export type Query_RootStore_Followers_AggregateArgs = {
	distinct_on?: Maybe<Array<Store_Followers_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Store_Followers_Order_By>>;
	where?: Maybe<Store_Followers_Bool_Exp>;
};

/** query root */
export type Query_RootStore_Followers_By_PkArgs = {
	store_id: Scalars['uuid'];
	user_id: Scalars['uuid'];
};

/** query root */
export type Query_RootStoresArgs = {
	distinct_on?: Maybe<Array<Stores_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Stores_Order_By>>;
	where?: Maybe<Stores_Bool_Exp>;
};

/** query root */
export type Query_RootStores_AggregateArgs = {
	distinct_on?: Maybe<Array<Stores_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Stores_Order_By>>;
	where?: Maybe<Stores_Bool_Exp>;
};

/** query root */
export type Query_RootStores_By_PkArgs = {
	id: Scalars['uuid'];
};

/** query root */
export type Query_RootUsersArgs = {
	distinct_on?: Maybe<Array<Users_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Users_Order_By>>;
	where?: Maybe<Users_Bool_Exp>;
};

/** query root */
export type Query_RootUsers_AggregateArgs = {
	distinct_on?: Maybe<Array<Users_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Users_Order_By>>;
	where?: Maybe<Users_Bool_Exp>;
};

/** query root */
export type Query_RootUsers_By_PkArgs = {
	id: Scalars['uuid'];
};

/** columns and relationships of "store_followers" */
export type Store_Followers = {
	__typename?: 'store_followers';
	/** An object relationship */
	store: Stores;
	store_id: Scalars['uuid'];
	/** An object relationship */
	user: Users;
	user_id: Scalars['uuid'];
};

/** aggregated selection of "store_followers" */
export type Store_Followers_Aggregate = {
	__typename?: 'store_followers_aggregate';
	aggregate?: Maybe<Store_Followers_Aggregate_Fields>;
	nodes: Array<Store_Followers>;
};

/** aggregate fields of "store_followers" */
export type Store_Followers_Aggregate_Fields = {
	__typename?: 'store_followers_aggregate_fields';
	count?: Maybe<Scalars['Int']>;
	max?: Maybe<Store_Followers_Max_Fields>;
	min?: Maybe<Store_Followers_Min_Fields>;
};

/** aggregate fields of "store_followers" */
export type Store_Followers_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Store_Followers_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "store_followers" */
export type Store_Followers_Aggregate_Order_By = {
	count?: Maybe<Order_By>;
	max?: Maybe<Store_Followers_Max_Order_By>;
	min?: Maybe<Store_Followers_Min_Order_By>;
};

/** input type for inserting array relation for remote table "store_followers" */
export type Store_Followers_Arr_Rel_Insert_Input = {
	data: Array<Store_Followers_Insert_Input>;
	on_conflict?: Maybe<Store_Followers_On_Conflict>;
};

/** Boolean expression to filter rows from the table "store_followers". All fields are combined with a logical 'AND'. */
export type Store_Followers_Bool_Exp = {
	_and?: Maybe<Array<Maybe<Store_Followers_Bool_Exp>>>;
	_not?: Maybe<Store_Followers_Bool_Exp>;
	_or?: Maybe<Array<Maybe<Store_Followers_Bool_Exp>>>;
	store?: Maybe<Stores_Bool_Exp>;
	store_id?: Maybe<Uuid_Comparison_Exp>;
	user?: Maybe<Users_Bool_Exp>;
	user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "store_followers" */
export enum Store_Followers_Constraint {
	/** unique or primary key constraint */
	StoreFollowersPkey = 'store_followers_pkey'
}

/** input type for inserting data into table "store_followers" */
export type Store_Followers_Insert_Input = {
	store?: Maybe<Stores_Obj_Rel_Insert_Input>;
	store_id?: Maybe<Scalars['uuid']>;
	user?: Maybe<Users_Obj_Rel_Insert_Input>;
	user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Store_Followers_Max_Fields = {
	__typename?: 'store_followers_max_fields';
	store_id?: Maybe<Scalars['uuid']>;
	user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "store_followers" */
export type Store_Followers_Max_Order_By = {
	store_id?: Maybe<Order_By>;
	user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Store_Followers_Min_Fields = {
	__typename?: 'store_followers_min_fields';
	store_id?: Maybe<Scalars['uuid']>;
	user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "store_followers" */
export type Store_Followers_Min_Order_By = {
	store_id?: Maybe<Order_By>;
	user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "store_followers" */
export type Store_Followers_Mutation_Response = {
	__typename?: 'store_followers_mutation_response';
	/** number of affected rows by the mutation */
	affected_rows: Scalars['Int'];
	/** data of the affected rows by the mutation */
	returning: Array<Store_Followers>;
};

/** input type for inserting object relation for remote table "store_followers" */
export type Store_Followers_Obj_Rel_Insert_Input = {
	data: Store_Followers_Insert_Input;
	on_conflict?: Maybe<Store_Followers_On_Conflict>;
};

/** on conflict condition type for table "store_followers" */
export type Store_Followers_On_Conflict = {
	constraint: Store_Followers_Constraint;
	update_columns: Array<Store_Followers_Update_Column>;
	where?: Maybe<Store_Followers_Bool_Exp>;
};

/** ordering options when selecting data from "store_followers" */
export type Store_Followers_Order_By = {
	store?: Maybe<Stores_Order_By>;
	store_id?: Maybe<Order_By>;
	user?: Maybe<Users_Order_By>;
	user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "store_followers" */
export type Store_Followers_Pk_Columns_Input = {
	store_id: Scalars['uuid'];
	user_id: Scalars['uuid'];
};

/** select columns of table "store_followers" */
export enum Store_Followers_Select_Column {
	/** column name */
	StoreId = 'store_id',
	/** column name */
	UserId = 'user_id'
}

/** input type for updating data in table "store_followers" */
export type Store_Followers_Set_Input = {
	store_id?: Maybe<Scalars['uuid']>;
	user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "store_followers" */
export enum Store_Followers_Update_Column {
	/** column name */
	StoreId = 'store_id',
	/** column name */
	UserId = 'user_id'
}

/** columns and relationships of "stores" */
export type Stores = {
	__typename?: 'stores';
	created_at: Scalars['timestamptz'];
	id: Scalars['uuid'];
	/** An array relationship */
	items: Array<Items>;
	/** An aggregated array relationship */
	items_aggregate: Items_Aggregate;
	name: Scalars['String'];
	/** An array relationship */
	orders: Array<Orders>;
	/** An aggregated array relationship */
	orders_aggregate: Orders_Aggregate;
	short_name: Scalars['String'];
	/** An array relationship */
	store_followers: Array<Store_Followers>;
	/** An aggregated array relationship */
	store_followers_aggregate: Store_Followers_Aggregate;
	updated_at: Scalars['timestamptz'];
};

/** columns and relationships of "stores" */
export type StoresItemsArgs = {
	distinct_on?: Maybe<Array<Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Items_Order_By>>;
	where?: Maybe<Items_Bool_Exp>;
};

/** columns and relationships of "stores" */
export type StoresItems_AggregateArgs = {
	distinct_on?: Maybe<Array<Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Items_Order_By>>;
	where?: Maybe<Items_Bool_Exp>;
};

/** columns and relationships of "stores" */
export type StoresOrdersArgs = {
	distinct_on?: Maybe<Array<Orders_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Orders_Order_By>>;
	where?: Maybe<Orders_Bool_Exp>;
};

/** columns and relationships of "stores" */
export type StoresOrders_AggregateArgs = {
	distinct_on?: Maybe<Array<Orders_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Orders_Order_By>>;
	where?: Maybe<Orders_Bool_Exp>;
};

/** columns and relationships of "stores" */
export type StoresStore_FollowersArgs = {
	distinct_on?: Maybe<Array<Store_Followers_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Store_Followers_Order_By>>;
	where?: Maybe<Store_Followers_Bool_Exp>;
};

/** columns and relationships of "stores" */
export type StoresStore_Followers_AggregateArgs = {
	distinct_on?: Maybe<Array<Store_Followers_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Store_Followers_Order_By>>;
	where?: Maybe<Store_Followers_Bool_Exp>;
};

/** aggregated selection of "stores" */
export type Stores_Aggregate = {
	__typename?: 'stores_aggregate';
	aggregate?: Maybe<Stores_Aggregate_Fields>;
	nodes: Array<Stores>;
};

/** aggregate fields of "stores" */
export type Stores_Aggregate_Fields = {
	__typename?: 'stores_aggregate_fields';
	count?: Maybe<Scalars['Int']>;
	max?: Maybe<Stores_Max_Fields>;
	min?: Maybe<Stores_Min_Fields>;
};

/** aggregate fields of "stores" */
export type Stores_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Stores_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "stores" */
export type Stores_Aggregate_Order_By = {
	count?: Maybe<Order_By>;
	max?: Maybe<Stores_Max_Order_By>;
	min?: Maybe<Stores_Min_Order_By>;
};

/** input type for inserting array relation for remote table "stores" */
export type Stores_Arr_Rel_Insert_Input = {
	data: Array<Stores_Insert_Input>;
	on_conflict?: Maybe<Stores_On_Conflict>;
};

/** Boolean expression to filter rows from the table "stores". All fields are combined with a logical 'AND'. */
export type Stores_Bool_Exp = {
	_and?: Maybe<Array<Maybe<Stores_Bool_Exp>>>;
	_not?: Maybe<Stores_Bool_Exp>;
	_or?: Maybe<Array<Maybe<Stores_Bool_Exp>>>;
	created_at?: Maybe<Timestamptz_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	items?: Maybe<Items_Bool_Exp>;
	name?: Maybe<String_Comparison_Exp>;
	orders?: Maybe<Orders_Bool_Exp>;
	short_name?: Maybe<String_Comparison_Exp>;
	store_followers?: Maybe<Store_Followers_Bool_Exp>;
	updated_at?: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "stores" */
export enum Stores_Constraint {
	/** unique or primary key constraint */
	StoresPkey = 'stores_pkey',
	/** unique or primary key constraint */
	StoresShortNameKey = 'stores_short_name_key'
}

/** input type for inserting data into table "stores" */
export type Stores_Insert_Input = {
	created_at?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	items?: Maybe<Items_Arr_Rel_Insert_Input>;
	name?: Maybe<Scalars['String']>;
	orders?: Maybe<Orders_Arr_Rel_Insert_Input>;
	short_name?: Maybe<Scalars['String']>;
	store_followers?: Maybe<Store_Followers_Arr_Rel_Insert_Input>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Stores_Max_Fields = {
	__typename?: 'stores_max_fields';
	created_at?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	short_name?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "stores" */
export type Stores_Max_Order_By = {
	created_at?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	short_name?: Maybe<Order_By>;
	updated_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Stores_Min_Fields = {
	__typename?: 'stores_min_fields';
	created_at?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	short_name?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "stores" */
export type Stores_Min_Order_By = {
	created_at?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	short_name?: Maybe<Order_By>;
	updated_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "stores" */
export type Stores_Mutation_Response = {
	__typename?: 'stores_mutation_response';
	/** number of affected rows by the mutation */
	affected_rows: Scalars['Int'];
	/** data of the affected rows by the mutation */
	returning: Array<Stores>;
};

/** input type for inserting object relation for remote table "stores" */
export type Stores_Obj_Rel_Insert_Input = {
	data: Stores_Insert_Input;
	on_conflict?: Maybe<Stores_On_Conflict>;
};

/** on conflict condition type for table "stores" */
export type Stores_On_Conflict = {
	constraint: Stores_Constraint;
	update_columns: Array<Stores_Update_Column>;
	where?: Maybe<Stores_Bool_Exp>;
};

/** ordering options when selecting data from "stores" */
export type Stores_Order_By = {
	created_at?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	items_aggregate?: Maybe<Items_Aggregate_Order_By>;
	name?: Maybe<Order_By>;
	orders_aggregate?: Maybe<Orders_Aggregate_Order_By>;
	short_name?: Maybe<Order_By>;
	store_followers_aggregate?: Maybe<Store_Followers_Aggregate_Order_By>;
	updated_at?: Maybe<Order_By>;
};

/** primary key columns input for table: "stores" */
export type Stores_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "stores" */
export enum Stores_Select_Column {
	/** column name */
	CreatedAt = 'created_at',
	/** column name */
	Id = 'id',
	/** column name */
	Name = 'name',
	/** column name */
	ShortName = 'short_name',
	/** column name */
	UpdatedAt = 'updated_at'
}

/** input type for updating data in table "stores" */
export type Stores_Set_Input = {
	created_at?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	short_name?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** update columns of table "stores" */
export enum Stores_Update_Column {
	/** column name */
	CreatedAt = 'created_at',
	/** column name */
	Id = 'id',
	/** column name */
	Name = 'name',
	/** column name */
	ShortName = 'short_name',
	/** column name */
	UpdatedAt = 'updated_at'
}

/** subscription root */
export type Subscription_Root = {
	__typename?: 'subscription_root';
	/** fetch data from the table: "items" */
	items: Array<Items>;
	/** fetch aggregated fields from the table: "items" */
	items_aggregate: Items_Aggregate;
	/** fetch data from the table: "items" using primary key columns */
	items_by_pk?: Maybe<Items>;
	/** fetch data from the table: "order_items" */
	order_items: Array<Order_Items>;
	/** fetch aggregated fields from the table: "order_items" */
	order_items_aggregate: Order_Items_Aggregate;
	/** fetch data from the table: "order_items" using primary key columns */
	order_items_by_pk?: Maybe<Order_Items>;
	/** fetch data from the table: "orders" */
	orders: Array<Orders>;
	/** fetch aggregated fields from the table: "orders" */
	orders_aggregate: Orders_Aggregate;
	/** fetch data from the table: "orders" using primary key columns */
	orders_by_pk?: Maybe<Orders>;
	/** fetch data from the table: "store_followers" */
	store_followers: Array<Store_Followers>;
	/** fetch aggregated fields from the table: "store_followers" */
	store_followers_aggregate: Store_Followers_Aggregate;
	/** fetch data from the table: "store_followers" using primary key columns */
	store_followers_by_pk?: Maybe<Store_Followers>;
	/** fetch data from the table: "stores" */
	stores: Array<Stores>;
	/** fetch aggregated fields from the table: "stores" */
	stores_aggregate: Stores_Aggregate;
	/** fetch data from the table: "stores" using primary key columns */
	stores_by_pk?: Maybe<Stores>;
	/** fetch data from the table: "users" */
	users: Array<Users>;
	/** fetch aggregated fields from the table: "users" */
	users_aggregate: Users_Aggregate;
	/** fetch data from the table: "users" using primary key columns */
	users_by_pk?: Maybe<Users>;
};

/** subscription root */
export type Subscription_RootItemsArgs = {
	distinct_on?: Maybe<Array<Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Items_Order_By>>;
	where?: Maybe<Items_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootItems_AggregateArgs = {
	distinct_on?: Maybe<Array<Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Items_Order_By>>;
	where?: Maybe<Items_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootItems_By_PkArgs = {
	id: Scalars['uuid'];
};

/** subscription root */
export type Subscription_RootOrder_ItemsArgs = {
	distinct_on?: Maybe<Array<Order_Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Order_Items_Order_By>>;
	where?: Maybe<Order_Items_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootOrder_Items_AggregateArgs = {
	distinct_on?: Maybe<Array<Order_Items_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Order_Items_Order_By>>;
	where?: Maybe<Order_Items_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootOrder_Items_By_PkArgs = {
	id: Scalars['uuid'];
};

/** subscription root */
export type Subscription_RootOrdersArgs = {
	distinct_on?: Maybe<Array<Orders_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Orders_Order_By>>;
	where?: Maybe<Orders_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootOrders_AggregateArgs = {
	distinct_on?: Maybe<Array<Orders_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Orders_Order_By>>;
	where?: Maybe<Orders_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootOrders_By_PkArgs = {
	id: Scalars['uuid'];
};

/** subscription root */
export type Subscription_RootStore_FollowersArgs = {
	distinct_on?: Maybe<Array<Store_Followers_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Store_Followers_Order_By>>;
	where?: Maybe<Store_Followers_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootStore_Followers_AggregateArgs = {
	distinct_on?: Maybe<Array<Store_Followers_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Store_Followers_Order_By>>;
	where?: Maybe<Store_Followers_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootStore_Followers_By_PkArgs = {
	store_id: Scalars['uuid'];
	user_id: Scalars['uuid'];
};

/** subscription root */
export type Subscription_RootStoresArgs = {
	distinct_on?: Maybe<Array<Stores_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Stores_Order_By>>;
	where?: Maybe<Stores_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootStores_AggregateArgs = {
	distinct_on?: Maybe<Array<Stores_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Stores_Order_By>>;
	where?: Maybe<Stores_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootStores_By_PkArgs = {
	id: Scalars['uuid'];
};

/** subscription root */
export type Subscription_RootUsersArgs = {
	distinct_on?: Maybe<Array<Users_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Users_Order_By>>;
	where?: Maybe<Users_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootUsers_AggregateArgs = {
	distinct_on?: Maybe<Array<Users_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Users_Order_By>>;
	where?: Maybe<Users_Bool_Exp>;
};

/** subscription root */
export type Subscription_RootUsers_By_PkArgs = {
	id: Scalars['uuid'];
};

/** expression to compare columns of type timestamptz. All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
	_eq?: Maybe<Scalars['timestamptz']>;
	_gt?: Maybe<Scalars['timestamptz']>;
	_gte?: Maybe<Scalars['timestamptz']>;
	_in?: Maybe<Array<Scalars['timestamptz']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_lt?: Maybe<Scalars['timestamptz']>;
	_lte?: Maybe<Scalars['timestamptz']>;
	_neq?: Maybe<Scalars['timestamptz']>;
	_nin?: Maybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "users" */
export type Users = {
	__typename?: 'users';
	id: Scalars['uuid'];
	name: Scalars['String'];
	/** An array relationship */
	orders: Array<Orders>;
	/** An aggregated array relationship */
	orders_aggregate: Orders_Aggregate;
	phone: Scalars['String'];
	/** An array relationship */
	store_followers: Array<Store_Followers>;
	/** An aggregated array relationship */
	store_followers_aggregate: Store_Followers_Aggregate;
};

/** columns and relationships of "users" */
export type UsersOrdersArgs = {
	distinct_on?: Maybe<Array<Orders_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Orders_Order_By>>;
	where?: Maybe<Orders_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersOrders_AggregateArgs = {
	distinct_on?: Maybe<Array<Orders_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Orders_Order_By>>;
	where?: Maybe<Orders_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersStore_FollowersArgs = {
	distinct_on?: Maybe<Array<Store_Followers_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Store_Followers_Order_By>>;
	where?: Maybe<Store_Followers_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersStore_Followers_AggregateArgs = {
	distinct_on?: Maybe<Array<Store_Followers_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Store_Followers_Order_By>>;
	where?: Maybe<Store_Followers_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
	__typename?: 'users_aggregate';
	aggregate?: Maybe<Users_Aggregate_Fields>;
	nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
	__typename?: 'users_aggregate_fields';
	count?: Maybe<Scalars['Int']>;
	max?: Maybe<Users_Max_Fields>;
	min?: Maybe<Users_Min_Fields>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Users_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users" */
export type Users_Aggregate_Order_By = {
	count?: Maybe<Order_By>;
	max?: Maybe<Users_Max_Order_By>;
	min?: Maybe<Users_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users" */
export type Users_Arr_Rel_Insert_Input = {
	data: Array<Users_Insert_Input>;
	on_conflict?: Maybe<Users_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
	_and?: Maybe<Array<Maybe<Users_Bool_Exp>>>;
	_not?: Maybe<Users_Bool_Exp>;
	_or?: Maybe<Array<Maybe<Users_Bool_Exp>>>;
	id?: Maybe<Uuid_Comparison_Exp>;
	name?: Maybe<String_Comparison_Exp>;
	orders?: Maybe<Orders_Bool_Exp>;
	phone?: Maybe<String_Comparison_Exp>;
	store_followers?: Maybe<Store_Followers_Bool_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
	/** unique or primary key constraint */
	UsersPkey = 'users_pkey'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	orders?: Maybe<Orders_Arr_Rel_Insert_Input>;
	phone?: Maybe<Scalars['String']>;
	store_followers?: Maybe<Store_Followers_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
	__typename?: 'users_max_fields';
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "users" */
export type Users_Max_Order_By = {
	id?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	phone?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
	__typename?: 'users_min_fields';
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "users" */
export type Users_Min_Order_By = {
	id?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	phone?: Maybe<Order_By>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
	__typename?: 'users_mutation_response';
	/** number of affected rows by the mutation */
	affected_rows: Scalars['Int'];
	/** data of the affected rows by the mutation */
	returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
	data: Users_Insert_Input;
	on_conflict?: Maybe<Users_On_Conflict>;
};

/** on conflict condition type for table "users" */
export type Users_On_Conflict = {
	constraint: Users_Constraint;
	update_columns: Array<Users_Update_Column>;
	where?: Maybe<Users_Bool_Exp>;
};

/** ordering options when selecting data from "users" */
export type Users_Order_By = {
	id?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	orders_aggregate?: Maybe<Orders_Aggregate_Order_By>;
	phone?: Maybe<Order_By>;
	store_followers_aggregate?: Maybe<Store_Followers_Aggregate_Order_By>;
};

/** primary key columns input for table: "users" */
export type Users_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
	/** column name */
	Id = 'id',
	/** column name */
	Name = 'name',
	/** column name */
	Phone = 'phone'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
	/** column name */
	Id = 'id',
	/** column name */
	Name = 'name',
	/** column name */
	Phone = 'phone'
}

/** expression to compare columns of type uuid. All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
	_eq?: Maybe<Scalars['uuid']>;
	_gt?: Maybe<Scalars['uuid']>;
	_gte?: Maybe<Scalars['uuid']>;
	_in?: Maybe<Array<Scalars['uuid']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_lt?: Maybe<Scalars['uuid']>;
	_lte?: Maybe<Scalars['uuid']>;
	_neq?: Maybe<Scalars['uuid']>;
	_nin?: Maybe<Array<Scalars['uuid']>>;
};

export type ItemsQueryVariables = Exact<{ [key: string]: never }>;

export type ItemsQuery = { __typename?: 'query_root' } & {
	items: Array<
		{ __typename?: 'items' } & Pick<
			Items,
			'id' | 'name' | 'store_id' | 'featured' | 'price_per_unit'
		>
	>;
};

export type StoreItemsQueryVariables = Exact<{
	storeId: Scalars['uuid'];
}>;

export type StoreItemsQuery = { __typename?: 'query_root' } & {
	storeItems: Array<
		{ __typename?: 'items' } & Pick<
			Items,
			'id' | 'name' | 'store_id' | 'featured' | 'price_per_unit'
		>
	>;
};

export type ItemQueryVariables = Exact<{
	itemId: Scalars['uuid'];
}>;

export type ItemQuery = { __typename?: 'query_root' } & {
	items: Array<
		{ __typename?: 'items' } & Pick<
			Items,
			'id' | 'name' | 'store_id' | 'description' | 'price_per_unit'
		> & { store: { __typename?: 'stores' } & Pick<Stores, 'id' | 'name'> }
	>;
};

export type FeaturedItemsQueryVariables = Exact<{ [key: string]: never }>;

export type FeaturedItemsQuery = { __typename?: 'query_root' } & {
	featuredItems: Array<
		{ __typename?: 'items' } & Pick<
			Items,
			'id' | 'name' | 'store_id' | 'description' | 'price_per_unit'
		> & { store: { __typename?: 'stores' } & Pick<Stores, 'id' | 'name'> }
	>;
};

export type NewArrivalsQueryVariables = Exact<{
	storeIds: Array<Scalars['uuid']>;
	oneDayAgo: Scalars['timestamptz'];
}>;

export type NewArrivalsQuery = { __typename?: 'query_root' } & {
	items: Array<
		{ __typename?: 'items' } & Pick<Items, 'id' | 'name' | 'price_per_unit'> & {
				store: { __typename?: 'stores' } & Pick<Stores, 'id' | 'name'>;
			}
	>;
};

export type UserOrdersQueryVariables = Exact<{
	userId: Scalars['uuid'];
}>;

export type UserOrdersQuery = { __typename?: 'query_root' } & {
	orders: Array<
		{ __typename?: 'orders' } & Pick<Orders, 'id' | 'status'> & {
				store: { __typename?: 'stores' } & Pick<Stores, 'name'>;
				order_items: Array<
					{ __typename?: 'order_items' } & Pick<Order_Items, 'quantity'> & {
							item: { __typename?: 'items' } & Pick<
								Items,
								'name' | 'price_per_unit'
							>;
						}
				>;
			}
	>;
};

export type PlaceOrderMutationVariables = Exact<{
	input: Orders_Insert_Input;
}>;

export type PlaceOrderMutation = { __typename?: 'mutation_root' } & {
	insert_orders?: Maybe<
		{ __typename?: 'orders_mutation_response' } & {
			returning: Array<
				{ __typename?: 'orders' } & Pick<Orders, 'id' | 'status'> & {
						store: { __typename?: 'stores' } & Pick<Stores, 'name'>;
						order_items: Array<
							{ __typename?: 'order_items' } & Pick<Order_Items, 'quantity'> & {
									item: { __typename?: 'items' } & Pick<
										Items,
										'name' | 'price_per_unit'
									>;
								}
						>;
					}
			>;
		}
	>;
};

export type CreateOrderItemsMutationVariables = Exact<{
	items: Array<Order_Items_Insert_Input>;
}>;

export type CreateOrderItemsMutation = { __typename?: 'mutation_root' } & {
	insert_order_items?: Maybe<
		{ __typename?: 'order_items_mutation_response' } & Pick<
			Order_Items_Mutation_Response,
			'affected_rows'
		> & {
				returning: Array<
					{ __typename?: 'order_items' } & Pick<Order_Items, 'id'>
				>;
			}
	>;
};

export type SearchQueryVariables = Exact<{
	searchTerm: Scalars['String'];
}>;

export type SearchQuery = { __typename?: 'query_root' } & {
	stores: Array<
		{ __typename?: 'stores' } & Pick<Stores, 'id' | 'name' | 'short_name'>
	>;
	items: Array<{ __typename?: 'items' } & Pick<Items, 'id' | 'name'>>;
};

export type StoresQueryVariables = Exact<{ [key: string]: never }>;

export type StoresQuery = { __typename?: 'query_root' } & {
	stores: Array<
		{ __typename?: 'stores' } & Pick<Stores, 'id' | 'name' | 'short_name'>
	>;
};

export type StoreQueryVariables = Exact<{
	storeId: Scalars['uuid'];
}>;

export type StoreQuery = { __typename?: 'query_root' } & {
	stores: Array<
		{ __typename?: 'stores' } & Pick<Stores, 'id' | 'name' | 'short_name'>
	>;
};

export type FollowStoreMutationVariables = Exact<{
	storeId: Scalars['uuid'];
	userId: Scalars['uuid'];
}>;

export type FollowStoreMutation = { __typename?: 'mutation_root' } & {
	insert_store_followers?: Maybe<
		{ __typename?: 'store_followers_mutation_response' } & Pick<
			Store_Followers_Mutation_Response,
			'affected_rows'
		> & {
				returning: Array<
					{ __typename?: 'store_followers' } & Pick<
						Store_Followers,
						'user_id' | 'store_id'
					>
				>;
			}
	>;
};

export type UnfollowStoreMutationVariables = Exact<{
	userId: Scalars['uuid'];
	storeId: Scalars['uuid'];
}>;

export type UnfollowStoreMutation = { __typename?: 'mutation_root' } & {
	delete_store_followers?: Maybe<
		{ __typename?: 'store_followers_mutation_response' } & Pick<
			Store_Followers_Mutation_Response,
			'affected_rows'
		>
	>;
};

export type StoresFollowedQueryVariables = Exact<{
	userId: Scalars['uuid'];
}>;

export type StoresFollowedQuery = { __typename?: 'query_root' } & {
	store_followers: Array<
		{ __typename?: 'store_followers' } & Pick<Store_Followers, 'store_id'> & {
				store: { __typename?: 'stores' } & Pick<Stores, 'name' | 'short_name'>;
			}
	>;
};

export const ItemsDocument = gql`
	query Items {
		items {
			id
			name
			store_id
			featured
			price_per_unit
		}
	}
`;

export function useItemsQuery(
	options: Omit<Urql.UseQueryArgs<ItemsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ItemsQuery>({ query: ItemsDocument, ...options });
}
export const StoreItemsDocument = gql`
	query StoreItems($storeId: uuid!) {
		storeItems: items(where: { store_id: { _eq: $storeId } }) {
			id
			name
			store_id
			featured
			price_per_unit
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
	query Item($itemId: uuid!) {
		items(where: { id: { _eq: $itemId } }) {
			id
			name
			store_id
			store {
				id
				name
			}
			description
			price_per_unit
		}
	}
`;

export function useItemQuery(
	options: Omit<Urql.UseQueryArgs<ItemQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<ItemQuery>({ query: ItemDocument, ...options });
}
export const FeaturedItemsDocument = gql`
	query FeaturedItems {
		featuredItems: items(where: { featured: { _eq: true } }) {
			id
			name
			store_id
			store {
				id
				name
			}
			description
			price_per_unit
		}
	}
`;

export function useFeaturedItemsQuery(
	options: Omit<Urql.UseQueryArgs<FeaturedItemsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<FeaturedItemsQuery>({
		query: FeaturedItemsDocument,
		...options
	});
}
export const NewArrivalsDocument = gql`
	query NewArrivals($storeIds: [uuid!]!, $oneDayAgo: timestamptz!) {
		items(where: { created_at: { _gte: $oneDayAgo } }) {
			id
			name
			store {
				id
				name
			}
			price_per_unit
		}
	}
`;

export function useNewArrivalsQuery(
	options: Omit<Urql.UseQueryArgs<NewArrivalsQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<NewArrivalsQuery>({
		query: NewArrivalsDocument,
		...options
	});
}
export const UserOrdersDocument = gql`
	query UserOrders($userId: uuid!) {
		orders(where: { user_id: { _eq: $userId } }) {
			id
			status
			store {
				name
			}
			order_items {
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
	mutation PlaceOrder($input: orders_insert_input!) {
		insert_orders(objects: [$input]) {
			returning {
				id
				status
				store {
					name
				}
				order_items {
					item {
						name
						price_per_unit
					}
					quantity
				}
			}
		}
	}
`;

export function usePlaceOrderMutation() {
	return Urql.useMutation<PlaceOrderMutation, PlaceOrderMutationVariables>(
		PlaceOrderDocument
	);
}
export const CreateOrderItemsDocument = gql`
	mutation CreateOrderItems($items: [order_items_insert_input!]!) {
		insert_order_items(objects: $items) {
			affected_rows
			returning {
				id
			}
		}
	}
`;

export function useCreateOrderItemsMutation() {
	return Urql.useMutation<
		CreateOrderItemsMutation,
		CreateOrderItemsMutationVariables
	>(CreateOrderItemsDocument);
}
export const SearchDocument = gql`
	query Search($searchTerm: String!) {
		stores(
			where: { name: { _ilike: $searchTerm } }
			order_by: [{ name: asc }]
		) {
			id
			name
			short_name
		}
		items(where: { name: { _ilike: $searchTerm } }, order_by: [{ name: asc }]) {
			id
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
		}
	}
`;

export function useStoresQuery(
	options: Omit<Urql.UseQueryArgs<StoresQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoresQuery>({ query: StoresDocument, ...options });
}
export const StoreDocument = gql`
	query Store($storeId: uuid!) {
		stores(where: { id: { _eq: $storeId } }) {
			id
			name
			short_name
		}
	}
`;

export function useStoreQuery(
	options: Omit<Urql.UseQueryArgs<StoreQueryVariables>, 'query'> = {}
) {
	return Urql.useQuery<StoreQuery>({ query: StoreDocument, ...options });
}
export const FollowStoreDocument = gql`
	mutation FollowStore($storeId: uuid!, $userId: uuid!) {
		insert_store_followers(
			objects: [{ store_id: $storeId, user_id: $userId }]
		) {
			affected_rows
			returning {
				user_id
				store_id
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
	mutation UnfollowStore($userId: uuid!, $storeId: uuid!) {
		delete_store_followers(
			where: {
				_and: [{ store_id: { _eq: $storeId } }, { user_id: { _eq: $userId } }]
			}
		) {
			affected_rows
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
	query StoresFollowed($userId: uuid!) {
		store_followers(where: { user_id: { _eq: $userId } }) {
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
