import Knex from 'knex';
import {
	CreateManyBuilder,
	CreateOneBuilder,
	DeleteByIdBuilder,
	DeleteManyBuilder,
	FindByIdBuilder,
	FindManyBuilder,
	FindOneBuilder,
	PaginateBuilder,
	UpdateByIdBuilder,
	UpdateManyBuilder
} from 'sqlmancer';

export type ID = number | string;
export type JSON = boolean | number | string | null | JSONArray | JSONObject;
export interface JSONObject {
	[key: string]: JSON;
}
export type JSONArray = Array<JSON>;

export type UserFields = {
	id: ID;
	name: string;
	phone: string;
	created_at: string;
	updated_at: string;
};

export type UserIds = 'id';

export type UserEnums = unknown;

export type UserAssociations = {};

export type UserCreateFields = {
	id?: ID;
	name: string;
	phone: string;
	created_at?: string;
	updated_at?: string;
};

export type UserUpdateFields = {
	name?: string;
	phone?: string;
	created_at?: string;
	updated_at?: string;
};

export type UserFindOneBuilder<
	TSelected extends Pick<UserFields, any> = UserFields
> = FindOneBuilder<
	'postgres',
	UserFields,
	UserIds,
	UserEnums,
	UserAssociations,
	TSelected
>;

export type UserFindManyBuilder<
	TSelected extends Pick<UserFields, any> = UserFields
> = FindManyBuilder<
	'postgres',
	UserFields,
	UserIds,
	UserEnums,
	UserAssociations,
	TSelected
>;

export type UserFindByIdBuilder<
	TSelected extends Pick<UserFields, any> = UserFields
> = FindByIdBuilder<
	UserFields,
	UserIds,
	UserEnums,
	UserAssociations,
	TSelected
>;

export type UserPaginateBuilder = PaginateBuilder<
	'postgres',
	UserFields,
	UserIds,
	UserEnums,
	UserAssociations
>;

export type UserDeleteManyBuilder = DeleteManyBuilder<
	'postgres',
	UserFields,
	UserIds,
	UserEnums,
	UserAssociations
>;

export type UserDeleteByIdBuilder = DeleteByIdBuilder;

export type UserCreateManyBuilder = CreateManyBuilder<UserCreateFields>;

export type UserCreateOneBuilder = CreateOneBuilder<UserCreateFields>;

export type UserUpdateManyBuilder = UpdateManyBuilder<
	'postgres',
	UserUpdateFields,
	UserFields,
	UserIds,
	UserEnums,
	UserAssociations
>;

export type UserUpdateByIdBuilder = UpdateByIdBuilder<UserUpdateFields>;

export type StoreFields = {
	id: ID;
	name: string;
	short_name: string;
	created_at: string;
	updated_at: string;
};

export type StoreIds = 'id';

export type StoreEnums = unknown;

export type StoreAssociations = {
	profile: [StoreProfileFindOneBuilder, StoreProfilePaginateBuilder];
};

export type StoreCreateFields = {
	id?: ID;
	name: string;
	short_name: string;
	created_at?: string;
	updated_at?: string;
};

export type StoreUpdateFields = {
	name?: string;
	short_name?: string;
	created_at?: string;
	updated_at?: string;
};

export type StoreFindOneBuilder<
	TSelected extends Pick<StoreFields, any> = StoreFields
> = FindOneBuilder<
	'postgres',
	StoreFields,
	StoreIds,
	StoreEnums,
	StoreAssociations,
	TSelected
>;

export type StoreFindManyBuilder<
	TSelected extends Pick<StoreFields, any> = StoreFields
> = FindManyBuilder<
	'postgres',
	StoreFields,
	StoreIds,
	StoreEnums,
	StoreAssociations,
	TSelected
>;

export type StoreFindByIdBuilder<
	TSelected extends Pick<StoreFields, any> = StoreFields
> = FindByIdBuilder<
	StoreFields,
	StoreIds,
	StoreEnums,
	StoreAssociations,
	TSelected
