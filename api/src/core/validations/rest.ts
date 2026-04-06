import { z } from 'zod';
import {
	OrderStatus,
	ProductStatus,
	TransactionStatus,
	TransactionType,
	PushTokenType
} from '../../generated/prisma/client';

// ─── Auth ───────────────────────────────────────────────────────────────────

export const registerBodySchema = z.object({
	name: z.string(),
	email: z.string().email()
});
export type RegisterBody = z.infer<typeof registerBodySchema>;

export const authenticateBodySchema = z.object({
	email: z.string().email()
});
export type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

export const verifyCodeBodySchema = z.object({
	email: z.string().email(),
	code: z.string(),
	cartIds: z.array(z.string()).optional()
});
export type VerifyCodeBody = z.infer<typeof verifyCodeBodySchema>;

export const appleCallbackBodySchema = z.object({
	code: z.string()
});
export type AppleCallbackBody = z.infer<typeof appleCallbackBodySchema>;

export const refreshBodySchema = z.object({
	refreshToken: z.string().optional()
});
export type RefreshBody = z.infer<typeof refreshBodySchema>;

export const logoutBodySchema = z.object({
	refreshToken: z.string().optional()
});
export type LogoutBody = z.infer<typeof logoutBodySchema>;

// ─── Products ───────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	unitPrice: z.number().min(0),
	quantity: z.number().min(0),
	storeId: z.string().min(1)
});
export type CreateProductBody = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	unitPrice: z.number().min(0),
	quantity: z.number().min(0),
	storeId: z.string().min(1)
});
export type UpdateProductBody = z.infer<typeof updateProductSchema>;

export const createProductReviewSchema = z.object({
	productId: z.string().min(1),
	rating: z.number().min(1).max(5),
	comment: z.string().min(1)
});
export type CreateProductReviewBody = z.infer<typeof createProductReviewSchema>;

export const updateProductReviewSchema = z.object({
	productId: z.string().min(1),
	rating: z.number().min(1).max(5),
	comment: z.string().min(1)
});
export type UpdateProductReviewBody = z.infer<typeof updateProductReviewSchema>;

export const getRelatedProductsSchema = z.object({
	productId: z.string().min(1)
});
export type GetRelatedProductsParams = z.infer<typeof getRelatedProductsSchema>;

export const createReviewBodySchema = z.object({
	rating: z.number().min(1).max(5),
	body: z.string().min(1)
});
export type CreateReviewBody = z.infer<typeof createReviewBodySchema>;

// ─── Stores (Public) ────────────────────────────────────────────────────────

export const createStoreBodySchema = z.object({
	name: z.string().min(1),
	description: z.string(),
	website: z.string().optional(),
	twitter: z.string().optional(),
	instagram: z.string().optional()
});
export type CreateStoreBody = z.infer<typeof createStoreBodySchema>;

// ─── Current Store ──────────────────────────────────────────────────────────

export const updateStoreBodySchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	website: z.string().optional(),
	twitter: z.string().optional(),
	instagram: z.string().optional(),
	unlisted: z.boolean().optional(),
	imageUrl: z.string().optional(),
	imagePublicId: z.string().optional(),
	bankAccountNumber: z.string().optional(),
	bankCode: z.string().optional()
});
export type UpdateStoreBody = z.infer<typeof updateStoreBodySchema>;

export const storeCreateProductBodySchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	unitPrice: z.number().min(0),
	quantity: z.number().min(0)
});
export type StoreCreateProductBody = z.infer<
	typeof storeCreateProductBodySchema
>;

export const storeUpdateProductBodySchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	unitPrice: z.number().min(0).optional(),
	quantity: z.number().min(0).optional(),
	images: z
		.array(z.object({ path: z.string(), publicId: z.string() }))
		.optional()
});
export type StoreUpdateProductBody = z.infer<
	typeof storeUpdateProductBodySchema
>;

export const updateProductCategoriesBodySchema = z.object({
	add: z.array(z.string()),
	remove: z.array(z.string())
});
export type UpdateProductCategoriesBody = z.infer<
	typeof updateProductCategoriesBodySchema
>;

export const updateOrderStatusBodySchema = z.object({
	status: z.nativeEnum(OrderStatus)
});
export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusBodySchema>;

