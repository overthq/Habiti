import { Router } from 'express';

import { authenticate, isAdmin, optionalAuth } from './middleware/auth';
import { validateBody, validateQuery } from './middleware/validation';
import { uploadImages } from './middleware/upload';

import * as OrderController from './controllers/orders';
import * as StoreController from './controllers/stores';
import * as ProductController from './controllers/products';
import * as UserController from './controllers/users';
import * as CartController from './controllers/carts';
import * as AuthController from './controllers/auth';
import * as AdminController from './controllers/admin';
import * as PaymentController from './controllers/payments';
import * as SearchController from './controllers/search';
import * as WebhooksController from './controllers/webhooks';
import * as UploadController from './controllers/uploads';
import * as CurrentStoreController from './controllers/current-store';
import * as CurrentUserController from './controllers/current-user';
import * as TransactionController from './controllers/transactions';
import { getLandingHighlights } from './controllers/highlights';
import { checkHealth } from './controllers/health';

import * as Schemas from './core/validations/rest';

const router = Router();

// Auth
router.post(
	'/auth/register',
	validateBody(Schemas.registerBodySchema),
	AuthController.register
);
router.post(
	'/auth/login',
	validateBody(Schemas.authenticateBodySchema),
	AuthController.login
);
router.post(
	'/auth/verify-code',
	validateBody(Schemas.verifyCodeBodySchema),
	AuthController.verify
);
router.post(
	'/auth/apple-callback',
	validateBody(Schemas.appleCallbackBodySchema),
	AuthController.appleCallback
);
router.post(
	'/auth/refresh',
	validateBody(Schemas.refreshBodySchema),
	AuthController.refresh
);
router.post(
	'/auth/logout',
	validateBody(Schemas.logoutBodySchema),
	AuthController.logout
);

// Products
router.get('/products/:id', optionalAuth, ProductController.getProductById);
router.get(
	'/products/:id/reviews',
	optionalAuth,
	ProductController.getProductReviews
);
router.post(
	'/products/:id/reviews',
	authenticate,
	validateBody(Schemas.createReviewBodySchema),
	ProductController.createProductReview
);
router.get(
	'/products/:id/related',
	optionalAuth,
	ProductController.getRelatedProducts
);

// Current Store (all routes require authenticate)
const currentStoreRouter = Router();
currentStoreRouter.use(authenticate);

currentStoreRouter.get('/', CurrentStoreController.getStore);
currentStoreRouter.put(
	'/',
	validateBody(Schemas.updateStoreBodySchema),
	CurrentStoreController.updateStore
);
currentStoreRouter.get('/products', CurrentStoreController.getProducts);
currentStoreRouter.get('/products/:id', CurrentStoreController.getProductById);
currentStoreRouter.get(
	'/products/:id/reviews',
	CurrentStoreController.getProductReviews
);
currentStoreRouter.delete(
	'/products/:id',
	CurrentStoreController.deleteProduct
);
currentStoreRouter.get('/overview', CurrentStoreController.getOverview);
currentStoreRouter.get('/orders', CurrentStoreController.getOrders);
currentStoreRouter.get('/orders/:id', CurrentStoreController.getOrderById);
currentStoreRouter.get('/managers', CurrentStoreController.getManagers);
currentStoreRouter.get('/customers/:id', CurrentStoreController.getCustomer);
currentStoreRouter.post(
	'/products',
	validateBody(Schemas.storeCreateProductBodySchema),
	CurrentStoreController.createProduct
);
currentStoreRouter.put(
	'/products/:id',
	validateBody(Schemas.storeUpdateProductBodySchema),
	CurrentStoreController.updateProduct
);
currentStoreRouter.put(
	'/products/:id/categories',
	validateBody(Schemas.updateProductCategoriesBodySchema),
	CurrentStoreController.updateProductCategories
);
currentStoreRouter.put(
	'/orders/:id',
	validateBody(Schemas.updateOrderStatusBodySchema),
	CurrentStoreController.updateOrder
);
currentStoreRouter.post(
	'/payouts',
	validateBody(Schemas.createPayoutBodySchema),
	CurrentStoreController.createPayout
);
currentStoreRouter.post(
	'/verify-bank-account',
	validateBody(Schemas.verifyBankAccountBodySchema),
	CurrentStoreController.verifyBankAccount
);
currentStoreRouter.get(
	'/transactions',
	TransactionController.getStoreTransactions
);
currentStoreRouter.get(
	'/transactions/:id',
	TransactionController.getTransaction
);
currentStoreRouter.get('/categories', CurrentStoreController.getCategories);
currentStoreRouter.post(
	'/categories',
	validateBody(Schemas.createCategoryBodySchema),
	CurrentStoreController.createCategory
);
currentStoreRouter.put(
	'/categories/:id',
	validateBody(Schemas.updateCategoryBodySchema),
	CurrentStoreController.updateCategory
);
currentStoreRouter.delete(
	'/categories/:id',
	CurrentStoreController.deleteCategory
);
currentStoreRouter.get('/addresses', CurrentStoreController.getAddresses);
currentStoreRouter.post(
	'/addresses',
	validateBody(Schemas.createAddressBodySchema),
	CurrentStoreController.createAddress
);
currentStoreRouter.put(
	'/addresses/:id',
	validateBody(Schemas.updateAddressBodySchema),
	CurrentStoreController.updateAddress
);
currentStoreRouter.delete(
	'/addresses/:id',
	CurrentStoreController.deleteAddress
);

