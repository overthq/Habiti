import { relations } from 'drizzle-orm';
import {
	pgTable,
	uuid,
	varchar,
	timestamp,
	integer,
	text,
	unique
} from 'drizzle-orm/pg-core';

export const User = pgTable('User', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull().unique(),
	passwordHash: varchar('passwordHash').notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});

export const Store = pgTable('Store', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	description: text('description'),
	website: varchar('website'),
	twitter: varchar('twitter', { length: 15 }),
	instagram: varchar('instagram', { length: 30 }),
	unrealizedRevenue: integer('unrealizedRevenue').default(0).notNull(),
	realizedRevenue: integer('realizedRevenue').default(0).notNull(),
	paidOut: integer('paidOut').default(0).notNull(),
	orderCount: integer('orderCount').default(0).notNull(),
	bankAccountNumber: varchar('bankAccountNumber'),
	bankCode: varchar('bankCode'),
	bankAccountReference: varchar('bankAccountReference'),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});

export const Product = pgTable('Product', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	description: text('description').notNull(),
	unitPrice: integer('unitPrice').notNull(),
	quantity: integer('quantity').default(0).notNull(),
	status: varchar('status', { enum: ['Draft', 'Published', 'Archived'] })
		.default('Draft')
		.notNull(),
	storeId: uuid('storeId')
		.references(() => Store.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});

export const Order = pgTable(
	'Order',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		serialNumber: integer('serialNumber').default(0).notNull(),

		userId: uuid('userId')
			.references(() => User.id, { onDelete: 'cascade' })
			.notNull(),
		storeId: uuid('storeId')
			.references(() => Store.id, { onDelete: 'cascade' })
			.notNull(),
		status: varchar('status', {
			enum: ['Pending', 'Processing', 'Completed', 'Cancelled']
		})
			.default('Pending')
			.notNull(),
		transactionFee: integer('transactionFee').default(0).notNull(),
		serviceFee: integer('serviceFee').default(0).notNull(),
		total: integer('total').notNull(),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
		updatedAt: timestamp('updatedAt')
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date())
	},
	table => ({
		storeSerialUnique: unique().on(table.storeId, table.serialNumber)
	})
);

export const OrderProduct = pgTable(
	'OrderProduct',
	{
		orderId: uuid('orderId')
			.references(() => Order.id, { onDelete: 'cascade' })
			.notNull(),
		productId: uuid('productId')
			.references(() => Product.id, { onDelete: 'cascade' })
			.notNull(),
		unitPrice: integer('unitPrice').notNull(),
		quantity: integer('quantity').notNull()
	},
	table => ({
		orderProductUnique: unique().on(table.orderId, table.productId)
	})
);

export const Cart = pgTable(
	'Cart',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('userId')
			.references(() => User.id, { onDelete: 'cascade' })
			.notNull(),
		storeId: uuid('storeId')
			.references(() => Store.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
		updatedAt: timestamp('updatedAt')
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date())
	},
	table => ({
		userStoreUnique: unique().on(table.userId, table.storeId)
	})
);

export const CartProduct = pgTable(
	'CartProduct',
	{
		cartId: uuid('cartId')
			.references(() => Cart.id, { onDelete: 'cascade' })
			.notNull(),
		productId: uuid('productId')
			.references(() => Product.id, { onDelete: 'cascade' })
			.notNull(),
		quantity: integer('quantity').notNull(),
		userId: uuid('userId')
			.references(() => User.id, { onDelete: 'cascade' })
			.notNull()
	},
	table => ({
		cartProductUnique: unique().on(table.cartId, table.productId)
	})
);

export const WatchlistProduct = pgTable(
	'WatchlistProduct',
	{
		userId: uuid('userId')
			.references(() => User.id, { onDelete: 'cascade' })
			.notNull(),
		productId: uuid('productId')
			.references(() => Product.id, { onDelete: 'cascade' })
			.notNull()
	},
	table => ({
		watchlistUnique: unique().on(table.userId, table.productId)
	})
);

export const Image = pgTable('Image', {
	id: uuid('id').primaryKey().defaultRandom(),
	storeId: uuid('storeId')
		.references(() => Store.id, { onDelete: 'cascade' })
		.unique(),
	productId: uuid('productId').references(() => Product.id, {
		onDelete: 'cascade'
	}),
	path: varchar('path', { length: 2083 }).notNull(),
	publicId: varchar('publicId').notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});

export const StoreManager = pgTable(
	'StoreManager',
	{
		storeId: uuid('storeId')
			.references(() => Store.id, { onDelete: 'cascade' })
			.notNull(),
		managerId: uuid('managerId')
			.references(() => User.id, { onDelete: 'cascade' })
			.notNull()
	},
	table => ({
		managerUnique: unique().on(table.storeId, table.managerId)
	})
);