export const createPayoutBodySchema = z.object({
	amount: z.number().min(0)
});
export type CreatePayoutBody = z.infer<typeof createPayoutBodySchema>;

export const verifyBankAccountBodySchema = z.object({
	bankAccountNumber: z.string(),
	bankCode: z.string()
});
export type VerifyBankAccountBody = z.infer<typeof verifyBankAccountBodySchema>;

export const createCategoryBodySchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1)
});
export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export const updateCategoryBodySchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1)
});
export type UpdateCategoryBody = z.infer<typeof updateCategoryBodySchema>;

export const createAddressBodySchema = z.object({
	name: z.string(),
	line1: z.string(),
	line2: z.string().optional(),
	city: z.string(),
	state: z.string(),
	country: z.string(),
	postcode: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional()
});
export type CreateAddressBody = z.infer<typeof createAddressBodySchema>;

export const updateAddressBodySchema = createAddressBodySchema;
export type UpdateAddressBody = z.infer<typeof updateAddressBodySchema>;

// ─── Orders ─────────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
	cartId: z.string(),
	cardId: z
		.string()
		.nullable()
		.optional()
		.transform(val => val ?? undefined)
});
export type CreateOrderBody = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = z.object({
	orderId: z.string(),
	status: z.nativeEnum(OrderStatus)
});
export type UpdateOrderBody = z.infer<typeof updateOrderSchema>;

// ─── Current User ───────────────────────────────────────────────────────────

export const updateUserBodySchema = z.object({
	name: z.string(),
	email: z.string().email()
});
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;

export const authorizeCardBodySchema = z.object({
	orderId: z.string()
});
export type AuthorizeCardBody = z.infer<typeof authorizeCardBodySchema>;

export const addToWatchlistBodySchema = z.object({
	productId: z.string()
});
export type AddToWatchlistBody = z.infer<typeof addToWatchlistBodySchema>;

export const savePushTokenBodySchema = z.object({
	token: z.string(),
	type: z.nativeEnum(PushTokenType)
});
export type SavePushTokenBody = z.infer<typeof savePushTokenBodySchema>;

export const deletePushTokenBodySchema = z.object({
	type: z.nativeEnum(PushTokenType)
});
export type DeletePushTokenBody = z.infer<typeof deletePushTokenBodySchema>;

// ─── Carts ──────────────────────────────────────────────────────────────────

export const getCartsQuerySchema = z.object({
	cartIds: z
		.union([z.string(), z.array(z.string())])
		.transform(val => (Array.isArray(val) ? val : [val]))
});
export type GetCartsQuery = z.infer<typeof getCartsQuerySchema>;

export const addProductToCartBodySchema = z.object({
	storeId: z.string(),
	productId: z.string(),
	quantity: z.number().min(1),
	cartId: z.string().optional()
});
export type AddProductToCartBody = z.infer<typeof addProductToCartBodySchema>;

export const updateCartProductBodySchema = z.object({
	quantity: z.number().min(0)
});
export type UpdateCartProductBody = z.infer<typeof updateCartProductBodySchema>;

// ─── Admin ──────────────────────────────────────────────────────────────────

export const adminLoginBodySchema = z.object({
	email: z.string().email(),
	password: z.string()
});
export type AdminLoginBody = z.infer<typeof adminLoginBodySchema>;

export const adminCreateStoreSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional()
});
export type AdminCreateStoreBody = z.infer<typeof adminCreateStoreSchema>;

export const adminUpdateStoreBodySchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	website: z.string().optional(),
	twitter: z.string().optional(),
	instagram: z.string().optional(),
	unlisted: z.boolean().optional(),
	imageUrl: z.string().optional(),
	imagePublicId: z.string().optional(),
	bankAccountNumber: z.string().optional(),
	bankCode: z.string().optional()
});
export type AdminUpdateStoreBody = z.infer<typeof adminUpdateStoreBodySchema>;

export const adminUpdateProductBodySchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	unitPrice: z.number().min(0).optional(),
	quantity: z.number().min(0).optional(),
	images: z
		.array(z.object({ path: z.string(), publicId: z.string() }))
		.optional()
});
export type AdminUpdateProductBody = z.infer<
	typeof adminUpdateProductBodySchema
>;

export const adminUpdateUserBodySchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional()
});
export type AdminUpdateUserBody = z.infer<typeof adminUpdateUserBodySchema>;

