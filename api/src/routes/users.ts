import { Router, Request, Response } from 'express';

import prismaClient from '../config/prisma';
import UserController from '../controllers/users';
import { authenticate } from '../middleware/auth';

const router: Router = Router();
const userController = new UserController();

router.get('/current', authenticate, userController.getCurrentUser);
router.get(
	'/current/followed-stores',
	authenticate,
	userController.getFollowedStores
);
router.get('/current/orders', authenticate, userController.getOrders);
router.get('/current/carts', authenticate, userController.getCarts);
router.get('/current/cards', authenticate, userController.getCards);
router.get(
	'/current/delivery-addresses',
	authenticate,
	userController.getDeliveryAddresses
);

// PUT /users/current
router.put('/current', authenticate, async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const { name, email } = req.body;

	const updatedUser = await prismaClient.user.update({
		where: { id: req.auth!.id },
		data: { name, email }
	});

	return res.json({ user: updatedUser });
});

export default router;
