import { Router } from 'express';

import {
	getCurrentUser,
	updateCurrentUser,
	getFollowedStores,
	getManagedStores,
	getOrders,
	getCarts,
	getCards,
	getDeliveryAddresses,
	getUsers,
	getUser
} from '../controllers/users';
import { authenticate, isAdmin } from '../middleware/auth';

const router: Router = Router();

router.get('/current', authenticate, getCurrentUser);
router.put('/current', authenticate, updateCurrentUser);

router.get('/current/followed-stores', authenticate, getFollowedStores);
router.get('/current/managed-stores', authenticate, getManagedStores);
router.get('/current/orders', authenticate, getOrders);
router.get('/current/carts', authenticate, getCarts);
router.get('/current/cards', authenticate, getCards);
router.get('/current/delivery-addresses', authenticate, getDeliveryAddresses);

router.get('/', isAdmin, getUsers);
router.get('/:id', isAdmin, getUser);

export default router;