>;

export type StorePaginateBuilder = PaginateBuilder<
	'postgres',
	StoreFields,
	StoreIds,
	StoreEnums,
	StoreAssociations
>;

export type StoreDeleteManyBuilder = DeleteManyBuilder<
	'postgres',
	StoreFields,
	StoreIds,
	StoreEnums,
	StoreAssociations
>;

export type StoreDeleteByIdBuilder = DeleteByIdBuilder;

export type StoreCreateManyBuilder = CreateManyBuilder<StoreCreateFields>;

export type StoreCreateOneBuilder = CreateOneBuilder<StoreCreateFields>;

export type StoreUpdateManyBuilder = UpdateManyBuilder<
	'postgres',
	StoreUpdateFields,
	StoreFields,
	StoreIds,
	StoreEnums,
	StoreAssociations
>;

export type StoreUpdateByIdBuilder = UpdateByIdBuilder<StoreUpdateFields>;

export type ManagerFields = {
	id: ID;
	store_id: ID;
	name: string;
	email: string;
	created_at: string;
	updated_at: string;
};

export type ManagerIds = 'id' | 'store_id';

export type ManagerEnums = unknown;

export type ManagerAssociations = {
	store: [StoreFindOneBuilder, StorePaginateBuilder];
};

export type ManagerCreateFields = {
	id?: ID;
	store_id: ID;
	name: string;
	email: string;
	created_at?: string;
	updated_at?: string;
};

export type ManagerUpdateFields = {
	store_id?: ID;
	name?: string;
	email?: string;
	created_at?: string;
	updated_at?: string;
};

export type ManagerFindOneBuilder<
	TSelected extends Pick<ManagerFields, any> = ManagerFields
> = FindOneBuilder<
	'postgres',
	ManagerFields,
	ManagerIds,
	ManagerEnums,
	ManagerAssociations,
	TSelected
>;

export type ManagerFindManyBuilder<
	TSelected extends Pick<ManagerFields, any> = ManagerFields
> = FindManyBuilder<
	'postgres',
	ManagerFields,
	ManagerIds,
	ManagerEnums,
	ManagerAssociations,
	TSelected
>;

export type ManagerFindByIdBuilder<
	TSelected extends Pick<ManagerFields, any> = ManagerFields
> = FindByIdBuilder<
	ManagerFields,
	ManagerIds,
	ManagerEnums,
	ManagerAssociations,
	TSelected
>;

export type ManagerPaginateBuilder = PaginateBuilder<
	'postgres',
	ManagerFields,
	ManagerIds,
	ManagerEnums,
	ManagerAssociations
>;

export type ManagerDeleteManyBuilder = DeleteManyBuilder<
	'postgres',
	ManagerFields,
	ManagerIds,
	ManagerEnums,
	ManagerAssociations
>;

export type ManagerDeleteByIdBuilder = DeleteByIdBuilder;

export type ManagerCreateManyBuilder = CreateManyBuilder<ManagerCreateFields>;

export type ManagerCreateOneBuilder = CreateOneBuilder<ManagerCreateFields>;

export type ManagerUpdateManyBuilder = UpdateManyBuilder<
	'postgres',
	ManagerUpdateFields,
	ManagerFields,
	ManagerIds,
	ManagerEnums,
	ManagerAssociations
>;

export type ManagerUpdateByIdBuilder = UpdateByIdBuilder<ManagerUpdateFields>;

export type OrderFields = {
	id: ID;
	user_id: ID;
	store_id: ID;
	status: OrderStatus;
	created_at: string;
	updated_at: string;
};

export type OrderIds = 'id' | 'user_id' | 'store_id';

export type OrderEnums = OrderStatus;

export type OrderAssociations = {
	store: [StoreFindOneBuilder, StorePaginateBuilder];
	user: [UserFindOneBuilder, UserPaginateBuilder];
	cart: [OrderItemFindManyBuilder, OrderItemPaginateBuilder];
};