router.use('/stores/current', currentStoreRouter);

// Stores (must come after /stores/current mount)
router.post(
	'/stores',
	authenticate,
	validateBody(Schemas.createStoreBodySchema),
	StoreController.createStore
);
router.delete('/stores/:id', authenticate, StoreController.deleteStore);
router.post('/stores/:id/follow', authenticate, StoreController.followStore);
router.post(
	'/stores/:id/unfollow',
	authenticate,
	StoreController.unfollowStore
);
router.get('/stores/:id', optionalAuth, StoreController.getStoreById);
router.get(
	'/stores/:id/products',
	optionalAuth,
	StoreController.getStoreProducts
);

// Current User (all routes require authenticate)
const currentUserRouter = Router();
currentUserRouter.use(authenticate);

currentUserRouter.get('/', CurrentUserController.getUser);
currentUserRouter.put(
	'/',
	validateBody(Schemas.updateUserBodySchema),
	CurrentUserController.updateUser
);
currentUserRouter.delete('/', CurrentUserController.deleteUser);
currentUserRouter.get(
	'/followed-stores',
	CurrentUserController.getFollowedStores
);
currentUserRouter.get(
	'/managed-stores',
	CurrentUserController.getManagedStores
);
currentUserRouter.get('/orders', CurrentUserController.getOrders);
currentUserRouter.get('/carts', CurrentUserController.getCarts);
currentUserRouter.get('/carts/:id', CurrentUserController.getCartById);
currentUserRouter.get('/cards', CurrentUserController.getCards);
currentUserRouter.get(
	'/delivery-addresses',
	CurrentUserController.getDeliveryAddresses
);
currentUserRouter.get('/orders/:id', CurrentUserController.getOrderById);
currentUserRouter.post(
	'/orders',
	validateBody(Schemas.createOrderSchema),
	CurrentUserController.createOrder
);
currentUserRouter.post(
	'/orders/:id/confirm-pickup',
	CurrentUserController.confirmPickup
);
currentUserRouter.post(
	'/cards/authorize',
	validateBody(Schemas.authorizeCardBodySchema),
	CurrentUserController.authorizeCard
);
currentUserRouter.delete('/cards/:cardId', CurrentUserController.deleteCard);
currentUserRouter.get('/watchlist', CurrentUserController.getWatchlist);
currentUserRouter.post(
	'/watchlist',
	validateBody(Schemas.addToWatchlistBodySchema),
	CurrentUserController.addToWatchlist
);
currentUserRouter.get('/push-tokens', CurrentUserController.getPushTokens);
currentUserRouter.post(
	'/push-tokens',
	validateBody(Schemas.savePushTokenBodySchema),
	CurrentUserController.savePushToken
);
currentUserRouter.delete(
	'/push-tokens/:token',
	validateBody(Schemas.deletePushTokenBodySchema),
	CurrentUserController.deletePushToken
);

router.use('/users/current', currentUserRouter);

// Carts
router.get(
	'/carts',
	optionalAuth,
	validateQuery(Schemas.getCartsQuerySchema),
	CartController.getCartsFromList
);
router.get('/carts/:id', optionalAuth, CartController.getCartById);
router.post(
	'/carts/products',
	optionalAuth,
	validateBody(Schemas.addProductToCartBodySchema),
	CartController.addProductToCart
);
router.put(
	'/carts/:id/products/:productId',
	authenticate,
	validateBody(Schemas.updateCartProductBodySchema),
	CartController.updateCartProductQuantity
);
router.delete(
	'/carts/:id/products/:productId',
	authenticate,
	CartController.removeProductFromCart
);