export const StoreFollower = pgTable(
	'StoreFollower',
	{
		storeId: uuid('storeId')
			.references(() => Store.id, { onDelete: 'cascade' })
			.notNull(),
		followerId: uuid('followerId')
			.references(() => User.id, { onDelete: 'cascade' })
			.notNull()
	},
	table => ({
		followerUnique: unique().on(table.storeId, table.followerId)
	})
);

export const Card = pgTable('Card', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('userId')
		.references(() => User.id, { onDelete: 'cascade' })
		.notNull(),
	email: varchar('email').notNull(),
	authorizationCode: varchar('authorizationCode').notNull(),
	cardType: varchar('cardType').notNull(),
	last4: varchar('last4').notNull(),
	expMonth: varchar('expMonth').notNull(),
	expYear: varchar('expYear').notNull(),
	bin: varchar('bin').notNull(),
	bank: varchar('bank').notNull(),
	signature: varchar('signature').notNull().unique(),
	countryCode: varchar('countryCode').notNull()
});

export const Payout = pgTable('Payout', {
	id: uuid('id').primaryKey().defaultRandom(),
	storeId: uuid('storeId')
		.references(() => Store.id, { onDelete: 'cascade' })
		.notNull(),
	amount: integer('amount').notNull(),
	status: varchar('status', {
		enum: ['Pending', 'Processing', 'Completed', 'Failed']
	})
		.default('Pending')
		.notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});

export const StoreProductCategory = pgTable(
	'StoreProductCategory',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		storeId: uuid('storeId')
			.references(() => Store.id, { onDelete: 'cascade' })
			.notNull(),
		name: varchar('name').notNull(),
		description: text('description'),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
		updatedAt: timestamp('updatedAt')
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date())
	},
	table => ({
		storeNameUnique: unique().on(table.storeId, table.name)
	})
);

export const ProductCategory = pgTable('ProductCategory', {
	id: uuid('id').primaryKey().defaultRandom(),
	productId: uuid('productId')
		.references(() => Product.id, { onDelete: 'cascade' })
		.notNull(),
	name: varchar('name').notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});

export const ProductOption = pgTable('ProductOption', {
	id: uuid('id').primaryKey().defaultRandom(),
	productId: uuid('productId')
		.references(() => Product.id, { onDelete: 'cascade' })
		.notNull(),
	name: varchar('name').notNull(),
	value: varchar('value').notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});

export const ProductOptionValue = pgTable(
	'ProductOptionValue',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		optionId: uuid('optionId')
			.references(() => ProductOption.id, { onDelete: 'cascade' })
			.notNull(),
		name: varchar('name').notNull()
	},
	table => ({
		optionValueUnique: unique().on(table.optionId, table.name)
	})
);

export const ProductReview = pgTable('ProductReview', {
	id: uuid('id').primaryKey().defaultRandom(),
	productId: uuid('productId')
		.references(() => Product.id, { onDelete: 'cascade' })
		.notNull(),
	userId: uuid('userId')
		.references(() => User.id, { onDelete: 'cascade' })
		.notNull(),
	rating: integer('rating').notNull(),
	comment: text('comment'),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});

export const DeliveryAddress = pgTable('DeliveryAddress', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('userId')
		.references(() => User.id, { onDelete: 'cascade' })
		.notNull(),
	name: varchar('name').notNull()
});

export const UserPushToken = pgTable('UserPushToken', {
	userId: uuid('userId')
		.references(() => User.id, { onDelete: 'cascade' })
		.notNull(),
	token: varchar('token').notNull(),
	type: varchar('type', {
		enum: ['Shopper', 'Merchant']
	})
		.default('Shopper')
		.notNull()
});

// Define relations
export const userRelations = relations(User, ({ many }) => ({
	orders: many(Order),
	managed: many(StoreManager, { relationName: 'manager' }),
	followed: many(StoreFollower, { relationName: 'follower' }),
	carts: many(Cart),
	watchlist: many(WatchlistProduct),
	cards: many(Card),
	reviews: many(ProductReview),
	deliveryAddresses: many(DeliveryAddress)
}));

export const storeRelations = relations(Store, ({ one, many }) => ({
	image: one(Image, {
		fields: [Store.id],
		references: [Image.storeId]
	}),
	products: many(Product),
	orders: many(Order),
	managers: many(StoreManager),
	followers: many(StoreFollower),
	carts: many(Cart),
	payouts: many(Payout)
}));

