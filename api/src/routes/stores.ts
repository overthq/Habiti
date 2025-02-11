import { Router } from 'express';

import StoreController from '../controllers/stores';
import { authenticate, isAdmin, optionalAuth } from '../middleware/auth';

const router: Router = Router();

const storeController = new StoreController();

router.get('/', isAdmin, storeController.getStores);

router.post('/', authenticate, storeController.createStore);
router.post('/:id/follow', authenticate, storeController.followStore);
router.post('/:id/unfollow', authenticate, storeController.unfollowStore);
router.post('/:id/products', authenticate, storeController.createStoreProduct);

router.get('/current', authenticate, storeController.getCurrentStore);
router.get('/:id', optionalAuth, storeController.getStoreById);
router.get('/:id/products', optionalAuth, storeController.getStoreProducts);
router.get('/:id/managers', isAdmin, storeController.getStoreManagers);
router.get('/:id/payouts', isAdmin, storeController.getStorePayouts);
router.get('/:id/orders', optionalAuth, storeController.getStoreOrders);

export default router;