export type OrderCreateFields = {
	id?: ID;
	user_id: ID;
	store_id: ID;
	status?: OrderStatus;
	created_at?: string;
	updated_at?: string;
};

export type OrderUpdateFields = {
	user_id?: ID;
	store_id?: ID;
	status?: OrderStatus;
	created_at?: string;
	updated_at?: string;
};

export type OrderFindOneBuilder<
	TSelected extends Pick<OrderFields, any> = OrderFields
> = FindOneBuilder<
	'postgres',
	OrderFields,
	OrderIds,
	OrderEnums,
	OrderAssociations,
	TSelected
>;

export type OrderFindManyBuilder<
	TSelected extends Pick<OrderFields, any> = OrderFields
> = FindManyBuilder<
	'postgres',
	OrderFields,
	OrderIds,
	OrderEnums,
	OrderAssociations,
	TSelected
>;

export type OrderFindByIdBuilder<
	TSelected extends Pick<OrderFields, any> = OrderFields
> = FindByIdBuilder<
	OrderFields,
	OrderIds,
	OrderEnums,
	OrderAssociations,
	TSelected
>;

export type OrderPaginateBuilder = PaginateBuilder<
	'postgres',
	OrderFields,
	OrderIds,
	OrderEnums,
	OrderAssociations
>;

export type OrderDeleteManyBuilder = DeleteManyBuilder<
	'postgres',
	OrderFields,
	OrderIds,
	OrderEnums,
	OrderAssociations
>;

export type OrderDeleteByIdBuilder = DeleteByIdBuilder;

export type OrderCreateManyBuilder = CreateManyBuilder<OrderCreateFields>;

export type OrderCreateOneBuilder = CreateOneBuilder<OrderCreateFields>;

export type OrderUpdateManyBuilder = UpdateManyBuilder<
	'postgres',
	OrderUpdateFields,
	OrderFields,
	OrderIds,
	OrderEnums,
	OrderAssociations
>;

export type OrderUpdateByIdBuilder = UpdateByIdBuilder<OrderUpdateFields>;

export type ItemFields = {
	id: ID;
	store_id: ID;
	name: string;
	description: string;
	unit: ItemUnit;
	price_per_unit: number;
	featured: boolean;
	created_at: string;
	updated_at: string;
};

export type ItemIds = 'id' | 'store_id';

export type ItemEnums = ItemUnit;

export type ItemAssociations = {
	store: [StoreFindOneBuilder, StorePaginateBuilder];
};

export type ItemCreateFields = {
	id?: ID;
	store_id: ID;
	name: string;
	description: string;
	unit: ItemUnit;
	price_per_unit: number;
	featured: boolean;
	created_at?: string;
	updated_at?: string;
};

export type ItemUpdateFields = {
	store_id?: ID;
	name?: string;
	description?: string;
	unit?: ItemUnit;
	price_per_unit?: number;
	featured?: boolean;
	created_at?: string;
	updated_at?: string;
};

export type ItemFindOneBuilder<
	TSelected extends Pick<ItemFields, any> = ItemFields
> = FindOneBuilder<
	'postgres',
	ItemFields,
	ItemIds,
	ItemEnums,
	ItemAssociations,
	TSelected
>;

export type ItemFindManyBuilder<
	TSelected extends Pick<ItemFields, any> = ItemFields
> = FindManyBuilder<
	'postgres',
	ItemFields,
	ItemIds,
	ItemEnums,
	ItemAssociations,
	TSelected
>;

export type ItemFindByIdBuilder<
	TSelected extends Pick<ItemFields, any> = ItemFields
> = FindByIdBuilder<
	ItemFields,
	ItemIds,
	ItemEnums,
	ItemAssociations,
	TSelected
>;

export type ItemPaginateBuilder = PaginateBuilder<
	'postgres',
	ItemFields,
	ItemIds,
	ItemEnums,
	ItemAssociations
>;