export const productRelations = relations(Product, ({ one, many }) => ({
	store: one(Store, {
		fields: [Product.storeId],
		references: [Store.id]
	}),
	images: many(Image),
	orders: many(OrderProduct),
	carts: many(CartProduct),
	watchlists: many(WatchlistProduct),
	categories: many(ProductCategory),
	options: many(ProductOption),
	reviews: many(ProductReview)
}));

export const orderRelations = relations(Order, ({ one, many }) => ({
	user: one(User, {
		fields: [Order.userId],
		references: [User.id]
	}),
	store: one(Store, {
		fields: [Order.storeId],
		references: [Store.id]
	}),
	products: many(OrderProduct)
}));

export const cartRelations = relations(Cart, ({ one, many }) => ({
	user: one(User, {
		fields: [Cart.userId],
		references: [User.id]
	}),
	store: one(Store, {
		fields: [Cart.storeId],
		references: [Store.id]
	}),
	products: many(CartProduct)
}));

export const orderProductRelations = relations(OrderProduct, ({ one }) => ({
	order: one(Order, {
		fields: [OrderProduct.orderId],
		references: [Order.id]
	}),
	product: one(Product, {
		fields: [OrderProduct.productId],
		references: [Product.id]
	})
}));

export const cartProductRelations = relations(CartProduct, ({ one }) => ({
	cart: one(Cart, {
		fields: [CartProduct.cartId],
		references: [Cart.id]
	}),
	product: one(Product, {
		fields: [CartProduct.productId],
		references: [Product.id]
	}),
	user: one(User, {
		fields: [CartProduct.userId],
		references: [User.id]
	})
}));

export const watchlistProductRelations = relations(
	WatchlistProduct,
	({ one }) => ({
		user: one(User, {
			fields: [WatchlistProduct.userId],
			references: [User.id]
		}),
		product: one(Product, {
			fields: [WatchlistProduct.productId],
			references: [Product.id]
		})
	})
);

export const imageRelations = relations(Image, ({ one }) => ({
	store: one(Store, {
		fields: [Image.storeId],
		references: [Store.id]
	}),
	product: one(Product, {
		fields: [Image.productId],
		references: [Product.id]
	})
}));

export const payoutRelations = relations(Payout, ({ one }) => ({
	store: one(Store, {
		fields: [Payout.storeId],
		references: [Store.id]
	})
}));

export const storeProductCategoryRelations = relations(
	StoreProductCategory,
	({ one }) => ({
		store: one(Store, {
			fields: [StoreProductCategory.storeId],
			references: [Store.id]
		})
	})
);

export const ProductCategoryRelations = relations(
	ProductCategory,
	({ one }) => ({
		product: one(Product, {
			fields: [ProductCategory.productId],
			references: [Product.id]
		})
	})
);

export const ProductOptionRelations = relations(ProductOption, ({ one }) => ({
	product: one(Product, {
		fields: [ProductOption.productId],
		references: [Product.id]
	})
}));

export const ProductReviewRelations = relations(ProductReview, ({ one }) => ({
	product: one(Product, {
		fields: [ProductReview.productId],
		references: [Product.id]
	}),
	user: one(User, {
		fields: [ProductReview.userId],
		references: [User.id]
	})
}));

export const deliveryAddressRelations = relations(
	DeliveryAddress,
	({ one }) => ({
		user: one(User, {
			fields: [DeliveryAddress.userId],
			references: [User.id]
		})
	})
);

export const cardRelations = relations(Card, ({ one }) => ({
	user: one(User, {
		fields: [Card.userId],
		references: [User.id],
		relationName: 'cards'
	})
}));

export const storeManagerRelations = relations(StoreManager, ({ one }) => ({
	store: one(Store, {
		fields: [StoreManager.storeId],
		references: [Store.id],
		relationName: 'store'
	}),
	manager: one(User, {
		fields: [StoreManager.managerId],
		references: [User.id],
		relationName: 'manager'
	})
}));

export const storeFollowerRelations = relations(StoreFollower, ({ one }) => ({
	store: one(Store, {
		fields: [StoreFollower.storeId],
		references: [Store.id],
		relationName: 'store'
	}),
	follower: one(User, {
		fields: [StoreFollower.followerId],
		references: [User.id],
		relationName: 'follower'
	})
}));

export const productOptionRelations = relations(ProductOption, ({ one }) => ({
	product: one(Product, {
		fields: [ProductOption.productId],
		references: [Product.id],
		relationName: 'options'
	})
}));

export const productCategoryRelations = relations(
	ProductCategory,
	({ one }) => ({
		product: one(Product, {
			fields: [ProductCategory.productId],
			references: [Product.id],
			relationName: 'categories'
		})
	})
);