export const adminUpdateOrderBodySchema = z.object({
	status: z.nativeEnum(OrderStatus)
});
export type AdminUpdateOrderBody = z.infer<typeof adminUpdateOrderBodySchema>;

export const adminUpdateTransactionBodySchema = z.object({
	status: z.nativeEnum(TransactionStatus)
});
export type AdminUpdateTransactionBody = z.infer<
	typeof adminUpdateTransactionBodySchema
>;

export const bulkIdsSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required')
});
export type BulkIdsBody = z.infer<typeof bulkIdsSchema>;

export const bulkUserUpdateSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required'),
	field: z.literal('suspended'),
	value: z.boolean()
});
export type BulkUserUpdateBody = z.infer<typeof bulkUserUpdateSchema>;

export const bulkOrderUpdateSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required'),
	field: z.literal('status'),
	value: z.enum(['Pending', 'Completed', 'Cancelled', 'PaymentPending'])
});
export type BulkOrderUpdateBody = z.infer<typeof bulkOrderUpdateSchema>;

export const bulkProductUpdateSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required'),
	field: z.literal('status'),
	value: z.enum(['Active', 'Draft'])
});
export type BulkProductUpdateBody = z.infer<typeof bulkProductUpdateSchema>;

export const bulkStoreUpdateSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required'),
	field: z.literal('unlisted'),
	value: z.boolean()
});
export type BulkStoreUpdateBody = z.infer<typeof bulkStoreUpdateSchema>;

// ─── Payments ───────────────────────────────────────────────────────────────

export const verifyTransactionBodySchema = z.object({
	reference: z.string()
});
export type VerifyTransactionBody = z.infer<typeof verifyTransactionBodySchema>;

export const verifyTransferBodySchema = z.object({
	transferId: z.string()
});
export type VerifyTransferBody = z.infer<typeof verifyTransferBodySchema>;

// TODO: Define a proper schema for POST /payments/approve-payment
// once the Paystack approval body shape is fully understood.

// ─── Search ─────────────────────────────────────────────────────────────────

export const searchQuerySchema = z.object({
	query: z.string().min(1)
});
export type SearchQuery = z.infer<typeof searchQuerySchema>;

// ─── Filters (Query Schemas) ────────────────────────────────────────────────

export const userFiltersSchema = z.object({
	search: z.string().optional(),
	suspended: z
		.union([z.boolean(), z.enum(['true', 'false'])])
		.transform(val => (typeof val === 'string' ? val === 'true' : val))
		.optional(),
	orderBy: z
		.object({
			name: z.enum(['asc', 'desc']).optional(),
			email: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional()
		})
		.optional()
});

export type UserFilters = z.infer<typeof userFiltersSchema>;

export const productFiltersSchema = z.object({
	search: z.string().optional(),
	categoryId: z.string().optional(),
	storeId: z.string().optional(),
	status: z.nativeEnum(ProductStatus).optional(),
	inStock: z
		.union([z.boolean(), z.enum(['true', 'false'])])
		.transform(val => (typeof val === 'string' ? val === 'true' : val))
		.optional(),
	minPrice: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional(),
	maxPrice: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional(),
	orderBy: z
		.object({
			unitPrice: z.enum(['asc', 'desc']).optional(),
			quantity: z.enum(['asc', 'desc']).optional(),
			name: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional()
		})
		.optional()
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;

export const orderFiltersSchema = z.object({
	status: z.nativeEnum(OrderStatus).optional(),
	storeId: z.string().optional(),
	userId: z.string().optional(),
	minTotal: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional(),
	maxTotal: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	orderBy: z
		.object({
			total: z.enum(['asc', 'desc']).optional(),
			createdAt: z.enum(['asc', 'desc']).optional(),
			updatedAt: z.enum(['asc', 'desc']).optional()
		})
		.optional()
});

export type OrderFilters = z.infer<typeof orderFiltersSchema>;

export const transactionFiltersQuerySchema = z.object({
	type: z.nativeEnum(TransactionType).optional(),
	status: z.nativeEnum(TransactionStatus).optional(),
	from: z.string().optional(),
	to: z.string().optional(),
	limit: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional(),
	offset: z
		.union([z.number(), z.string()])
		.transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
		.optional()
});

export type TransactionFilters = z.infer<typeof transactionFiltersQuerySchema>;
