import type { Prisma } from '../../generated/prisma/client';

// Every response is built from these selects, so a column only reaches a
// client once it is listed here. The admin variants add what only the admin
// panel may see; everything else is shared by shoppers and store managers.

export const image = { id: true, path: true } satisfies Prisma.ImageSelect;

export const adminImage = {
	...image,
	publicId: true
} satisfies Prisma.ImageSelect;

export const publicUser = { id: true, name: true } satisfies Prisma.UserSelect;

export const currentUser = {
	...publicUser,
	email: true,
	isAnonymous: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.UserSelect;

export const adminUser = {
	...currentUser,
	suspended: true
} satisfies Prisma.UserSelect;

const storeColumns = {
	id: true,
	name: true,
	description: true,
	website: true,
	twitter: true,
	instagram: true,
	whatsapp: true,
	unlisted: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.StoreSelect;

export const store = {
	...storeColumns,
	image: { select: image }
} satisfies Prisma.StoreSelect;

export const adminStore = {
	...storeColumns,
	unrealizedRevenue: true,
	realizedRevenue: true,
	paidOut: true,
	pendingPayouts: true,
	orderCount: true,
	image: { select: adminImage }
} satisfies Prisma.StoreSelect;

const productColumns = {
	id: true,
	name: true,
	description: true,
	unitPrice: true,
	quantity: true,
	storeId: true,
	status: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.ProductSelect;

export const product = {
	...productColumns,
	images: { select: image }
} satisfies Prisma.ProductSelect;

export const adminProduct = {
	...productColumns,
	images: { select: adminImage }
} satisfies Prisma.ProductSelect;

export const category = {
	id: true,
	storeId: true,
	name: true,
	description: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.StoreProductCategorySelect;

export const productCategory = {
	productId: true,
	categoryId: true,
	createdAt: true,
	updatedAt: true,
	category: { select: category }
} satisfies Prisma.ProductCategorySelect;

export const review = {
	id: true,
	userId: true,
	productId: true,
	body: true,
	rating: true,
	createdAt: true,
	updatedAt: true,
	user: { select: publicUser }
} satisfies Prisma.ProductReviewSelect;

export const address = {
	id: true,
	name: true,
	line1: true,
	line2: true,
	city: true,
	state: true,
	country: true,
	postcode: true,
	latitude: true,
	longitude: true,
	userId: true,
	storeId: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.AddressSelect;

export const order = {
	id: true,
	serialNumber: true,
	userId: true,
	storeId: true,
	status: true,
	transactionFee: true,
	serviceFee: true,
	total: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.OrderSelect;

export const orderProduct = {
	orderId: true,
	productId: true,
	unitPrice: true,
	quantity: true
} satisfies Prisma.OrderProductSelect;

export const cart = {
	id: true,
	userId: true,
	storeId: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.CartSelect;

export const cartProduct = {
	cartId: true,
	productId: true,
	quantity: true
} satisfies Prisma.CartProductSelect;

export const card = {
	id: true,
	userId: true,
	email: true,
	cardType: true,
	last4: true,
	expMonth: true,
	expYear: true,
	bank: true,
	countryCode: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.CardSelect;

export const storeManager = {
	storeId: true,
	managerId: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.StoreManagerSelect;

export const transaction = {
	id: true,
	storeId: true,
	type: true,
	status: true,
	amount: true,
	description: true,
	orderId: true,
	payoutId: true,
	balanceAfter: true,
	createdAt: true,
	updatedAt: true,
	order: { select: order }
} satisfies Prisma.TransactionSelect;