export type ItemDeleteManyBuilder = DeleteManyBuilder<
	'postgres',
	ItemFields,
	ItemIds,
	ItemEnums,
	ItemAssociations
>;

export type ItemDeleteByIdBuilder = DeleteByIdBuilder;

export type ItemCreateManyBuilder = CreateManyBuilder<ItemCreateFields>;

export type ItemCreateOneBuilder = CreateOneBuilder<ItemCreateFields>;

export type ItemUpdateManyBuilder = UpdateManyBuilder<
	'postgres',
	ItemUpdateFields,
	ItemFields,
	ItemIds,
	ItemEnums,
	ItemAssociations
>;

export type ItemUpdateByIdBuilder = UpdateByIdBuilder<ItemUpdateFields>;

export type StoreProfileFields = {
	id: ID;
	store_id: ID;
	bio: string;
	website_url: string;
	instagram_username: string;
	twitter_username: string;
	created_at: string;
	updated_at: string;
};

export type StoreProfileIds = 'id' | 'store_id';

export type StoreProfileEnums = unknown;

export type StoreProfileAssociations = {
	store: [StoreFindOneBuilder, StorePaginateBuilder];
	followers: [StoreFollowerFindManyBuilder, StoreFollowerPaginateBuilder];
};

export type StoreProfileCreateFields = {
	id?: ID;
	store_id: ID;
	bio?: string;
	website_url?: string;
	instagram_username?: string;
	twitter_username?: string;
	created_at?: string;
	updated_at?: string;
};

export type StoreProfileUpdateFields = {
	store_id?: ID;
	bio?: string;
	website_url?: string;
	instagram_username?: string;
	twitter_username?: string;
	created_at?: string;
	updated_at?: string;
};

export type StoreProfileFindOneBuilder<
	TSelected extends Pick<StoreProfileFields, any> = StoreProfileFields
> = FindOneBuilder<
	'postgres',
	StoreProfileFields,
	StoreProfileIds,
	StoreProfileEnums,
	StoreProfileAssociations,
	TSelected
>;

export type StoreProfileFindManyBuilder<
	TSelected extends Pick<StoreProfileFields, any> = StoreProfileFields
> = FindManyBuilder<
	'postgres',
	StoreProfileFields,
	StoreProfileIds,
	StoreProfileEnums,
	StoreProfileAssociations,
	TSelected
>;

export type StoreProfileFindByIdBuilder<
	TSelected extends Pick<StoreProfileFields, any> = StoreProfileFields
> = FindByIdBuilder<
	StoreProfileFields,
	StoreProfileIds,
	StoreProfileEnums,
	StoreProfileAssociations,
	TSelected
>;

export type StoreProfilePaginateBuilder = PaginateBuilder<
	'postgres',
	StoreProfileFields,
	StoreProfileIds,
	StoreProfileEnums,
	StoreProfileAssociations
>;

export type StoreProfileDeleteManyBuilder = DeleteManyBuilder<
	'postgres',
	StoreProfileFields,
	StoreProfileIds,
	StoreProfileEnums,
	StoreProfileAssociations
>;

export type StoreProfileDeleteByIdBuilder = DeleteByIdBuilder;

export type StoreProfileCreateManyBuilder = CreateManyBuilder<
	StoreProfileCreateFields
>;

export type StoreProfileCreateOneBuilder = CreateOneBuilder<
	StoreProfileCreateFields
>;

export type StoreProfileUpdateManyBuilder = UpdateManyBuilder<
	'postgres',
	StoreProfileUpdateFields,
	StoreProfileFields,
	StoreProfileIds,
	StoreProfileEnums,
	StoreProfileAssociations
>;

export type StoreProfileUpdateByIdBuilder = UpdateByIdBuilder<
	StoreProfileUpdateFields
>;

export type OrderItemFields = {
	id: ID;
	order_id: ID;
	item_id: ID;
	quantity: number;
};

export type OrderItemIds = 'id' | 'order_id' | 'item_id';

