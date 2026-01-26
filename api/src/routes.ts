import { Router } from 'express';

import { authenticate, isAdmin, optionalAuth } from './middleware/auth';
import { validateBody } from './middleware/validation';

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
import * as CardController from './controllers/cards';

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

const router: Router = Router();

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

// Stores
router.post('/stores', authenticate, StoreController.createStore);
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

// Current Store
router.get('/stores/current', authenticate, StoreController.getCurrentStore);
router.put('/stores/current', authenticate, StoreController.updateStore);
router.get(
	'/stores/current/products',
	authenticate,
	StoreController.getStoreProducts
);
router.get(
	'/stores/current/products/:id',
	authenticate,
	ProductController.getProductById
);
router.get(
	'/stores/current/products/:id/reviews',
	authenticate,
	ProductController.getProductReviews
);
router.delete(
	'/stores/current/products/:id',
	authenticate,
	ProductController.deleteProduct
);

// Current User
router.get('/users/current', authenticate, UserController.getCurrentUser);
router.put('/users/current', authenticate, UserController.updateCurrentUser);

router.get(
	'/users/current/followed-stores',
	authenticate,
	UserController.getFollowedStores
);
router.get(
	'/users/current/managed-stores',
	authenticate,
	UserController.getManagedStores
);
router.get('/users/current/orders', authenticate, UserController.getOrders);
router.get('/users/current/carts', authenticate, UserController.getCarts);
router.get('/users/current/cards', authenticate, UserController.getCards);
router.get(
	'/users/current/delivery-addresses',
	authenticate,
	UserController.getDeliveryAddresses
);
router.get(
	'/users/current/orders/:id',
	authenticate,
	OrderController.getOrderById
);
router.post(
	'/users/current/orders',
	authenticate,
	validateBody(createOrderSchema),
	OrderController.createOrder
);

// Cards
router.post(
	'/users/current/cards/authorize',
	authenticate,
	CardController.authorizeCard
);
router.delete(
	'/users/current/cards/:cardId',
	authenticate,
	CardController.deleteCard
);

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
router.post(
	'/admin/login',
	validateBody(authenticateBodySchema),
	AdminController.login
);
router.post('/admin/refresh', AdminController.refresh);
router.post('/admin/logout', AdminController.logout);
router.get('/admin/overview', isAdmin, AdminController.getOverview);

router.get('/admin/stores', isAdmin, StoreController.getStores);
router.post(
	'/admin/stores',
	isAdmin,
	validateBody(adminCreateStoreSchema),
	AdminController.createStore
);
router.get(
	'/admin/stores/:id/managers',
	isAdmin,
	StoreController.getStoreManagers
);
router.get(
	'/admin/stores/:id/payouts',
	isAdmin,
	StoreController.getStorePayouts
);
router.get('/admin/stores/:id/orders', isAdmin, StoreController.getStoreOrders);
router.get('/admin/products', isAdmin, ProductController.getProducts);
router.post(
	'/admin/products',
	isAdmin,
	validateBody(createProductSchema),
	ProductController.createProduct
);
router.delete('/admin/products/:id', isAdmin, ProductController.deleteProduct);
router.get(
	'/admin/products/:id/reviews',
	isAdmin,
	ProductController.getProductReviews
);
router.get('/admin/users', isAdmin, UserController.getUsers);
router.get('/admin/users/:id', isAdmin, UserController.getUser);
router.get('/admin/payouts', isAdmin, PayoutController.getPayouts);
router.get('/admin/payouts/:id', isAdmin, PayoutController.getPayout);
router.patch('/admin/payouts/:id', isAdmin, PayoutController.updatePayout);
router.get('/admin/orders', isAdmin, OrderController.getOrders);

// Admin Bulk Operations - Users
router.post(
	'/admin/users/bulk',
	isAdmin,
	validateBody(bulkUserUpdateSchema),
	AdminController.bulkUpdateUsers
);
router.delete(
	'/admin/users/bulk',
	isAdmin,
	validateBody(bulkIdsSchema),
	AdminController.bulkDeleteUsers
);

// Admin Bulk Operations - Orders
router.post(
	'/admin/orders/bulk',
	isAdmin,
	validateBody(bulkOrderUpdateSchema),
	AdminController.bulkUpdateOrders
);
router.delete(
	'/admin/orders/bulk',
	isAdmin,
	validateBody(bulkIdsSchema),
	AdminController.bulkDeleteOrders
);

// Admin Bulk Operations - Products
router.post(
	'/admin/products/bulk',
	isAdmin,
	validateBody(bulkProductUpdateSchema),
	AdminController.bulkUpdateProducts
);
router.delete(
	'/admin/products/bulk',
	isAdmin,
	validateBody(bulkIdsSchema),
	AdminController.bulkDeleteProducts
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
