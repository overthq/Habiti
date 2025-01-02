import { eq } from 'drizzle-orm';
import { Router, Request, Response } from 'express';

import UserController from '../controllers/users';
import { db } from '../db';
import { User } from '../db/schema';
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
	const { name, email } = req.body;

	const [updatedUser] = await db
		.update(User)
		.set({ name, email })
		.where(eq(User.id, req.auth!.id))
		.returning();

	return res.json({ user: updatedUser });
});

export default router;
