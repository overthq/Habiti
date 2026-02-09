import { Router } from 'express';

import { authenticate, isAdmin, optionalAuth } from './middleware/auth';
import { validateBody } from './middleware/validation';
import { uploadImages } from './middleware/upload';

import * as OrderController from './controllers/orders';
import * as StoreController from './controllers/stores';
import * as ProductController from './controllers/products';
import * as UserController from './controllers/users';
import * as PayoutController from './controllers/payouts';
import * as CartController from './controllers/carts';
import * as AuthController from './controllers/auth';
import * as AdminController from './controllers/admin';
import * as PaymentController from './controllers/payments';
import * as SearchController from './controllers/search';
import * as WebhooksController from './controllers/webhooks';
import * as UploadController from './controllers/uploads';
import * as CurrentStoreController from './controllers/current-store';
import * as CurrentUserController from './controllers/current-user';
import { getLandingHighlights } from './controllers/highlights';
import { checkHealth } from './controllers/health';

import { createOrderSchema } from './core/validations/orders';
import { createProductSchema } from './core/validations/products';
import {
	registerBodySchema,
	authenticateBodySchema,
	verifyCodeBodySchema
} from './core/validations/auth';
import {
	bulkIdsSchema,
	bulkUserUpdateSchema,
	bulkOrderUpdateSchema,
	bulkProductUpdateSchema
} from './core/validations/admin';
import { adminCreateStoreSchema } from './core/validations/stores';

const router = Router();

// Auth
router.post(
	'/auth/register',
	validateBody(registerBodySchema),
	AuthController.register
);
router.post(
	'/auth/login',
	validateBody(authenticateBodySchema),
	AuthController.login
);
router.post(
	'/auth/verify-code',
	validateBody(verifyCodeBodySchema),
	AuthController.verify
);
router.post('/auth/apple-callback', AuthController.appleCallback);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/logout', AuthController.logout);

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
currentStoreRouter.put('/', CurrentStoreController.updateStore);
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
currentStoreRouter.get('/payouts', CurrentStoreController.getPayouts);
currentStoreRouter.get('/payouts/:id', CurrentStoreController.getPayoutById);
currentStoreRouter.get('/overview', CurrentStoreController.getOverview);
currentStoreRouter.get('/orders', CurrentStoreController.getOrders);
currentStoreRouter.get('/orders/:id', CurrentStoreController.getOrderById);
currentStoreRouter.get('/managers', CurrentStoreController.getManagers);
currentStoreRouter.get('/customers/:id', CurrentStoreController.getCustomer);
currentStoreRouter.post('/products', CurrentStoreController.createProduct);
currentStoreRouter.put('/products/:id', CurrentStoreController.updateProduct);
currentStoreRouter.put(
	'/products/:id/categories',
	CurrentStoreController.updateProductCategories
);
currentStoreRouter.put('/orders/:id', CurrentStoreController.updateOrder);
currentStoreRouter.post('/payouts', CurrentStoreController.createPayout);
currentStoreRouter.post(
	'/verify-bank-account',
	CurrentStoreController.verifyBankAccount
);
currentStoreRouter.get('/categories', CurrentStoreController.getCategories);
currentStoreRouter.post('/categories', CurrentStoreController.createCategory);
currentStoreRouter.put(
	'/categories/:id',
	CurrentStoreController.updateCategory
);
currentStoreRouter.delete(
	'/categories/:id',
	CurrentStoreController.deleteCategory
);

router.use('/stores/current', currentStoreRouter);

// Stores (must come after /stores/current mount)
router.post('/stores', authenticate, StoreController.createStore);
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
currentUserRouter.put('/', CurrentUserController.updateUser);
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
	validateBody(createOrderSchema),
	CurrentUserController.createOrder
);
currentUserRouter.post('/cards/authorize', CurrentUserController.authorizeCard);
currentUserRouter.delete('/cards/:cardId', CurrentUserController.deleteCard);

router.use('/users/current', currentUserRouter);

// Carts
router.get('/carts', optionalAuth, CartController.getCartsFromList);
router.get('/carts/:id', optionalAuth, CartController.getCartById);
router.post('/carts/products', optionalAuth, CartController.addProductToCart);
router.put(
	'/carts/:id/products/:productId',
	authenticate,
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
	validateBody(authenticateBodySchema),
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
	validateBody(adminCreateStoreSchema),
	AdminController.createStore
);
adminRouter.get('/stores/:id/managers', StoreController.getStoreManagers);
adminRouter.get('/stores/:id/payouts', StoreController.getStorePayouts);
adminRouter.get('/stores/:id/orders', StoreController.getStoreOrders);
adminRouter.get('/products', ProductController.getProducts);
adminRouter.post(
	'/products',
	validateBody(createProductSchema),
	ProductController.createProduct
);
adminRouter.delete('/products/:id', ProductController.deleteProduct);
adminRouter.get('/products/:id/reviews', ProductController.getProductReviews);
adminRouter.get('/users', UserController.getUsers);
adminRouter.get('/users/:id', UserController.getUser);
adminRouter.get('/payouts', PayoutController.getPayouts);
adminRouter.get('/payouts/:id', PayoutController.getPayout);
adminRouter.patch('/payouts/:id', PayoutController.updatePayout);
adminRouter.get('/orders', OrderController.getOrders);
adminRouter.post(
	'/users/bulk',
	validateBody(bulkUserUpdateSchema),
	AdminController.bulkUpdateUsers
);
adminRouter.delete(
	'/users/bulk',
	validateBody(bulkIdsSchema),
	AdminController.bulkDeleteUsers
);
adminRouter.post(
	'/orders/bulk',
	validateBody(bulkOrderUpdateSchema),
	AdminController.bulkUpdateOrders
);
adminRouter.delete(
	'/orders/bulk',
	validateBody(bulkIdsSchema),
	AdminController.bulkDeleteOrders
);
adminRouter.post(
	'/products/bulk',
	validateBody(bulkProductUpdateSchema),
	AdminController.bulkUpdateProducts
);
adminRouter.delete(
	'/products/bulk',
	validateBody(bulkIdsSchema),
	AdminController.bulkDeleteProducts
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
	PaymentController.verifyTransaction
);
router.post('/payments/verify-transfer', PaymentController.verifyTransfer);
router.post('/payments/approve-payment', PaymentController.approvePayment);

// Search
router.get('/search', SearchController.globalSearch);

// Landing
router.get('/landing/highlights', optionalAuth, getLandingHighlights);

// Webhooks
router.post('/webhooks/paystack', WebhooksController.paystackWebhook);

export default router;
