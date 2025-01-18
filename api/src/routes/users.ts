import { Router } from 'express';

import UserController from '../controllers/users';
import { authenticate, isAdmin } from '../middleware/auth';

const router: Router = Router();
const userController = new UserController();

router.get('/current', authenticate, userController.getCurrentUser);
router.put('/current', authenticate, userController.updateCurrentUser);

router.get(
	'/current/followed-stores',
	authenticate,
	userController.getFollowedStores
);
router.get(
	'/current/managed-stores',
	authenticate,
	userController.getManagedStores
);
router.get('/current/orders', authenticate, userController.getOrders);
router.get('/current/carts', authenticate, userController.getCarts);
router.get('/current/cards', authenticate, userController.getCards);
router.get(
	'/current/delivery-addresses',
	authenticate,
	userController.getDeliveryAddresses
);

router.get('/', isAdmin, userController.getUsers);
router.get('/:id', isAdmin, userController.getUser);

export default router;
