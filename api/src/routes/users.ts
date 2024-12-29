import { and, eq } from 'drizzle-orm';
import { Router, Request, Response } from 'express';

import { APIException } from './types';
import { db } from '../db';
import { User, DeliveryAddress } from '../db/schema';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

// GET /users/current
router.get('/current', authenticate, async (req: Request, res: Response) => {
	console.log('current user', req.auth!.id);
	const user = await db.query.User.findFirst({
		where: eq(User.id, req.auth!.id),
		with: { deliveryAddresses: true, cards: true }
	});

	if (!user) {
		throw new APIException(404, 'User not found');
	}

	return res.json({ currentUser: user });
});

// PUT /users/current
router.put('/current', authenticate, async (req: Request, res: Response) => {
	const { name, email } = req.body;

	const [updatedUser] = await db
		.update(User)
		.set({ name, email })
		.where(eq(User.id, req.auth.id))
		.returning();

	return res.json({ user: updatedUser });
});

// GET /users/current/delivery-addresses
router.get(
	'/current/delivery-addresses',
	authenticate,
	async (req: Request, res: Response) => {
		const addresses = await db.query.DeliveryAddress.findMany({
			where: eq(DeliveryAddress.userId, req.auth.id)
		});

		return res.json({ addresses });
	}
);

// POST /users/current/delivery-addresses
router.post(
	'/current/delivery-addresses',
	authenticate,
	async (req: Request, res: Response) => {
		const { name } = req.body;

		const [address] = await db
			.insert(DeliveryAddress)
			.values({ userId: req.auth.id, name })
			.returning();

		return res.status(201).json({ address });
	}
);

// PUT /users/current/delivery-addresses/:id
router.put(
	'/current/delivery-addresses/:id',
	authenticate,
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { name } = req.body;

		if (!id) {
			throw new APIException(400, 'Delivery address id is required');
		}

		const address = await db.query.DeliveryAddress.findFirst({
			where: and(
				eq(DeliveryAddress.id, id),
				eq(DeliveryAddress.userId, req.auth.id)
			)
		});

		if (!address) {
			throw new APIException(404, 'Delivery address not found');
		}

		const [updatedAddress] = await db
			.update(DeliveryAddress)
			.set({ name })
			.where(eq(DeliveryAddress.id, id))
			.returning();

		return res.json({ data: updatedAddress });
	}
);

// DELETE /users/current/delivery-addresses/:id
router.delete(
	'/current/delivery-addresses/:id',
	authenticate,
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id) {
			throw new APIException(400, 'Delivery address id is required');
		}

		const address = await db.query.DeliveryAddress.findFirst({
			where: and(
				eq(DeliveryAddress.id, id),
				eq(DeliveryAddress.userId, req.auth.id)
			)
		});

		if (!address) {
			throw new APIException(404, 'Delivery address not found');
		}

		await db.delete(DeliveryAddress).where(eq(DeliveryAddress.id, id));

		return res.json({ message: 'Delivery address deleted successfully' });
	}
);

export default router;
