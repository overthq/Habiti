import { Router } from 'express';

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
} from '../controllers/stores';
import { authenticate, isAdmin, optionalAuth } from '../middleware/auth';

const router: Router = Router();

router.get('/', isAdmin, getStores);

router.post('/', authenticate, createStore);
router.post('/:id/follow', authenticate, followStore);
router.post('/:id/unfollow', authenticate, unfollowStore);
router.post('/:id/products', authenticate, createStoreProduct);

router.get('/current', authenticate, getCurrentStore);
router.get('/:id', optionalAuth, getStoreById);
router.get('/:id/products', optionalAuth, getStoreProducts);
router.get('/:id/managers', isAdmin, getStoreManagers);
router.get('/:id/payouts', isAdmin, getStorePayouts);
router.get('/:id/orders', optionalAuth, getStoreOrders);

export default router;