// Admin
const adminRouter = Router();

// Public admin routes (no auth)
adminRouter.post(
	'/login',
	validateBody(Schemas.adminLoginBodySchema),
	AdminController.login
);
adminRouter.post('/refresh', AdminController.refresh);
adminRouter.post('/logout', AdminController.logout);

// Protected admin routes (all require isAdmin)
adminRouter.use(isAdmin);
adminRouter.get('/overview', AdminController.getOverview);
adminRouter.get('/stores', StoreController.getStores);
adminRouter.post(
	'/stores',
	validateBody(Schemas.adminCreateStoreSchema),
	AdminController.createStore
);
adminRouter.get('/stores/:id/managers', StoreController.getStoreManagers);
adminRouter.get(
	'/stores/:id/transactions',
	TransactionController.getAdminStoreTransactions
);
adminRouter.get('/stores/:id/orders', StoreController.getStoreOrders);
adminRouter.get('/stores/:id', StoreController.getStoreById);
adminRouter.put(
	'/stores/:id',
	validateBody(Schemas.adminUpdateStoreBodySchema),
	StoreController.updateStore
);
adminRouter.get('/products', ProductController.getProducts);
adminRouter.post(
	'/products',
	validateBody(Schemas.createProductSchema),
	ProductController.createProduct
);
adminRouter.get('/products/:id', ProductController.getProductById);
adminRouter.put(
	'/products/:id',
	validateBody(Schemas.adminUpdateProductBodySchema),
	ProductController.updateProduct
);
adminRouter.delete('/products/:id', ProductController.deleteProduct);
adminRouter.get('/products/:id/reviews', ProductController.getProductReviews);
adminRouter.get('/users', UserController.getUsers);
adminRouter.get('/users/:id', UserController.getUser);
adminRouter.put(
	'/users/:id',
	validateBody(Schemas.adminUpdateUserBodySchema),
	UserController.updateUser
);
adminRouter.patch(
	'/transactions/:id',
	validateBody(Schemas.adminUpdateTransactionBodySchema),
	TransactionController.updateTransaction
);
adminRouter.get('/orders', OrderController.getOrders);
adminRouter.get('/orders/:id', OrderController.getOrderById);
adminRouter.put(
	'/orders/:id',
	validateBody(Schemas.adminUpdateOrderBodySchema),
	OrderController.updateOrder
);
adminRouter.post(
	'/users/bulk',
	validateBody(Schemas.bulkUserUpdateSchema),
	AdminController.bulkUpdateUsers
);
adminRouter.delete(
	'/users/bulk',
	validateBody(Schemas.bulkIdsSchema),
	AdminController.bulkDeleteUsers
);
adminRouter.post(
	'/orders/bulk',
	validateBody(Schemas.bulkOrderUpdateSchema),
	AdminController.bulkUpdateOrders
);
adminRouter.delete(
	'/orders/bulk',
	validateBody(Schemas.bulkIdsSchema),
	AdminController.bulkDeleteOrders
);
adminRouter.post(
	'/products/bulk',
	validateBody(Schemas.bulkProductUpdateSchema),
	AdminController.bulkUpdateProducts
);
adminRouter.delete(
	'/products/bulk',
	validateBody(Schemas.bulkIdsSchema),
	AdminController.bulkDeleteProducts
);
adminRouter.post(
	'/stores/bulk',
	validateBody(Schemas.bulkStoreUpdateSchema),
	AdminController.bulkUpdateStores
);
adminRouter.delete(
	'/stores/bulk',
	validateBody(Schemas.bulkIdsSchema),
	AdminController.bulkDeleteStores
);

router.use('/admin', adminRouter);

// Uploads
router.post(
	'/uploads/images',
	authenticate,
	uploadImages.array('images', 10),
	UploadController.uploadImages
);

// Health
router.get('/health', checkHealth);

// Payments
router.post(
	'/payments/verify-transaction',
	validateBody(Schemas.verifyTransactionBodySchema),
	PaymentController.verifyTransaction
);
router.post(
	'/payments/verify-transfer',
	validateBody(Schemas.verifyTransferBodySchema),
	PaymentController.verifyTransfer
);
router.post('/payments/approve-payment', PaymentController.approvePayment);

// Search
router.get(
	'/search',
	optionalAuth,
	validateQuery(Schemas.searchQuerySchema),
	SearchController.globalSearch
);

// Landing
router.get('/landing/highlights', optionalAuth, getLandingHighlights);

// Webhooks
router.post('/webhooks/paystack', WebhooksController.paystackWebhook);

export default router;