export type OrderItemEnums = unknown;

export type OrderItemAssociations = {
	order: [OrderFindOneBuilder, OrderPaginateBuilder];
	item: [ItemFindOneBuilder, ItemPaginateBuilder];
};

export type OrderItemCreateFields = {
	id?: ID;
	order_id: ID;
	item_id: ID;
	quantity: number;
};

export type OrderItemUpdateFields = {
	order_id?: ID;
	item_id?: ID;
	quantity?: number;
};

export type OrderItemFindOneBuilder<
	TSelected extends Pick<OrderItemFields, any> = OrderItemFields
> = FindOneBuilder<
	'postgres',
	OrderItemFields,
	OrderItemIds,
	OrderItemEnums,
	OrderItemAssociations,
	TSelected
>;

export type OrderItemFindManyBuilder<
	TSelected extends Pick<OrderItemFields, any> = OrderItemFields
> = FindManyBuilder<
	'postgres',
	OrderItemFields,
	OrderItemIds,
	OrderItemEnums,
	OrderItemAssociations,
	TSelected
>;

export type OrderItemFindByIdBuilder<
	TSelected extends Pick<OrderItemFields, any> = OrderItemFields
> = FindByIdBuilder<
	OrderItemFields,
	OrderItemIds,
	OrderItemEnums,
	OrderItemAssociations,
	TSelected
>;

export type OrderItemPaginateBuilder = PaginateBuilder<
	'postgres',
	OrderItemFields,
	OrderItemIds,
	OrderItemEnums,
	OrderItemAssociations
>;

export type OrderItemDeleteManyBuilder = DeleteManyBuilder<
	'postgres',
	OrderItemFields,
	OrderItemIds,
	OrderItemEnums,
	OrderItemAssociations
>;

export type OrderItemDeleteByIdBuilder = DeleteByIdBuilder;

export type OrderItemCreateManyBuilder = CreateManyBuilder<
	OrderItemCreateFields
>;

export type OrderItemCreateOneBuilder = CreateOneBuilder<OrderItemCreateFields>;

export type OrderItemUpdateManyBuilder = UpdateManyBuilder<
	'postgres',
	OrderItemUpdateFields,
	OrderItemFields,
	OrderItemIds,
	OrderItemEnums,
	OrderItemAssociations
>;

export type OrderItemUpdateByIdBuilder = UpdateByIdBuilder<
	OrderItemUpdateFields
>;

export type StoreFollowerFields = {
	id: ID;
	store_id: ID;
	user_id: ID;
};

export type StoreFollowerIds = 'id' | 'store_id' | 'user_id';

export type StoreFollowerEnums = unknown;

export type StoreFollowerAssociations = {
	store: [StoreFindOneBuilder, StorePaginateBuilder];
	user: [UserFindOneBuilder, UserPaginateBuilder];
};

export type StoreFollowerCreateFields = {
	id?: ID;
	store_id: ID;
	user_id: ID;
};

export type StoreFollowerUpdateFields = {
	store_id?: ID;
	user_id?: ID;
};

export type StoreFollowerFindOneBuilder<
	TSelected extends Pick<StoreFollowerFields, any> = StoreFollowerFields
> = FindOneBuilder<
	'postgres',
	StoreFollowerFields,
	StoreFollowerIds,
	StoreFollowerEnums,
	StoreFollowerAssociations,
	TSelected
>;

export type StoreFollowerFindManyBuilder<
	TSelected extends Pick<StoreFollowerFields, any> = StoreFollowerFields
> = FindManyBuilder<
	'postgres',
	StoreFollowerFields,
	StoreFollowerIds,
	StoreFollowerEnums,
	StoreFollowerAssociations,
	TSelected
>;

export type StoreFollowerFindByIdBuilder<
	TSelected extends Pick<StoreFollowerFields, any> = StoreFollowerFields
> = FindByIdBuilder<
	StoreFollowerFields,
	StoreFollowerIds,
	StoreFollowerEnums,
	StoreFollowerAssociations,
	TSelected
