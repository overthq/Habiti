import { Router } from 'express';

import { getOrderById, createOrder, getOrders } from './controllers/orders';
import { authenticate, isAdmin, optionalAuth } from './middleware/auth';
import { validateBody } from './middleware/validation';
import { createOrderSchema } from './core/validations/orders';
import {
	getStores,
	createStore,
	followStore,
	unfollowStore,
	createStoreProduct,
	getCurrentStore,
	getStoreById,
	getStoreProducts,
	getStoreManagers,
	getStorePayouts,
	getStoreOrders
} from './controllers/stores';
import {
	getProductById,
	getProductReviews,
	createProductReview,
	getRelatedProducts,
	getProducts,
	updateProduct
} from './controllers/products';
import {
	getCurrentUser,
	updateCurrentUser,
	getFollowedStores,
	getManagedStores,
	getOrders as getUserOrders,
	getCarts,
	getCards,
	getDeliveryAddresses,
	getUsers,
	getUser
} from './controllers/users';
import { getPayouts, getPayout, updatePayout } from './controllers/payouts';
import {
	getCartById,
	addProductToCart,
	removeProductFromCart,
	updateCartProductQuantity,
	getCartsFromList
} from './controllers/carts';
import {
	register,
	login,
	verify,
	appleCallback,
	refresh,
	logout
} from './controllers/auth';
import {
	registerBodySchema,
	authenticateBodySchema,
	verifyCodeBodySchema
} from './core/validations/auth';
import { login as adminLogin, getOverview } from './controllers/admin';
import { checkHealth } from './controllers/health';
import {
	approvePayment,
	verifyTransaction,
	verifyTransfer
} from './controllers/payments';
import { globalSearch } from './controllers/search';
import { paystackWebhook } from './controllers/webhooks';
import { authorizeCard } from './controllers/cards';
import { getLandingHighlights } from './controllers/highlights';

const router: Router = Router();

// Auth
router.post('/auth/register', validateBody(registerBodySchema), register);
router.post('/auth/login', validateBody(authenticateBodySchema), login);
router.post('/auth/verify-code', validateBody(verifyCodeBodySchema), verify);
router.post('/auth/apple-callback', appleCallback);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

// Orders
router.get('/orders', isAdmin, getOrders);
router.get('/orders/:id', authenticate, getOrderById);
router.post(
	'/orders',
	authenticate,
	validateBody(createOrderSchema),
	createOrder
);

// Stores
router.get('/stores', isAdmin, getStores);

router.post('/stores', authenticate, createStore);
router.post('/stores/:id/follow', authenticate, followStore);
router.post('/stores/:id/unfollow', authenticate, unfollowStore);
router.post('/stores/:id/products', authenticate, createStoreProduct);

router.get('/stores/current', authenticate, getCurrentStore);
router.get('/stores/:id', optionalAuth, getStoreById);
router.get('/stores/:id/products', optionalAuth, getStoreProducts);
router.get('/stores/:id/managers', isAdmin, getStoreManagers);
router.get('/stores/:id/payouts', isAdmin, getStorePayouts);
router.get('/stores/:id/orders', optionalAuth, getStoreOrders);

// Products
router.get('/products/:id', optionalAuth, getProductById);
router.put('/products/:id', isAdmin, updateProduct);
router.get('/products/:id/reviews', optionalAuth, getProductReviews);

router.post('/products/:id/reviews', authenticate, createProductReview);
router.get('/products/:id/related', optionalAuth, getRelatedProducts);

router.get('/products', isAdmin, getProducts);

// Users
router.get('/users/current', authenticate, getCurrentUser);
router.put('/users/current', authenticate, updateCurrentUser);

router.get('/users/current/followed-stores', authenticate, getFollowedStores);
router.get('/users/current/managed-stores', authenticate, getManagedStores);
router.get('/users/current/orders', authenticate, getUserOrders);
router.get('/users/current/carts', authenticate, getCarts);
router.get('/users/current/cards', authenticate, getCards);
router.get(
	'/users/current/delivery-addresses',
	authenticate,
	getDeliveryAddresses
);

router.get('/users', isAdmin, getUsers);
router.get('/users/:id', isAdmin, getUser);

// Payouts
router.get('/payouts', isAdmin, getPayouts);
router.get('/payouts/:id', isAdmin, getPayout);
router.patch('/payouts/:id', isAdmin, updatePayout);

// Carts
router.get('/carts/', optionalAuth, getCartsFromList);
router.get('/carts/:id', optionalAuth, getCartById);
router.post('/carts/products', optionalAuth, addProductToCart);
router.put(
	'/carts/:id/products/:productId',
	authenticate,
	updateCartProductQuantity
);
router.delete(
	'/carts/:id/products/:productId',
	authenticate,
	removeProductFromCart
);

// Cards
router.post('/cards/authorize', authenticate, authorizeCard);

// Admin
router.post('/admin/login', validateBody(authenticateBodySchema), adminLogin);
router.get('/admin/overview', getOverview);

// Health
router.get('/health', checkHealth);

// Payments
router.post('/payments/verify-transaction', verifyTransaction);
router.post('/payments/verify-transfer', verifyTransfer);
router.post('/payments/approve-payment', approvePayment);

// Search
router.get('/search', globalSearch);

// Landing
router.get('/landing/highlights', optionalAuth, getLandingHighlights);

// Webhooks
router.post('/webhooks/paystack', paystackWebhook);

export default router;