>;

export type StoreFollowerPaginateBuilder = PaginateBuilder<
	'postgres',
	StoreFollowerFields,
	StoreFollowerIds,
	StoreFollowerEnums,
	StoreFollowerAssociations
>;

export type StoreFollowerDeleteManyBuilder = DeleteManyBuilder<
	'postgres',
	StoreFollowerFields,
	StoreFollowerIds,
	StoreFollowerEnums,
	StoreFollowerAssociations
>;

export type StoreFollowerDeleteByIdBuilder = DeleteByIdBuilder;

export type StoreFollowerCreateManyBuilder = CreateManyBuilder<
	StoreFollowerCreateFields
>;

export type StoreFollowerCreateOneBuilder = CreateOneBuilder<
	StoreFollowerCreateFields
>;

export type StoreFollowerUpdateManyBuilder = UpdateManyBuilder<
	'postgres',
	StoreFollowerUpdateFields,
	StoreFollowerFields,
	StoreFollowerIds,
	StoreFollowerEnums,
	StoreFollowerAssociations
>;

export type StoreFollowerUpdateByIdBuilder = UpdateByIdBuilder<
	StoreFollowerUpdateFields
>;

export enum ItemUnit {
	Kilogram = 'Kilogram',
	Litre = 'Litre',
	Cup = 'Cup'
}

export enum OrderStatus {
	Pending = 'Pending',
	Processing = 'Processing',
	Fulfilled = 'Fulfilled'
}

export type SqlmancerClient = Knex & {
	models: {
		User: {
			findById: (id: ID) => UserFindByIdBuilder;
			findMany: () => UserFindManyBuilder;
			findOne: () => UserFindOneBuilder;
			paginate: () => UserPaginateBuilder;
			createMany: (input: UserCreateFields[]) => UserCreateManyBuilder;
			createOne: (input: UserCreateFields) => UserCreateOneBuilder;
			deleteById: (id: ID) => UserDeleteByIdBuilder;
			deleteMany: () => UserDeleteManyBuilder;
			updateById: (id: ID, input: UserUpdateFields) => UserUpdateByIdBuilder;
			updateMany: (input: UserUpdateFields) => UserUpdateManyBuilder;
		};
		Store: {
			findById: (id: ID) => StoreFindByIdBuilder;
			findMany: () => StoreFindManyBuilder;
			findOne: () => StoreFindOneBuilder;
			paginate: () => StorePaginateBuilder;
			createMany: (input: StoreCreateFields[]) => StoreCreateManyBuilder;
			createOne: (input: StoreCreateFields) => StoreCreateOneBuilder;
			deleteById: (id: ID) => StoreDeleteByIdBuilder;
			deleteMany: () => StoreDeleteManyBuilder;
			updateById: (id: ID, input: StoreUpdateFields) => StoreUpdateByIdBuilder;
			updateMany: (input: StoreUpdateFields) => StoreUpdateManyBuilder;
		};
		Manager: {
			findById: (id: ID) => ManagerFindByIdBuilder;
			findMany: () => ManagerFindManyBuilder;
			findOne: () => ManagerFindOneBuilder;
			paginate: () => ManagerPaginateBuilder;
			createMany: (input: ManagerCreateFields[]) => ManagerCreateManyBuilder;
			createOne: (input: ManagerCreateFields) => ManagerCreateOneBuilder;
			deleteById: (id: ID) => ManagerDeleteByIdBuilder;
			deleteMany: () => ManagerDeleteManyBuilder;
			updateById: (
				id: ID,
				input: ManagerUpdateFields
			) => ManagerUpdateByIdBuilder;
			updateMany: (input: ManagerUpdateFields) => ManagerUpdateManyBuilder;
		};
		Order: {
			findById: (id: ID) => OrderFindByIdBuilder;
			findMany: () => OrderFindManyBuilder;
			findOne: () => OrderFindOneBuilder;
			paginate: () => OrderPaginateBuilder;
			createMany: (input: OrderCreateFields[]) => OrderCreateManyBuilder;
			createOne: (input: OrderCreateFields) => OrderCreateOneBuilder;
			deleteById: (id: ID) => OrderDeleteByIdBuilder;
			deleteMany: () => OrderDeleteManyBuilder;
			updateById: (id: ID, input: OrderUpdateFields) => OrderUpdateByIdBuilder;
			updateMany: (input: OrderUpdateFields) => OrderUpdateManyBuilder;
		};
		Item: {
			findById: (id: ID) => ItemFindByIdBuilder;
			findMany: () => ItemFindManyBuilder;
			findOne: () => ItemFindOneBuilder;
			paginate: () => ItemPaginateBuilder;
			createMany: (input: ItemCreateFields[]) => ItemCreateManyBuilder;
			createOne: (input: ItemCreateFields) => ItemCreateOneBuilder;
			deleteById: (id: ID) => ItemDeleteByIdBuilder;
			deleteMany: () => ItemDeleteManyBuilder;
			updateById: (id: ID, input: ItemUpdateFields) => ItemUpdateByIdBuilder;
			updateMany: (input: ItemUpdateFields) => ItemUpdateManyBuilder;
		};
		StoreProfile: {
			findById: (id: ID) => StoreProfileFindByIdBuilder;
			findMany: () => StoreProfileFindManyBuilder;
			findOne: () => StoreProfileFindOneBuilder;
			paginate: () => StoreProfilePaginateBuilder;
			createMany: (
				input: StoreProfileCreateFields[]
			) => StoreProfileCreateManyBuilder;
			createOne: (
				input: StoreProfileCreateFields
			) => StoreProfileCreateOneBuilder;
			deleteById: (id: ID) => StoreProfileDeleteByIdBuilder;
			deleteMany: () => StoreProfileDeleteManyBuilder;
			updateById: (
				id: ID,
				input: StoreProfileUpdateFields
			) => StoreProfileUpdateByIdBuilder;
			updateMany: (
				input: StoreProfileUpdateFields
			) => StoreProfileUpdateManyBuilder;
		};
		OrderItem: {
			findById: (id: ID) => OrderItemFindByIdBuilder;
			findMany: () => OrderItemFindManyBuilder;
			findOne: () => OrderItemFindOneBuilder;
			paginate: () => OrderItemPaginateBuilder;
			createMany: (
				input: OrderItemCreateFields[]
			) => OrderItemCreateManyBuilder;
			createOne: (input: OrderItemCreateFields) => OrderItemCreateOneBuilder;
			deleteById: (id: ID) => OrderItemDeleteByIdBuilder;
			deleteMany: () => OrderItemDeleteManyBuilder;
			updateById: (
				id: ID,
				input: OrderItemUpdateFields
			) => OrderItemUpdateByIdBuilder;
			updateMany: (input: OrderItemUpdateFields) => OrderItemUpdateManyBuilder;
		};
		StoreFollower: {
			findById: (id: ID) => StoreFollowerFindByIdBuilder;
			findMany: () => StoreFollowerFindManyBuilder;
			findOne: () => StoreFollowerFindOneBuilder;
			paginate: () => StoreFollowerPaginateBuilder;
			createMany: (
				input: StoreFollowerCreateFields[]
			) => StoreFollowerCreateManyBuilder;
			createOne: (
				input: StoreFollowerCreateFields
			) => StoreFollowerCreateOneBuilder;
			deleteById: (id: ID) => StoreFollowerDeleteByIdBuilder;
			deleteMany: () => StoreFollowerDeleteManyBuilder;
			updateById: (
				id: ID,
				input: StoreFollowerUpdateFields
			) => StoreFollowerUpdateByIdBuilder;
			updateMany: (
				input: StoreFollowerUpdateFields
			) => StoreFollowerUpdateManyBuilder;
		};
	};
};
